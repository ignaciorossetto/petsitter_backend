import mongoose from 'mongoose'

const conversationCollection = 'conversations'

const ConversationSchema = new mongoose.Schema({
    members: {
        type: Array
    }
},
{
    timestamp: true
}
)

export const ConversationModel = mongoose.model(conversationCollection, ConversationSchema ) 