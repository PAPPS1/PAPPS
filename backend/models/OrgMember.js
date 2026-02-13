// models/OrgMember.js
import mongoose from "mongoose";

const orgMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  roleCategory: { type: String, required: true }, // President, Directorates, etc.
  tenure: String,
  description: String,
  affiliation: String,
  image: String,
});

export default mongoose.model("OrgMember", orgMemberSchema);
