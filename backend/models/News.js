import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  paragraph: { type: String, default: "" },
});

export default mongoose.model("News", newsSchema);
