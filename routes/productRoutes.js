import express from "express";
const router = express.Router();
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controllers/Product.js";
import { upload } from "../models/Product.js";

/// Get all products
router.get("/products", getAllProducts);

// Get a single product by ID
router.get("/products/:id", getProductById);

// Add a new product with image upload
router.post("/products", upload.single("image"), addProduct);

// Update a product with image upload
router.put("/products/:id", upload.single("image"), updateProduct);

// Delete a product
router.delete("/products/:id", deleteProduct);

export default router;
