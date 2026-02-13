import express from "express";
import News from "../models/News.js"; // Make sure you have a News model

const router = express.Router();

// GET all news
router.get("/", async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST single news
router.post("/", async (req, res) => {
  try {
    const { title, paragraph } = req.body;
    const newsItem = new News({ title, paragraph });
    const saved = await newsItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST multiple news (bulk) - optional, keep your existing one
router.post("/bulk", async (req, res) => {
  try {
    const newsItems = await News.insertMany(req.body);
    res.status(201).json(newsItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update news
router.put("/:id", async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE news
router.delete("/:id", async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
