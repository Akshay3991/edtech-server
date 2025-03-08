import multer from 'multer';
import { v2 as cloudinaryV2 } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv";
dotenv.config();


cloudinaryV2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryV2,
    params: {
        folder: "products", // Optional: Folder name in Cloudinary
        allowedFormats: ["jpg", "png", "jpeg"], // Optional: Format of the uploaded file
        public_id: (req, file) => file.originalname.split(".")[0], // Use filename as public_id 
    },
});

const upload = multer({ storage });

export default upload;




