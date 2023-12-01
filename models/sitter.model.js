import mongoose, { Schema } from "mongoose";


const sitterCollection = 'sitters'

const GeoSchema = new Schema({
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    },
    address: {
        type: String
    }
  }, {
    _id: false
  });  




const SitterSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,        
    },
    location: {
        type: GeoSchema,
        index: '2dsphere'
    },
    email:{
        type:String,
        required: true,
        unique:true,
        immutable: true,
    },
    confirmedAccount: {
        type: Boolean,
        default:false
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
    strategy: {
        type: String,
        required: true
    },
    desc: {
        type: String,
    },
    profileImg:{
        type: String
    },
    citas:{
        type:[{ type : Schema.Types.ObjectId, ref: 'citas' }]
    },
    price: {
        type: Number
    },
    addressFile: {
        type: String
    },
}, {timestamps: true})

SitterSchema.index({location: '2dsphere'})

export const SitterModel = mongoose.model(sitterCollection, SitterSchema) 