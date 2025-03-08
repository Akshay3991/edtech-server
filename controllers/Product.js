import { Product } from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        fs.unlinkSync(req.file.path); // Remove local file after upload

        res.status(200).json({ secure_url: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: "Image upload failed", error });
    }
};
// Upload Image to Cloudinary
const uploadImageToCloudinary = async (file) => {
    try {
        const result = await cloudinary.v2.uploader.upload(file.path);
        fs.unlinkSync(file.path); // Remove local file after upload
        return result.secure_url;
    } catch (error) {
        throw new Error("Image upload failed.");
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Add Product Controller
export const addProduct = async (req, res) => {
    try {
        let imageUrl = req.body.image; // Default to URL if provided

        if (req.file) {
            imageUrl = await uploadImageToCloudinary(req.file);
        }

        const { name, price } = req.body;
        const newProduct = new Product({ name, price, image: imageUrl });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Update Product Controller
export const updateProduct = async (req, res) => {
    try {
        let imageUrl = req.body.image; // Use existing image URL if not uploading new file

        if (req.file) {
            imageUrl = await uploadImageToCloudinary(req.file);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, image: imageUrl },
            { new: true }
        );

        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
