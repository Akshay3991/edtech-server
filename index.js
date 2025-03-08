// Importing necessary modules and packages
import express from "express";
import userRoutes from "./routes/user.js";
import profileRoutes from "./routes/profile.js";
import courseRoutes from "./routes/Course.js";
import paymentRoutes from "./routes/Payments.js";
import contactUsRoute from "./routes/Contact.js";
import { connect } from "./config/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { cloudinaryConnect } from "./config/cloudinary.js";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";

// Setting up port number
const PORT = process.env.PORT || 4000;
// Loading environment variables from .env file
dotenv.config();

// Connecting to database
connect();

// Middlewares
const app = express();
// Configure CORS options
const corsOptions = {
  origin: [process.env.FRONTEND_URL],
  // origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow cookies and authorization headers
};

// Enable CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
// app.use(
// 	cors({
// 		origin: "*",
// 		credentials: true,
// 	})
// );
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.get("/api/v1/test", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.json({ success: true, message: "CORS test successful" });
});

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/marketplace", marketRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// Testing the server
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

// Listening to the server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});

// End of code.
