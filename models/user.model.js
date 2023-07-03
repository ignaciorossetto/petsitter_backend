import mongoose, { Schema } from "mongoose";

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
    fullAddress:{
        address: {
            type: String
        },
        latLng: {
            lat: {type: Number},
            lng: {type: Number}
          },
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
        default: undefined
    },
    pets: {
        type: [{ type : Schema.Types.ObjectId, ref: 'pets' }]
    },
    strategy: {
        type: String,
        required: true
    },
    confirmedAccount: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})


UserSchema.pre('findOne', function() {
    this.populate('pets')
  })
UserSchema.pre('findByIdAndUpdate', function() {
    this.populate('pets')
  })

export const UserModel = mongoose.model(userCollection, UserSchema) 