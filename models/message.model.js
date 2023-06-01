import mongoose from 'mongoose'

const messageCollection = 'messages'

const MessageSchema = new mongoose.Schema({
    conversationId:{
        type: String
    },
    sender: {
        type: String
    },
    text: {
        type: String
    }
},
{
    timestamps:true
}
)

export const MessageModel = mongoose.model(messageCollection, MessageSchema) 

