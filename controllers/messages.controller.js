import { createError } from '../utils/error.js'
import {MessageModel} from '../models/message.model.js'

export const postMsg = async(req,res, next)=> {
    try {
        const newMsg = await MessageModel.create(req.body)
        res.status(200).json(newMsg)
        
    } catch (error) {
        createError(500, 'could not create msg')
    }
    
}

export const getMsgs = async(req,res, next)=> {
    try {
        const messages = await MessageModel.find({
            conversationId: req.params.convId
        })
        res.status(200).json(messages)
    } catch (error) {
        createError(500, 'could not create msg')    
    }
}

