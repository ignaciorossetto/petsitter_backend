import {Router} from 'express'
import {ConversationModel} from '../models/conversation.model.js'
import {UserModel} from '../models/user.model.js'
import {SitterModel} from '../models/sitter.model.js'
import { createError } from '../utils/error.js'
const router = Router()


//Create new conversation or response the existing one
router.post('/', async (req,res)=> {
    try {
        const response = await ConversationModel.find({
            members: {$all : [req.body.receiverId, req.body.senderId]}
        })
        console.log('conv route//post: ', response);
        if (response.length === 0) {
            const newConv = await ConversationModel.create({
                members: [req.body.senderId, req.body.receiverId]
            })
            res.status(200).json(newConv)
        }
        res.status(200).json(response[0])
    } catch (error) {
        createError(500, 'Could not send message')        
    }
})


//Get all the conversations to rendered them in chatMenuu
router.get('/user/current/:userId', async(req,res)=> {
        try {
            const conv = await ConversationModel.find({
                members: {$in : [req.params.userId]}
            })
            res.status(200).json(conv)
        } catch (error) {
            createError(500, 'Could not send message')        
            
        }

})

//Get the information of the receiver
router.get('/user/friend/:friendId', async(req,res)=> {
        try {
            if (req.params?.friendId) {
                if (req.query?.type === 'user') {
                    const friend = await SitterModel.findById(req.params?.friendId)

                    const {password, ...other} = friend?._doc
                    return  res.status(200).json(other)
                }
                else if (req.query?.type === 'sitter') {
                    const friend = await UserModel.findById(req.params?.friendId)

                    const {password, ...other} = friend?._doc
                    return res.status(200).json(other)
                }
            }
            
        } catch (error) {
            console.log(error)
            createError(500, 'Could not send message')        
            
        }

})


export default router