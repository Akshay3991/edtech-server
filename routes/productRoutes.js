import express from "express";
import {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/Product.js";

const router = express.Router();

router.get("/getproducts", getAllProducts);
router.get("/getproducts/:id", getProductById);
router.post("/addproducts", addProduct);
router.put("/updateproducts/:id", updateProduct);
router.delete("/deleteproducts/:id", deleteProduct);

export default router;
