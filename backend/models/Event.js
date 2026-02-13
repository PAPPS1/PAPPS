import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  registrationLink: String,
  status: {
    type: String,
    enum: ["upcoming", "completed"],
    default: "upcoming",
  },
  videoLink: String,
});

export default mongoose.model("Event", eventSchema);
