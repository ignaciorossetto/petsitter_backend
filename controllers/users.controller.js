import { UserModel } from "../models/user.model.js";
import { createError } from "../utils/error.js";



export const updateUser = async(req,res,next)=>{
    try {
        const response = await UserModel.findByIdAndUpdate(req.params.id, {$set: req.body}, {new:true}) 
        if (!response) {
            throw Error
        }
        res.status(200).json(response)
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