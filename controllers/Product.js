import { Product } from "../models/Product.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";
import { v2 as cloudinary } from "cloudinary";

// 🔹 Get All Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// 🔹 Get Product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Get Product by ID Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// 🔹 Add Product
export const addProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        if (!name || !price || !description || !req.files || !req.files.image) {
            return res.status(400).json({ message: "Name, price, description, and image are required" });
        }

        // Upload the Image to Cloudinary
        const productImage = await uploadImageToCloudinary(req.files.image, "Products");

        const newProduct = new Product({
            name,
            price,
            description,
            image: productImage.secure_url
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Add Product Error:", error);
        res.status(400).json({ message: error.message });
    }
};

// 🔹 Update Product
export const updateProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        let updatedData = { name, price, description };

        if (req.files && req.files.image) {
            // Upload new image to Cloudinary
            const productImage = await uploadImageToCloudinary(req.files.image, "Products");
            updatedData.image = productImage.secure_url;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 🔹 Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
