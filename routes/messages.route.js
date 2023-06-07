import {Router} from 'express'
import { getMsgs, postMsg } from '../controllers/messages.controller.js'
import passportCall from '../utils/passportCall.js'
const router = Router()

router.post('/', passportCall('jwt'), postMsg)
router.get('/:convId', passportCall('jwt'), getMsgs )



export default router