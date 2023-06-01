import mongoose, { Schema } from "mongoose";
import config from '../utils/config.js'

const userCollection = 'users'

const UserSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,        
    },
    email:{
        type:String,
        required: true,
        unique:true,
        immutable: true,
    },
    type:{
        type:String,
        required: true,
        default: 'user',
        immutable: true,
    },
    newsCheckBox:{
        type: Boolean,
        default:false
    },
    admin:{
        type: Boolean,
        default:false
    },
    profileImg:{
        type: String,
        default: config.profileImg
    },
    pets: {
        type: [{ type : Schema.Types.ObjectId, ref: 'pets' }]
    },
    strategy: {
        type: String,
        required: true
    }
}, {timestamps: true})


UserSchema.pre('findOne', function() {
    this.populate('pets')
  })

export const UserModel = mongoose.model(userCollection, UserSchema) 