import { PetModel } from "../models/pet.model.js";
import { UserModel } from "../models/user.model.js";
import config from "../utils/config.js";
import { createError } from "../utils/error.js";



export const createPet = async(req,res, next) => { 
    const{...petInfo} = req.body
    const petArray = req.files.map(element => {
        const imgPath = `${config.url}/${element.destination}/${element.originalname}`
        const refactoredimgPath = imgPath.replace('public', 'static')
        return refactoredimgPath
    });
    petInfo.images = petArray
    if(petInfo.dates){
        petInfo.dates = JSON.parse(petInfo.dates[1])
    }
    try {
        const response = await PetModel.create(petInfo)
        if (!response) {
            throw Error
        }
        try {
           await UserModel.findByIdAndUpdate(petInfo.ownerId, {$push : {
                pets: response._id
            }})
        } catch (error) {
          next(error)
        }

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
 }

export const updatePet = async(req,res, next)=>{
    console.log(req.body);
    console.log(req.params);
    try {
        const response = await PetModel.findByIdAndUpdate(req.params.pid, {$set: req.body}, {new:true})
          console.log(response);
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export const deletePet = async(req,res, next)=>{
    const userId = req.params.id
    const petId = req.params.pid

    try {
        const response = await PetModel.findByIdAndDelete(petId)
        try {
            await UserModel.findByIdAndUpdate(userId, {$pull : {
                pets: petId
            }})
        } catch (error) {
          return next(error)
        }   
        res.status(200).json("Pet deleted")
    } catch (error) {
        next(error)
    }
}

export const getPet = async(req,res, next)=>{
    try {
        const response = await PetModel.findById(req.params.id)
        if (!response) {
            throw Error
        }
        setTimeout(()=>{
            res.status(200).json(response)
        }, 1500)
    } catch (error) {
        next(createError(404, 'Pet not found!'))

    }
}

export const getAllPets = async(req,res, next)=>{
    let filter = {}
    filter.type = req.query.type
    filter.milisecondsDates = {$gt: Number(new Date())} 
    if(req.query.size){
        filter.size = req.query.size  
    }
    if(req.query.age){
        filter.age = req.query.age  
    }
    if(req.query.sex){
        filter.sex = req.query.sex  
    }
    if(req.query.available){
        filter.available = req.query.available  
    }
    try {
        const response = await PetModel.find(filter)
        if (!response) {
            throw Error
        }
        setTimeout(()=>{
            res.status(200).json(response)
      
        }, 2000)
        
    } catch (error) {
        next(createError(404, 'Pets not found!'))
    }
}

export const countPetsByCategory = async(req,res,next) => {
    const types = req.query.types.split(',')
    try {
        const list =  await Promise.all(types.map((type)=>{
            return PetModel.countDocuments({type: type, available: true, milisecondsDates: {$gt: Number(new Date())}})
        }))
        setTimeout(()=>{
            res.status(200).json(list)
      
        }, 1500)
    } catch (error) {
        next(error)
    }
}

export const getFeaturedPets = async(req,res,next) => {
        try {
            const response = await PetModel.find({available: true,featured: true, milisecondsDates: {$gt: Number(new Date())}})
            
            setTimeout(()=>{
                res.status(200).send(response)
          
            }, 2000)
        } catch (error) {
            next(error)
        }
    }
