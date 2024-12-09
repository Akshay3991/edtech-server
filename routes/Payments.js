// Import the required modules
import express from "express";
import {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
} from "../controllers/payments.js";
import { auth, isInstructor, isStudent, isAdmin } from "../middleware/auth.js";

const router = express.Router();
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);

export default router;
