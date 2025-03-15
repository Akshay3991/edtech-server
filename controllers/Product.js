import { Product } from "../models/Product.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/User.js";
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
        const { name, price, description, category, stock, sold } = req.body;
        let updatedData = { name, price, description, category, stock, sold }; // ✅ Include `sold`

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

        // ✅ Explicitly log before updating
        console.log("Updating Product:", req.params.id, "with data:", updatedData);

        // ✅ Ensure `sold` value updates correctly
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: updatedData }, { new: true });

        // ✅ Log after update
        console.log("Updated Product:", updatedProduct);

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
export const getSellerProducts = async (req, res) => {
    try {
        const sellerId = req.user.id; // Get seller ID from the authenticated user

        const products = await Product.find({ seller: sellerId });

        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching seller products" });
    }
};
export const getPurchasedProducts = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user's ordered products and populate product details
        const user = await User.findById(userId)
            .populate({
                path: "orderedProducts.product", // Populate product details
                select: "name price image", // Select relevant fields
            });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // ✅ Ensure orderedProducts includes order details along with product info
        const purchasedProducts = user.orderedProducts.map((order) => ({
            product: order.product, // Populated product details
            quantity: order.quantity,
            orderId: order.orderId,
            paymentId: order.paymentId,
            purchasedAt: order.purchasedAt,
        }));

        res.status(200).json({ success: true, products: purchasedProducts });
    } catch (error) {
        console.error("Error fetching purchased products:", error);
        res.status(500).json({ success: false, message: "Failed to fetch purchased products" });
    }
};

