import { UserModel } from "../models/user.model.js";
import config from "../utils/config.js";
import { createError } from "../utils/error.js";
import { checkMailConfirmation, confirmUserByMail } from "../utils/mail.js";
import { generateToken } from "../utils/verifyToken.js";

export const register = async (req, res, next) => {
  res.status(200).json({
    success: true,
    payload: req.user,
  });
};

export const sitterRegister = async (req, res, next) => {
  res.status(200).json({
    success: true,
    payload: req.user,
  });
};

export const login = async (req, res, next) => {
  if (!req.user) return res.status(401).send("Invalid credentials");
  const { password, ...other } = req.user._doc;
  const access_token = generateToken(other._id +'@_@'+ other.username);
  // Expire of cookie time: 15 min ---- is different than the one of jwt
  const expireTime = 24 * 60 * 60 * 1000;
  res
    .cookie("access_token", access_token, {
        sameSite: 'None',
        secure: true,
        domain: "petsitterfinder-backend.onrender.com",
        signed: true
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
  res.cookie("access_token", access_token, {
    sameSite: "none",
    secure: true,
    maxAge: new Date(Date.now() + 900000),
    domain: '.petsitterfinder.com.ar'
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
      sameSite: "none",
      secure: true,
      maxAge: expireTime,
      domain: '.petsitterfinder.com.ar'
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
  const token = req.body.token;
  const email = req.body.email;
  try {
    const user = await UserModel.findOne({email: email})
    if (!user) {
       next(createError(404, 'User not found!'))
       return
    }
    // if(user.confirmedAccount) {
    //   next(createError(400, 'User is already confirmed!'))
    // }
    const userAuth = checkMailConfirmation(token, user)
    if (!userAuth) {
       next(createError(401, 'Token expired'))
    }
    try {
      await UserModel.findByIdAndUpdate(user._id, {
        confirmedAccount: true
      })
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
    try {
      const user = await UserModel.findOne({email: req.body.email})
      if (!user) {
        next(createError(404, 'User not found!'))
      }
      // if(user.confirmedAccount) {
      //   next(createError(400, 'User is already confirmed!'))
      // }
      await confirmUserByMail(user)
      res.json({
        status:200,
        payload: 'Confirmation mail sent correctly.'
      })
    } catch (error) {
      next(error)
    }
}
