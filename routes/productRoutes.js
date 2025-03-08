import express from "express";
import upload from "../middleware/upload.js"; // Import middleware
import {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/Product.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", upload.single("file"), addProduct);
router.put("/products/:id", upload.single("file"), updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;