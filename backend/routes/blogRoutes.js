import express from "express";
import Blog from "../models/blog.js";

const router = express.Router();

// ================= CREATE BLOG =================
// ================= CREATE BLOG =================
router.post("/", async (req, res) => {
  try {
    const { title, hook, paragraph, image } = req.body;

    const blog = new Blog({
      title: title || "",
      hook: hook || "",
      paragraph: paragraph || "",
      image: image || "",
    });

    const saved = await blog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= GET ALL BLOGS =================
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// ================= UPDATE BLOG =================
// ================= UPDATE BLOG =================
router.put("/:id", async (req, res) => {
  try {
    const { title, hook, paragraph, image } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, hook, paragraph, image },
      { new: true, runValidators: true },
    );

    if (!updatedBlog) return res.status(404).json({ error: "Blog not found" });
    res.json(updatedBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// ================= DELETE BLOG =================
router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

export default router;
