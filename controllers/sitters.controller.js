import { createError } from "../utils/error.js";
import { SitterModel } from "../models/sitter.model.js";
import { faker } from "@faker-js/faker";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import config from "../utils/config.js";

const generateRandomHouse = (position) => {
  let direction = Math.random() < 0.5 ? -20 : 20
  const obj = {
    lat: position.lat + Math.random() / direction,
    lng: position.lng + Math.random() / direction,
  };

  return obj;
};

export const createSitters = async (req, res, next) => {
  
  const quantity = 15;
  let users = [];
  for (let i = 0; i < quantity; i++) {
    const ubic = generateRandomHouse({
      lat: -31.3791909,
      lng: -64.2376865,
    });
    const user = {
      username: faker.person.fullName(),
      password: "secret123",
      location: {
        type: "Point",
        coordinates: [ubic.lng, ubic.lat],
      },
      email: faker.internet.email(),
      type: "sitter-fake",
      newsCheckBox: false,
      admin: false,
      strategy: "local",
      desc: faker.person.bio(),
      profileImg: undefined,
      citas: [],
    };
    await SitterModel.create(user);
    users.push(user);
  }
  res.json({
    status: "ok",
    payload: users,
  });
};

export const getAllSitters = async (req, res, next) => {
  try {
    const sitters = await SitterModel.find({});
    res.json({
      status: "ok",
      payload: sitters,
    });
    
  } catch (error) {
    next(error)
  }
};

export const updateSitter = async(req,res,next)=>{
  try {
      const response = await SitterModel.findByIdAndUpdate(req.params.id, {$set: req.body}, {new:true})
      if (!response) {
          throw Error
      }
      const {password, ...other} = response._doc
      res.status(200).json(other)
  } catch (error) {
      next(error)
  }
}

export const deleteAllSitters = async (req, res, next) => {
  await SitterModel.deleteMany({});
  res.json({
    status: "ok",
  });
};

export const getSittersNearby = async (req, res, next) => {
  try {
    const radius = req.query.radius
    const obj = {
      lat: req.query.lat,
      lng: req.query.lng,
    };
    const response = await SitterModel.find({
      location: {
        $near: {
          $maxDistance: radius,
          $geometry: {
            type: "Point",
            coordinates: [obj.lng, obj.lat],
          },
        },
      },
    });
  
    res.json({
      status: "ok",
      payload: response,
    });
    
  } catch (error) {
    next(error)
  }
};


export const updateProfileImg = async(req,res,next) => {
  const app = initializeApp(config.firebaseConfig);
  const storage = getStorage()
  const file = req.file
  try {
      const storageRef = ref(storage, `profile/${req.params.id}/profileImage/${file.originalname}`)
      const metadata = {
          contentType: file.mimetype
      }
      const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata)
      const downloadURL = await getDownloadURL(snapshot.ref)
      const obj = {
          profileImg: downloadURL
      }
      const response = await SitterModel.findByIdAndUpdate(req.params.id, {$set: obj}, {new:true})
      if (!response) {
        createError(404, 'Users not found!')
      }
      const {password, ...other} = response._doc
      res.status(200).json(response)
      
  } catch (error) {
      next(error)
  }
}


