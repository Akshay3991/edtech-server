import { Product } from "../models/Product.js";
import cloudinary from "cloudinary";
import fs from "fs";

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

export const addProduct = async (req, res) => {
    try {
        let imageUrl = req.body.image;

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
            fs.unlinkSync(req.file.path); // Remove the file from local storage
        }

        const { name, price } = req.body;
        const newProduct = new Product({ name, price, image: imageUrl });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: "Invalid data", error });
    }
};

export const updateProduct = async (req, res) => {
    try {
        let imageUrl = req.body.image;

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { ...req.body, image: imageUrl }, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
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
