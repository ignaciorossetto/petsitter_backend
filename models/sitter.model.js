import mongoose, { Schema } from "mongoose";

const sitterCollection = 'sitters'

const SitterSchema = new Schema({
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
    type: {
        type:String,
        required: true,
        default: 'sitter',
        immutable: true
    },
    newsCheckBox:{
        type: Boolean,
        default:false
    },
    admin:{
        type: Boolean,
        default:false
    },
    rate: {
        type: [Number],
        default:[]
    },
    strategy: {
        type: String,
        required: true
    },
    desc: {
        type: String,
    }
}, {timestamps: true})



export const SitterModel = mongoose.model(sitterCollection, SitterSchema) 