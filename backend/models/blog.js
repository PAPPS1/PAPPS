import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  hook: { type: String, default: "" },
  paragraph: { type: String, default: "" }, // rich text content
  image: { type: String, default: "" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Blog", blogSchema);
