import {Router} from 'express'
import { createOrGetConv, getAllConvs, getReceiverInfo } from '../controllers/conversations.controller.js'
import passportCall from '../utils/passportCall.js'
const router = Router()


//Create new conversation or response the existing one
router.post('/', passportCall('jwt'), createOrGetConv)

//Get all the conversations to rendered them in chatMenuu
router.get('/user/current/:userId', passportCall('jwt'),  getAllConvs)

//Get the information of the receiver
router.get('/user/friend/:friendId', passportCall('jwt'), getReceiverInfo)


export default router