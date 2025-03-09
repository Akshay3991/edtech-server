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
        } // ✅ Added description field
    },
    { timestamps: true } // ✅ Automatically adds `createdAt` & `updatedAt`
);

export const Product = mongoose.model("Product", ProductSchema);
