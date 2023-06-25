import passport from 'passport'
import local from 'passport-local'
import GoogleStrategy from 'passport-google-oauth20'
import jwt from 'passport-jwt'
import config from './config.js'
import { UserModel } from '../models/user.model.js'
import { cookieExtractor } from './verifyToken.js'
import { createHash, isValidPassword } from './hashPass.js'
import { SitterModel } from '../models/sitter.model.js'
import { confirmUserByMail } from './mail.js'


const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt


const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    },
    async(req,username,password,done)=>{
        try {
            const user = await UserModel.findOne({email: username})
            if(user){
                return done(null, false, {messages: 'Usuario registrado, proba con otro email!'})
            }
            const hash = createHash(password)
            const newUser = {
                username: req.body.username,
                email: username,
                password: hash,
                pets: [],
                strategy: 'local',
                newsCheckBox: req.body.newsCheckBox,
                fullAddress: req.body.fullAddress
            }
            const result = await UserModel.create(newUser)
            await confirmUserByMail(result)
            req.user = result
            return done(null, result) 
        } catch (error) {
            console.log(error);
        }
    }
    ))
    passport.use('sitter-register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    },
    async(req,username,password,done)=>{
        try {
            const user = await SitterModel.findOne({email: username})
            if(user){
                return done(null, false, {messages: 'Usuario registrado, proba con otro email!'})
            }
            const hash = createHash(password)
            const newUser = {
                username: req.body.username,
                email: username,
                password: hash,
                strategy: 'local',
                newsCheckBox: req.body.newsCheckBox,
                fullAddress: req.body.fullAddress
            }
            const result = await SitterModel.create(newUser)
            await confirmUserByMail(result)
            req.user = result
            return done(null, result) 
        } catch (error) {
            console.log(error);
        }
    }
    ))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    },async(username,password,done)=>{
        try {
            const user = await UserModel.findOne({email: username})
            if (!user) {
                return done(null, false, {messages: 'Error en usuario/contrasena'})
            }
            if (user.strategy !== 'local') {
                return done(null, false, {messages: 'Usuario generado a traves de otra plataforma'})   
            }
            if(!isValidPassword(user, password)){
                return done(null, false, {messages: 'Error en usuario/contrasena'})
            }
            done(null, user)   
        } catch (error) {
            done(error)
        }
    }
    ))
    passport.use('sitter-login', new LocalStrategy({
        usernameField: 'email'
    },async(username,password,done)=>{
        try {
            const user = await SitterModel.findOne({email: username})
            if (!user) {
                return done(null, false, {messages: 'Error en usuario/contrasena'})
            }
            if (user.strategy !== 'local') {
                return done(null, false, {messages: 'Usuario generado a traves de otra plataforma'})   
            }
            if(!isValidPassword(user, password)){
                return done(null, false, {messages: 'Error en usuario/contrasena'})
            }
            done(null, user)   
        } catch (error) {
            done(error)
        }
    }
    ))

    passport.use('google', new GoogleStrategy(
        {
        clientID: config.googleClientID,
        clientSecret: config.googleClientSecret,
        callbackURL: `${config.url}/api/auth/google/callback`,
        passReqToCallback: true,
        scope: [ 'profile', 'email' ],
        failureFlash: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const user = await UserModel.findOne({email: profile._json.email})
                if (user) {
                    if (user?.strategy === 'google') {
                        return done(null, user)
                    }
                    if (user?.type === 'sitter') {
                        return done(null, false, {message: 'You are registered as a sitter with this email!'})
                    }
                    if (user?.strategy !== 'google') {
                        return done(null, false, {message: 'user already created with other platform'})
                    }
                }
                const newUser = {
                    username: profile._json.name,
                    email: profile._json.email,
                    password: '',
                    pets: [],
                    strategy: 'google',
                    profileImg: profile.photos[0].value,
                    confirmedAccount: true,
                    fullAddress: undefined
                }
                const result = await UserModel.create(newUser)
                req.user = result
                return done(null, result)
            } catch (error) {
                console.log(error);
            }
         }
      ))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwtSecret
    }, (jwt_payload, done)=> {
        const user = jwt_payload.user
        try {
            return done(null, user)
        } catch (error) {
            console.log(error);
            return done(error)
        }
    }
    ))

    passport.serializeUser((user, done) => {
        if (user._id) {
            return done(null, user._id)
        }
        if (user.user._doc._id) {
            return done(null, user.user._doc._id)
        }
    })
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}

export default initializePassport