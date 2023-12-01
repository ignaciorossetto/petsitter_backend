import { UserModel } from "../models/user.model.js";
import config from "../utils/config.js";
import { createError } from "../utils/error.js";
import { initializeApp } from "firebase/app";
import {getStorage, ref, getDownloadURL, uploadBytesResumable} from 'firebase/storage'





export const updateUser = async(req,res,next)=>{
    try {
        const response = await UserModel.findByIdAndUpdate(req.params.id, {$set: req.body}, {new:true}).populate('pets')
        if (!response) {
            throw Error
        }
        const {password, ...other} = response._doc
        res.status(200).json(other)
    } catch (error) {
        next(error)
    }
}
export const deleteUser = async(req,res,next)=>{
    try {
        const response = await UserModel.findByIdAndDelete(req.params.id)
        res.status(200).json("User deleted")
    } catch (error) {
        next(error)
    }
}
export const getUser = async(req,res, next)=>{
    try {
        const response = await UserModel.findById(req.params.id)
        if (!response) {
            throw Error
        }
        if(req.query.pass){
            const {password, ...other} = response._doc
            req.user = other
            res.status(200).json(other)
        }
    } catch (error) {
        next(createError(404, 'User not found!'))

    }
}
export const getAllUsers = async(req,res, next)=>{
    try {
        const response = await UserModel.find()
        if (!response) {
            throw Error
        }
        res.status(200).json(response)
        
    } catch (error) {
        next(createError(404, 'Users not found!'))
    }
}

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
        const response = await UserModel.findByIdAndUpdate(req.params.id, {$set: obj}, {new:true}).populate('pets')
        if (!response) {
            throw Error
        }
        const {password, ...other} = response._doc
        res.status(200).json(response)
        
    } catch (error) {
        next(createError(404, error))
    }
}