import express from "express";
import upload from "../middleware/upload.js"; // Import middleware
import {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} from "../controllers/Product.js";

const router = express.Router();

router.get("/getproducts", getAllProducts);
router.get("/getproducts/:id", getProductById);
router.post("/addproducts", upload.single("file"), addProduct);
router.put("/updateproducts/:id", upload.single("file"), updateProduct);
router.delete("/deleteproducts/:id", deleteProduct);

// ✅ Image Upload Route
router.post("/upload", upload.single("file"), uploadImage);

export default router;