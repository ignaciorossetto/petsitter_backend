import {Router} from 'express'
import {MessageModel} from '../models/message.model.js'
import { createError } from '../utils/error.js'
const router = Router()

router.post('/', async(req,res)=> {
    try {
        const newMsg = await MessageModel.create(req.body)
        res.status(200).json(newMsg)
        
    } catch (error) {
        createError(500, 'could not create msg')
    }
    
})

router.get('/:convId', async(req,res)=> {
    try {
        const messages = await MessageModel.find({
            conversationId: req.params.convId
        })
        res.status(200).json(messages)

    } catch (error) {
        createError(500, 'could not create msg')
        
    }
})



export default router