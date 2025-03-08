import multer from "multer";
import cloudinary from 'cloudinary';
import pkg from 'multer-storage-cloudinary';
import dotenv from "dotenv";
dotenv.config();

const { CloudinaryStorage } = pkg;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "products",
        format: async (req, file) => "png", // Supports 'jpeg', 'png', etc.
        public_id: (req, file) => file.originalname.split(".")[0], // Use filename as public_id
    },
});

const upload = multer({ storage });

export default upload;




