import express from "express";
import {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/Product.js";
import { auth, isAdmin, isSeller } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get all products (Public Access)
router.get("/", getAllProducts);

// ✅ Get a single product by ID (Public Access)
router.get("/:id", getProductById);

// ✅ Add a new product (Only Sellers/Admins)
router.post("/", auth, isSeller, addProduct);

// ✅ Update product (Only Sellers/Admins)
router.put("/:id", auth, isSeller, updateProduct);

// ✅ Delete product (Only Admins)
router.delete("/:id", auth, isAdmin, deleteProduct);

export default router;
