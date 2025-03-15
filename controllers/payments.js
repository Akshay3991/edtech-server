import crypto from "crypto"
import mongoose from "mongoose"
import { instance } from "../config/razorpay.js"
import { Product } from "../models/Product.js";
import { courseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js"
import { paymentSuccessEmail } from "../mail/templates/paymentSuccessEmail.js"
import { Course } from "../models/Course.js"
import { CourseProgress } from "../models/CourseProgress.js"
import { User } from "../models/User.js"
import mailSender from "../utils/mailSender.js"
import { productPaymentEmail } from "../mail/templates/productPaymentEmail.js";
// Capture the payment and initiate the Razorpay order
export const capturePayment = async (req, res) => {
  const { courses } = req.body
  const userId = req.user.id
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await Course.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId)
      if (course.studentsEnroled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
      }

      // Add the price of the course to the total amount
      total_amount += course.price
    } catch (error) {
      // console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    // console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    // console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
export const verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}

// Send Payment Success Email
export const sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    // console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnroled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      // console.log("Updated course: ", enrolledCourse)

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      // console.log("Enrolled student: ", enrolledStudent)
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )

      // console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      // console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}


// Capture product payment and initiate Razorpay order
export const captureProductPayment = async (req, res) => {
  let { products } = req.body;
  const userId = req.user.id;

  if (!products) {
    return res.status(400).json({ success: false, message: "No products selected" });
  }

  // Ensure products is an array
  if (!Array.isArray(products)) {
    products = [products];
  }

  let total_amount = 0;

  for (const productId of products) {
    let product;
    try {
      // console.log("Fetching product with ID:", productId);
      product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${productId}` });
      }

      total_amount += product.price;
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  const options = {
    amount: total_amount * 100, // Convert to paise
    currency: "INR",
    receipt: `order_${Date.now()}`,
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    res.json({ success: true, data: paymentResponse });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Verify product payment
export const verifyProductPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, products } = req.body;
    const userId = req.user.id;

    // 🔹 Validate Request Data
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !products || !Array.isArray(products) || products.length === 0 || !userId) {
      return res.status(400).json({ success: false, message: "Invalid payment details or product data." });
    }

    // 🔹 Verify Razorpay Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment Verification Failed" });
    }

    // 🔹 Fetch User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 🔹 Validate Products Before Updating User
    const validProducts = await Product.find({ _id: { $in: products.map((p) => p.productId) } });

    if (validProducts.length !== products.length) {
      return res.status(400).json({ success: false, message: "Some products were not found." });
    }

    // 🔹 Store Ordered Products in User Model
    const orderedProducts = products.map((p) => ({
      product: p.productId,
      quantity: p.quantity,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      purchasedAt: new Date(),
    }));

    user.orderedProducts.push(...orderedProducts);
    await user.save();
    console.log(user)
    // 🔹 Update Stock & Sold Count for Each Product Efficiently
    const bulkOperations = products.map((p) => ({
      updateOne: {
        filter: { _id: p.productId },
        update: { $inc: { stock: -p.quantity, sold: p.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOperations);

    return res.status(200).json({ success: true, message: "Payment Verified & Order Processed Successfully" });

  } catch (error) {
    console.error("Payment Verification Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// Send Payment Success Email for Products
export const sendProductPaymentEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({ success: false, message: "Incomplete payment details" });
  }

  try {
    const user = await User.findById(userId);
    await mailSender(
      user.email,
      "Payment Received - Product Purchase",
      productPaymentEmail(user.firstName, amount / 100, orderId, paymentId)
    );

    res.status(200).json({ success: true, message: "Payment email sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not send payment email" });
  }
};

// Process product order and update user purchase history
const processProductOrder = async (products, userId) => {
  for (const productId of products) {
    try {
      const purchasedProduct = await Product.findById(productId);
      if (!purchasedProduct) continue;

      await User.findByIdAndUpdate(
        userId,
        { $push: { purchasedProducts: productId } },
        { new: true }
      );
    } catch (error) {
      console.error("Error processing product order:", error);
    }
  }
};