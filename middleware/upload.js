import cloudinary from 'cloudinary';
import { v2 as cloudinaryV2 } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv";
dotenv.config();

const { CloudinaryStorage } = pkg;

cloudinaryV2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryV2,
    params: {
        folder: 'uploads', // Optional: Folder name in Cloudinary
        format: async (req, file) => 'png', // Optional: Format of the uploaded file
        public_id: (req, file) => `file_${Date.now()}`, // Optional: Unique public ID
    },
});

const upload = multer({ storage });

export default upload;




