import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user.model.js'
import { createError } from './error.js'
import config from './config.js'

export const generateToken = (user) => {
    const token = jwt.sign({user}, config.jwtSecret, {expiresIn: '24h'})
    return token
}

export const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies){
        token = req.cookies['access_token']
    }
    return token
}


export const verifyToken = (req,res, next) => {
    const token = req.cookies.access_token
    if(!token){
        return next(createError(401, 'You are not auth'))
    }
    jwt.verify(token, config.jwtSecret, (err, user)=>{
        if(err){
            return next(createError(403, 'Token is not valid'))
        }
        req.user = user.user
        next()
    })

}

export const verifyUser = (req,res,next) => {
    verifyToken(req, res, ()=> {
        if(req.user.id === req.params.id || req.user.admin) {
            next()
        } else{
           return next(createError(403, 'You are not auth'))
        }
    })
}
export const verifyAdmin = (req,res,next) => {
    verifyToken(req, res, ()=> {
        if(req.user.admin) {
            next()
        } else{
            return next(createError(403, 'You are not admin'))
        }
    })
}

//checks if the user is owner of the pet
export const verifyPetOwner = (req,res,next) => {
    verifyToken (req, res, async()=> {
        if(req.user.admin) {
            next()
        }else if(req.user._id === req.params.id){    
            const {pets} = await UserModel.findById(req.params.id)
            if(pets.some(e => e._id == req.params.pid)){
                return next()
            }
            next(createError(403, 'You are not the owner of that pet!!'))
        } else{
            return next(createError(403, 'You are not admin'))
        }
    })
}