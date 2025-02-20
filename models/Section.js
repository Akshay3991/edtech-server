import mongoose from "mongoose";

// Define the Section schema
const SectionSchema = new mongoose.Schema({
	sectionName: {
		type: String,
		required: true,
	},
	subSection: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "SubSection",
		},
	],
});

// Export the Section model
export const Section = mongoose.model("Section", sectionSchema);
