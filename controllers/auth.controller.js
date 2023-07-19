import { SitterModel } from "../models/sitter.model.js";
import { UserModel } from "../models/user.model.js";
import config from "../utils/config.js";
import { createError } from "../utils/error.js";
import { createHash } from "../utils/hashPass.js";
import { checkMailConfirmation, confirmUserByMail } from "../utils/mail.js";
import { generateToken } from "../utils/verifyToken.js";
import { initializeApp } from "firebase/app";
import {getStorage, ref, getDownloadURL, uploadBytesResumable} from 'firebase/storage'


export const register = async (req, res, next) => {
  console.log('req.file', req.file)
  console.log('req.files', req.files)
  res.status(200).json({
    success: true,
    payload: 'SUCCESS',
  });
};

export const sitterRegister = async (req, res, next) => {
  const latLng = JSON.parse(req.body.latLng)
  try {
    const user = await SitterModel.findOne({email: req.body.email})
    if(user){
      return res.status(401).json({
        status: 'Bad request',
        payload: 'Ya existe un usuario con ese email',
      }) 
    }
    
    const hashedPswd = createHash(req.body.password)
    const obj = {
      username: req.body.username,
      password: hashedPswd,
      addressFile: '',
      email: req.body.email,
      profileImg: '',
      termsCheckBock: 'true',
      newsCheckBox: 'false',
      location: {
        type: "Point",
        coordinates: [latLng[0], latLng[1]],
        address: req.body.address
      },
      strategy: 'local'
    }
    const newSitter = await SitterModel.create(obj)
    if (newSitter) {
      await confirmUserByMail(newSitter, 'sitter')
      const app = initializeApp(config.firebaseConfig);
      const storage = getStorage()
      let updatedSitter 
      for (let i = 0; i < req.files.length; i++) {
        const element = req.files[i];
        console.log(element.originalname)
        const storageRef = ref(storage, `sitter/${newSitter._id}/${req.files[i].originalname}/${req.files[i].originalname}`)
        const metadata = {
            contentType: element.mimetype
        }
        const snapshot = await uploadBytesResumable(storageRef, element.buffer, metadata)
        const downloadURL = await getDownloadURL(snapshot.ref)
        if (element.originalname === 'addressFile') {
          updatedSitter = await SitterModel.findByIdAndUpdate(newSitter._id, {addressFile: downloadURL}, {new:true})
        } else {
          updatedSitter = await SitterModel.findByIdAndUpdate(newSitter._id, {profileImg: downloadURL}, {new:true})
        }
        
      }
      const {password, ...other} = updatedSitter
      res.json({
        status: 'ok',
        payload: other
      })

    }
  } catch (error) {
    console.log(error)
    next(error)
  }
};

export const login = async (req, res, next) => {
  if (!req.user) return res.status(401).send("Invalid credentials");
  const { password, ...other } = req.user._doc;
  const access_token = generateToken(other._id +'@_@'+ other.username);
  // Expire of cookie time: 15 min ---- is different than the one of jwt
  const expireTime = 24 * 60 * 60 * 1000;
  res
    .cookie("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: expireTime
    })
    .status(200)
    .json({
      success: true,
      message: "Logged in",
      payload: other,
    });
};

export const sitterLogin = async (req, res, next) => {
  if (!req.user) return res.status(401).send("Invalid credentials");
  const { password, ...other } = req.user._doc;
  const access_token = generateToken(other);
  const expireTime = 24 * 60 * 60 * 1000;
  res
    .cookie("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: expireTime
    }).status(200).json({
    success: true,
    message: "Logged in",
    payload: other,
  });
};

export const googleLoginCallback = async (req, res) => {
  if (!req.user) return res.status(401).send("Invalid credentials");
  const { password, ...other } = req.user._doc;
  const access_token = generateToken(other._id +'@_@'+ other.username)
  const expireTime = 24 * 60 * 60 * 1000;
  res
  .cookie("access_token", access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: expireTime
  })
    .redirect(`${config.feUrl}?login-google=true`);
};

export const updateUserInfo = async (req, res, next) => {
  const response = await UserModel.findById(req.user._id);
  const { password, ...other } = response._doc;
  req.user = other;
  const access_token = generateToken(other);
  const expireTime = 24 * 60 * 60 * 1000;
  res.status(200).cookie("access_token", access_token, {
    sameSite: "none",
    secure: true,
    maxAge: expireTime,
    domain: '.petsitterfinder.com.ar'
  }).json({
    success: true,
    payload: req.user,
  });
};

export const checkAuth = async (req, res, next) => {
  res.status(200).json({
    success: true,
    payload: req.user,
  });
};

export const googleLoginAuthSendUser = async (req, res, next) => {
  res.status(200).json({
    success: true,
    payload: req.user,
  });
};

export const logOut = async (req, res, next) => {
  // Expire time: 15 min
  const expireTime = "Thu, Jan 01 1970 00:00:00 UTC;";
  res
    .cookie("access_token", "", { sameSite: "none", secure: true, maxAge: -1 })
    .status(200)
    .json({
      status: "success",
      payload: "Logout succesfully",
    });
};

export const checkAccountVerif = async (req,res,next) => { 
  const type = req.body.type
  const token = req.body.token;
  const email = req.body.email;
  console.log(type)
  try {
    const user = type === 'sitter' ? await SitterModel.findOne({email: email}) : await UserModel.findOne({email: email})
    console.log(user)
    if (!user) {
       next(createError(404, 'User not found!'))
       return
    }
    if(user?.confirmedAccount) {
      next(createError(400, 'User is already confirmed!'))
    }
    const userAuth = checkMailConfirmation(token, user)
    if (!userAuth) {
       next(createError(401, 'Token expired'))
    }
    try {
      if (type === 'sitter') {
        await SitterModel.findByIdAndUpdate(user._id, {
          confirmedAccount: true
        })
      } else {
        await UserModel.findByIdAndUpdate(user._id, {
          confirmedAccount: true
        })
      }
    } catch (error) {
      next(createError(500, 'Server error, try again later!'))
    }
    res.json({
      status: 200,
      payload: 'user verified correctly'
    })
  } catch (error) {
    next(error)
  }
}

export const resendConfirmationEmail = async(req,res,next) => {
  const type = req.query.type
    try {
      const user = type === 'sitter' ? await SitterModel.findOne({email: email}) : await UserModel.findOne({email: email})
      if (!user) {
        next(createError(404, 'Mail inexistente!'))
      }
      if(user?.confirmedAccount) {
        next(createError(400, 'Usuario ya está confirmado!'))
      }
      await confirmUserByMail(user)
      res.json({
        status:200,
        payload: 'Confirmation mail sent correctly.'
      })
    } catch (error) {
      next(error)
    }
}

