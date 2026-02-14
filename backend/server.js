// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import blogRoutes from "./routes/blogRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import eventRoutes from "./routes/event.js";
import orgMemberRoutes from "./routes/orgMemberRoutes.js";
import authRoutes from "./routes/auth.js";
import memberRoutes from "./routes/memberRoutes.js";
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://papps.vercel.app",
      "https://papps1.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ← ADD OPTIONS
    allowedHeaders: ["Content-Type", "Authorization"], // ← ADD THIS
    credentials: true,
  }),
);

//  VERY IMPORTANT FOR RAILWAY
app.options("*", cors());

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Routes
app.use("/api/blogs", blogRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/org-members", orgMemberRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("PAAPS Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
