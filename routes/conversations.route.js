import {Router} from 'express'
import { createOrGetConv, getConvs, getSitterInfo, getUserInfo} from '../controllers/conversations.controller.js'
import passportCall from '../utils/passportCall.js'
const router = Router()


//Create new conversation or response the existing one
router.post('/', passportCall('jwt'), createOrGetConv)

//Get all conversations of a sitter/user to display in chat menu
router.get('/all/:userId', passportCall('jwt'),  getConvs)

//Get the information of a sitter
router.get('/user/sitter/:sitterId', passportCall('jwt'), getSitterInfo)

//Get the information of an user
router.get('/sitter/user/:userId', passportCall('jwt'), getUserInfo)


export default router