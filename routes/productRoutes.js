import express from "express";
import upload from "../middleware/upload.js"; // ✅ Import middleware
import {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} from "../controllers/Product.js";

const router = express.Router();

// ✅ Standardized route names
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", upload.single("file"), addProduct);
router.put("/products/:id", upload.single("file"), updateProduct);
router.delete("/products/:id", deleteProduct);

// ✅ Image Upload Route (separate from product upload)
router.post("/products/upload", upload.single("file"), uploadImage);

export default router;
