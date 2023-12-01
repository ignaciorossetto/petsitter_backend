import { Router } from "express";
import { createSitters, deleteAllSitters, getAllSitters, getSittersNearby, updateProfileImg, updateSitter } from "../controllers/sitters.controller.js";
import passportCall from "../utils/passportCall.js";
import uploadImgToServer from "../utils/multerConfig.js";



const router = Router()

router.get('/', getAllSitters)
router.put('/:id', passportCall('jwt'), updateSitter)
router.get('/createSitters', createSitters)
router.get('/getSittersNearby', passportCall('jwt'), getSittersNearby)
router.delete('/', deleteAllSitters)
router.post('/:id/profileImg', passportCall('jwt'), uploadImgToServer.single('profileImg'), updateProfileImg)




export default router