import {MessageModel} from '../models/message.model.js'

export const postMsg = async(req,res, next)=> {
    try {
        const newMsg = await MessageModel.create(req.body)
        res.status(200).json(newMsg)
        
    } catch (error) {
        next(error)
    }
    
}

export const getMsgs = async(req,res, next)=> {
    try {
        const messages = await MessageModel.find({
            conversationId: req.params.convId
        })
        res.status(200).json(messages)
    } catch (error) {
        next(error)    
    }
}

