import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor", "Seller"],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    // ✅ Enhanced orderedProducts structure
    orderedProducts: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Store product reference
        quantity: { type: Number, required: true, min: 1 }, // Store quantity purchased (min 1)
        orderId: { type: String, required: true, trim: true }, // Store Razorpay Order ID
        paymentId: { type: String, required: true, trim: true }, // Store Payment ID
        purchasedAt: { type: Date, default: Date.now }, // Store purchase timestamp
      },
    ],
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    image: {
      type: String,
    },
    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress",
      },
    ],
  },
  { timestamps: true }
);

// Export the User model
export const User = mongoose.model("User", userSchema);
