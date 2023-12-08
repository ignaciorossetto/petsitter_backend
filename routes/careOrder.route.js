import Router from 'express'
import { CareOrderModel } from '../models/careOrder.model.js'
import { createError } from '../utils/error.js'
import passportCall from '../utils/passportCall.js'

const router = Router()

//get all careorders. Also a filter via query available
router.get('/',  async(req,res,next)=> {
    try {
        const orderStatus = req.query.orderStatus ? {status: req.query.orderStatus} : {}
        const sitterId = req.query.sitterId ? {sitterId: req.query.sitterId} : {}
        const userId = req.query.userId ? {userId: req.query.userId} : {}
        const paymentStatus = req.query.paymentStatus ? {'paymentInfo.status': req.query.paymentStatus} : {}
        const filter = {
            ...orderStatus,
            ...sitterId,
            ...userId,
            ...paymentStatus
        }
        console.log(filter)
        const orders = await CareOrderModel.find(filter)
        res.json({
            status: 'OK',
            payload: orders
        })
    } catch (error) {
        next(error)
    }
})

// get one careOrder
router.get('/:id', async(req,res,next)=> {
    try {
        const id = req.params.id
        const order = await CareOrderModel.findById(id)
        if (!order) {
            return res.status(404).json({
                status: 'Not Found',
            })
        }
        res.json({
            status: 'OK',
            payload: order
        })
    } catch (error) {
        next(error)
    }
})

//create a new careOrder

router.post('/', async(req,res,next)=> {
    try {
        const order = req.body
        const sitterId = req.body.sitterId
        const userId = req.body.userId
        const petId = req.body.petId   

        const existingOrder = await CareOrderModel.find({
            $and: [
                {sitterId: sitterId},
                {userId: userId},
                {petId: petId},
                {
                    $or: [
                        {state: 'pending'},
                        {state: 'ongoing'}
                    ]
                }
            ],
        })
        if (existingOrder.length > 0) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Order pending/ongoing',
                payload: {
                    careOrderId: existingOrder[0]._id,
                    state: existingOrder[0].status
                }
            })
        }   
        const newOrder = await CareOrderModel.create(order)
        res.json({
            status: 'OK',
            payload: newOrder
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
});


router.put('/:id', async(req,res,next)=> {
    try {
        const id = req.params.id
        const obj = req.body 
        const newOrder = await CareOrderModel.findByIdAndUpdate(id, {
            $set: obj
        }, {
            new: true
        })
        if (!newOrder) createError(404, 'CareOrder not found')
        res.json({
            status: 'OK',
            payload: newOrder
        })
    } catch (error) {
        next(error)
    }
})

router.delete('/', async(req,res,next)=> {
    try {
        await CareOrderModel.deleteMany({})
        res.json({status: 'All deleted'})
    } catch (error) {
        next(error)
    }
})


export default router