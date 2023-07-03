import { Router } from "express";
import { createSitters, deleteAllSitters, getAllSitters, getSittersNearby } from "../controllers/sitters.controller.js";



const router = Router()

router.get('/', getAllSitters)
router.get('/createSitters', createSitters)
router.get('/getSittersNearby', getSittersNearby)
router.delete('/', deleteAllSitters)



export default router