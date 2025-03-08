import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ✅ Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Cloudinary Storage Setup
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "products", // Cloudinary folder for product images
        format: async (req, file) => "png", // Convert to PNG for consistency
        public_id: (req, file) => `${file.originalname.split(".")[0]}_${Date.now()}`, // Ensure uniqueness
    },
});

// ✅ Multer Upload Middleware
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // ✅ Limit file size to 5MB
});

export default upload;
