import mongoose from 'mongoose'

const citasCollection = 'citas'

const rateSchema = new mongoose.Schema({
    rate: Number,
    review: String
})

const CitaSchema = new mongoose.Schema({
    petOwnerID: String,
    petID: String,
    dates: [String],
    rate: [rateSchema],
    status: String
})

export const CitaModel = mongoose.model(citasCollection, CitaSchema)