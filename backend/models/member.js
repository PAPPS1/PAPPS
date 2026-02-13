// models/member.js
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  institute: { type: String },
  designation: { type: String },
  qualification: { type: String },
  country: { type: String },
  paapsNo: { type: Number, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

memberSchema.pre("save", function () {
  this.name = `${this.firstName} ${this.lastName}`;
});

export default mongoose.model("Member", memberSchema);
