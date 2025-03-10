import { Product } from "../models/Product.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";
import { v2 as cloudinary } from "cloudinary";

// 🔹 Get All Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("seller", "firstName lastName email");
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// 🔹 Get Product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("seller", "firstName lastName email");
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error("Get Product by ID Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// 🔹 Add Product
export const addProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock } = req.body;
        const seller = req.user.id; // Assuming seller info comes from auth middleware

        if (!name || !price || !description || !category || !stock || !req.files?.image) {
            return res.status(400).json({ success: false, message: "All fields are required, including image" });
        }

        // Upload Image to Cloudinary
        const productImage = await uploadImageToCloudinary(req.files.image, "Products");

        const newProduct = await Product.create({
            name,
            price,
            description,
            category,
            stock,
            seller,
            image: productImage.secure_url,
        });

        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error("Add Product Error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// 🔹 Update Product
export const updateProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock } = req.body;
        let updatedData = { name, price, description, category, stock };

        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (req.files?.image) {
            // ✅ Delete old image from Cloudinary
            if (existingProduct.image) {
                const publicId = existingProduct.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`Products/${publicId}`);
            }

            // ✅ Upload new image
            const productImage = await uploadImageToCloudinary(req.files.image, "Products");
            updatedData.image = productImage.secure_url;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🔹 Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // ✅ Delete image from Cloudinary
        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`Products/${publicId}`);
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
