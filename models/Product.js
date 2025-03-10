import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"]
        },
        image: {
            type: String,
            required: [true, "Product image is required"],
            trim: true
        }, // ✅ Store Cloudinary URL
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true
        },
        category: {
            type: String,
            required: [true, "Product category is required"],
            trim: true
        }, // ✅ New category field
        stock: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock cannot be negative"]
        }, // ✅ Added stock management
        sold: {
            type: Number,
            default: 0
        }, // ✅ Track sold units
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Seller is required"]
        } // ✅ Track product seller
    },
    { timestamps: true } // ✅ Automatically adds `createdAt` & `updatedAt`
);

export const Product = mongoose.model("Product", ProductSchema);
