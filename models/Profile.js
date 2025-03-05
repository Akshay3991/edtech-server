import mongoose from "mongoose";

// Define the Profile schema
const profileSchema = new mongoose.Schema({
	gender: {
		type: String,
	},
	dateOfBirth: {
		type: String,
	},
	about: {
		type: String,
		trim: true,
	},
	contactNumber: {
		type: Number,
		trim: true,
	},
});

// Export the Profile model
export const Profile = mongoose.model("Profile", profileSchema);
