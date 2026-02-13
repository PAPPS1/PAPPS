import express from "express";
import Event from "../models/Event.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Get all
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Create (admin only)
router.post("/", verifyToken, async (req, res) => {
  if (!["admin", "senior_admin"].includes(req.user.role)) {
    return res.status(403).json({ msg: "Forbidden" });
  }

  const event = new Event(req.body);
  await event.save();

  res.json(event);
});

// Delete
router.delete("/:id", verifyToken, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

// Update event
router.put("/:id", verifyToken, async (req, res) => {
  try {
    if (!["admin", "senior_admin"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
