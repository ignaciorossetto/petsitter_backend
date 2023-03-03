import { UserModel } from "../models/user.model.js"
import config from "../utils/config.js"
import { generateToken } from "../utils/verifyToken.js"

export const register = async (req,res,next) => { 
    res.status(200).json({
        success: true,
        payload: req.user
    })
 }
export const sitterRegister = async (req,res,next) => { 
    res.status(200).json({
        success: true,
        payload: req.user
    })
 }
export const login = async (req,res,next) => { 
    if(!req.user) return res.status(401).send('Invalid credentials')
    const { password, ...other } = req.user._doc
    const access_token = generateToken(other)
    res.cookie('access_token', access_token ,{
        domain: ".onrender.com",
        signed: true
    }).status(200).json({
        success: true,
        message: 'Logged in',
        payload: other
    })

 }
export const sitterLogin = async (req,res,next) => { 
    if(!req.user) return res.status(401).send('Invalid credentials')
    const { password, ...other } = req.user._doc
    const access_token = generateToken(other)
    res.cookie('access_token', access_token).status(200).json({
        success: true,
        message: 'Logged in',
        payload: other
    })

 }

 export const googleLoginCallback = async (req,res) => {
    if(!req.user) return res.status(401).send('Invalid credentials')
    const { password, ...other } = req.user._doc
    const access_token = generateToken(other)
    res.cookie('access_token', access_token).redirect(`${config.feUrl}/?loginG=success`)
}

export const updateUserInfo = async (req,res,next) => {
    const response = await UserModel.findById(req.user._id)
    const {password, ...other} = response._doc
    req.user = other
    const access_token = generateToken(other)
    res.status(200).cookie('access_token', access_token).json({
        success:true,
        payload: req.user
    })
}
export const checkAuth = async (req,res,next) => {
    res.status(200).json({
        success:true,
        payload: req.user
    })
}