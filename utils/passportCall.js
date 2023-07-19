import passport from 'passport'
import { createError } from './error.js'


const passportCall = (strategy, obj) => {

    return async(req,res,next) => {
        passport.authenticate(strategy, obj,  function(err, user, info) {
            if (err) {
                return next(err)
            }
            if(!user){
                console.log('err: ' ,err)
                console.log('user: ' ,user)
                console.log('info: ' ,info)
                return res.status(401).json({
                    error: info?.messages ? info?.messages : info?.toString()
                })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export default passportCall