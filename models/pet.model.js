import mongoose, { Schema } from "mongoose";

const petCollection = 'pets'

const PetSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    ownerId:{
        type:String,
        required:true
    },
    ownerName:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true,
        enum: ['S', 'M', 'L']
    },
    images:{
        type:[String],
        required:true
    },
    breed:{
        type:String,
    },
    desc:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true,
        enum: ['very-young', 'young', 'adult', 'elder']
    },
    sex:{
        type:String,
        enum: ['female', 'male'],
        required:true
    },
    featured:{
        type: Boolean,
        default:false
    },
    available: {
        type: Boolean,
        default: false
    },
    dates: {
        type: [String],
        default: []
    },
    milisecondsDates: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

export const PetModel = mongoose.model(petCollection, PetSchema) 