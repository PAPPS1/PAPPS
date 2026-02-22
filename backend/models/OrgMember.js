// models/OrgMember.js
import mongoose from "mongoose";

const orgMemberSchema = new mongoose.Schema(
  {
    name: String,
    affiliation: String,
    role: String,
    tenure: String,
    description: String,
    image: String,
    roleCategory: String,
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  { timestamps: true }, // 👈 THIS ENABLES createdAt & updatedAt
);

export default mongoose.model("OrgMember", orgMemberSchema);
