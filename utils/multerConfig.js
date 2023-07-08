import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images/pets");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

const uploadImgToServer = multer({ storage: multer.memoryStorage() });
export default uploadImgToServer