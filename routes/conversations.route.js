import {Router} from 'express'
import { createOrGetConv, getAllSitterConvs, getAllUserConvs, getSitterInfo,  getUserInfo} from '../controllers/conversations.controller.js'
import passportCall from '../utils/passportCall.js'
const router = Router()


//Create new conversation or response the existing one
router.post('/', passportCall('jwt'), createOrGetConv)

//Get all the sitter conversations to render them in chatMenuu
router.get('/user/current/:userId', passportCall('jwt'),  getAllSitterConvs)

//Get all the user conversations to render them in chatMenuu
router.get('/sitter/current/:sitterId', passportCall('jwt'),  getAllUserConvs)

//Get the information of a sitter
router.get('/user/sitter/:sitterId', passportCall('jwt'), getSitterInfo)

//Get the information of an user
router.get('/sitter/user/:userId', passportCall('jwt'), getUserInfo)


export default router