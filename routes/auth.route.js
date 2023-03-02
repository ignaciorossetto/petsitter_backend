import { Router } from "express";
import { register, login, googleLoginCallback, checkAuth, updateUserInfo, sitterRegister, sitterLogin } from "../controllers/auth.controller.js";
import config from "../utils/config.js";
import passportCall from "../utils/passportCall.js";

const router = Router()

router.post('/register', passportCall('register', {failureRedirect: `${config.feUrl}/register?register_status=failed`}), register)
router.post('/sitter-register', passportCall('sitter-register', {failureRedirect: `${config.feUrl}/sitter-register?register_status=failed`}), sitterRegister)
router.post('/login', passportCall('login', {session:false}), login)
router.post('/sitter-login', passportCall('sitter-login', {session:false}), sitterLogin)
router.get('/checkauth',passportCall('jwt'), checkAuth)
router.get('/updateUser',passportCall('jwt'), updateUserInfo)
router.get('/google',passportCall('google', {prompt : "select_account"}), (req,res)=>{})
router.get('/google/callback',passportCall('google', {successRedirect: config.feUrl ,failureRedirect: `${config.feUrl}/login?loginGoogle=failed`}), googleLoginCallback)


export default router