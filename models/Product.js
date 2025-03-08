import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true }, // Store Cloudinary URL
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
