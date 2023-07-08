import { Router } from "express";
import { createPet, deletePet, updatePet } from "../controllers/pets.controller.js";
const router = Router()
import { 
    updateUser,
    deleteUser,
    getUser,
    getAllUsers,
    updateProfileImg
 } from "../controllers/users.controller.js";
import { verifyUser, verifyAdmin, verifyPetOwner } from "../utils/verifyToken.js";
import passportCall from "../utils/passportCall.js";
import uploadImgToServer from "../utils/multerConfig.js";



// router.get('/checkauth', verifyToken, (req, res, next)=>{
//     res.send('You are logged in')
// })
// router.get('/checkuser/:id', verifyUser, (req, res, next)=>{
//     res.send('Hello user')
// })
// router.get('/checkadmin/:id', verifyAdmin, (req, res, next)=>{
//     res.send('Hello Admin')
// })


//UPDATE USER
router.put('/:id', verifyUser, updateUser)
//DELETE USER
router.delete('/:id',verifyUser, deleteUser)
//GET USER
router.get('/:id',passportCall('jwt'), getUser)
//GET ALL USERS
router.get('/',verifyAdmin, getAllUsers)
//UPDATE USER PROFILEIMG
router.post('/:id/profileImg', uploadImgToServer.single('profileImg'), updateProfileImg)



//CREATE PET
router.post('/:id/pets',verifyUser, createPet)
//UPDATE PET
router.put('/:id/pets/:pid',verifyPetOwner, updatePet)
//DELETE PET
router.delete('/:id/pets/:pid',verifyPetOwner, deletePet)

export default router