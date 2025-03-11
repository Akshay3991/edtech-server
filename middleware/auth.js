// Importing required modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";

// Configuring dotenv
dotenv.config();

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    // Extracting JWT from request cookies, body or header
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If JWT is missing, return 401 Unauthorized response
    if (!token) {
      return res.status(401).json({ success: false, message: "Token Missing" });
    }

    try {
      // Verifying the JWT using the secret key stored in environment variables
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      // Storing the decoded JWT payload in the request object for further use
      req.user = decode;
    } catch (error) {
      // If JWT verification fails, return 401 Unauthorized response
      return res.status(401).json({ success: false, message: "Token is invalid" });
    }

    // If JWT is valid, move on to the next middleware or request handler
    next();
  } catch (error) {
    // If there is an error during the authentication process, return 401 Unauthorized response
    return res.status(401).json({
      success: false,
      message: "Something Went Wrong While Validating the Token",
    });
  }
};

// Check if the user is a Student
const isStudent = async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user.id);

    if (userDetails.accountType !== "Student") {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Protected Route for Students",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "User Role Can't be Verified" });
  }
};

// Check if the user is an Admin
const isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user.id);

    if (userDetails.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Protected Route for Admins",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "User Role Can't be Verified" });
  }
};

// Check if the user is an Instructor
const isInstructor = async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user.id);

    if (userDetails.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Protected Route for Instructors",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "User Role Can't be Verified" });
  }
};

// Check if the user is a Seller
const isSeller = async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user.id);

    if (userDetails.accountType !== "Seller") {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Protected Route for Sellers",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "User Role Can't be Verified" });
  }
};

export { auth, isStudent, isAdmin, isInstructor, isSeller };
