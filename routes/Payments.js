// Import the required modules
import express from "express";
import {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
  captureProductPayment,
  verifyProductPayment,
  sendProductPaymentEmail,
} from "../controllers/payments.js";
import { auth, isInstructor, isStudent, isAdmin } from "../middleware/auth.js";

const router = express.Router();
// Course Payment Routes
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);
// Product Payment Routes
router.post("/capture-product-payment", auth, captureProductPayment);
router.post("/verify-product-payment", auth, verifyProductPayment);
router.post("/send-product-payment-email", auth, sendProductPaymentEmail);

export default router;


