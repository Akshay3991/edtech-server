import { Product } from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadImage = async (req, res) => {
    try {
        console.log("Received file:", req.file); // ✅ Debugging Step

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const result = await cloudinaryV2.uploader.upload(req.file.path);
        res.status(200).json({ secure_url: result.secure_url });
    } catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({ message: "Image upload failed", error });
    }
};


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
        let imageUrl = req.body.image || ""; // ✅ Use provided URL or upload new file

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path);
            imageUrl = result.secure_url;
        }

        const { name, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: "Name and price are required" });
        }

        const newProduct = new Product({ name, price, image: imageUrl });
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
        let imageUrl = req.body.image || ""; // ✅ Use existing image if no new file

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path);
            imageUrl = result.secure_url;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, image: imageUrl },
            { new: true }
        );

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
