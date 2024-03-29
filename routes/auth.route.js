import { Router } from "express";
import { register, login, googleLoginCallback, checkAuth, updateUserInfo, sitterRegister, sitterLogin, logOut, checkAccountVerif, resendConfirmationEmail, googleLoginAuthSendUser } from "../controllers/auth.controller.js";
import config from "../utils/config.js";
import passportCall from "../utils/passportCall.js";
import uploadImgToServer from "../utils/multerConfig.js";

const router = Router()

router.post('/register', passportCall('register', {failureRedirect: `${config.feUrl}/register?register_status=failed`}), register)
router.post('/sitter-register', uploadImgToServer.array('files'), sitterRegister)
router.post('/login', passportCall('login', {session:false}), login)
router.post('/sitter-login', passportCall('sitter-login', {session:false}), sitterLogin)
router.post('/checkAccount', checkAccountVerif)
router.post('/resendConfirmationMail', resendConfirmationEmail)
router.get('/',passportCall('jwt'), checkAuth)
router.get('/updateUser',passportCall('jwt'), updateUserInfo)
router.get('/logout', logOut)
router.get('/google',passportCall('google', {prompt : "select_account"}))
router.get('/google/callback',passportCall('google', {failureRedirect: `${config.feUrl}/login?loginGoogle=failed`}), googleLoginCallback)
router.get('/google/login',passportCall('jwt-google'), googleLoginAuthSendUser)


export default router