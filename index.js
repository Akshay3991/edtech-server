// Importing necessary modules and packages
import express from 'express';
import userRoutes from './routes/user.js';
import profileRoutes from './routes/profile.js';
import courseRoutes from './routes/Course.js';
import paymentRoutes from './routes/Payments.js';
import contactUsRoute from './routes/Contact.js';
import { connect } from './config/database.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { cloudinaryConnect } from './config/cloudinary.js';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';

// Setting up port number
const PORT = process.env.PORT || 4000;

// Loading environment variables from .env file
dotenv.config();

// Connecting to database
connect();

// Middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoutes);
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
