import {v2 as cloudinary} from "cloudinary";
import multer, { FileFilterCallback } from "multer";
import {  CloudinaryStorage } from "multer-storage-cloudinary";
import { Request } from "express";
import dotenv from "dotenv";

dotenv.config();
//Cofigure the cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//now configure cloudinary storage for the profiles
const profileImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req:Request, file: Express.Multer.File) => {
        const timestamp = Date.now()
        const fileName: any = file.originalname.split(".")[0];

        return {
            folder: "Pictures", //folder for profile images
             public_id: fileName-timestamp,
             resource_type: "image"
        }
    }
})

//Multer consifgurations for profile image uploads
const uploadProfileImage = multer({
    storage: profileImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => { // Correct!
        const allowedImageTypes = /image\/(jpeg|png|jpg|gif|webp)/i;

        if (!allowedImageTypes.test(file.mimetype)) {
            const error = new Error('Only JPG, JPEG, PNG, GIF, and WEBP files are allowed');
            return cb(null, false); // Return is important to prevent further execution
        }

        cb(null, true); // Correct: null in the success case
    }
});

export const uploadToCloudinaryProfileImage =
  uploadProfileImage.single("profileImage"); // Allow only one image at a time
