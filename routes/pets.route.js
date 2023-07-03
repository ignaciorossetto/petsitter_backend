import { Router } from "express";
const router = Router()
import { 
    createPet,
    updatePet,
    deletePet,
    getPet,
    getAllPets,
    countPetsByCategory,
    getFeaturedPets
 } from "../controllers/pets.controller.js";
import { verifyUser } from "../utils/verifyToken.js";
import passportCall from "../utils/passportCall.js";
import uploadImgToServer from "../utils/multerConfig.js";



 
//CREATE
router.post('/', uploadImgToServer.array('images'), createPet)
//UPDATE
router.put('/:id',passportCall('jwt'), updatePet)
//DELETE
router.delete('/:id/:pid', passportCall('jwt'), deletePet)
//GET
router.get('/find/:id', getPet)
//GET ALL
router.get('/', getAllPets)
//COUNT BY CATEGORY
router.get('/countByCat', countPetsByCategory)
//COUNT BY CATEGORY
router.get('/getFeaturedPets', getFeaturedPets)


export default router