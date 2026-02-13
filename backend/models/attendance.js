import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    event: { type: String, required: true, unique: true }, // each event has one record
    emails: { type: [String], default: [] }, // all emails of participants
  },
  { timestamps: true },
);

export default mongoose.model("Attendance", attendanceSchema);
