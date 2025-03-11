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

router.get("/getproducts", getAllProducts);
router.get("/getproducts/:id", getProductById);
router.post("/addproducts", auth, isSeller, addProduct);
router.put("/updateproducts/:id", auth, updateProduct);
router.delete("/deleteproducts/:id", auth, isAdmin, deleteProduct);

export default router;
