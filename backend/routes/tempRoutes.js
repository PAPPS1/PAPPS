// routes/memberRoutes.js
import express from "express";
import Member from "../models/member.js";

const router = express.Router();

// GET all members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find().sort({ paapsNo: 1 });
    res.json(members);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE member (FIXED paapsNo logic)
router.post("/", async (req, res) => {
  try {
    const lastMember = await Member.findOne().sort({ paapsNo: -1 });
    const newPaapsNo = lastMember ? lastMember.paapsNo + 1 : 1;

    const newMember = new Member({
      ...req.body,
      paapsNo: newPaapsNo,
      name: `${req.body.firstName} ${req.body.lastName}`,
    });

    const saved = await newMember.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving member:", err);

    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res
        .status(400)
        .json({ error: `Duplicate ${field}: ${err.keyValue[field]}` });
    }

    res.status(500).json({ error: err.message });
  }
});

// VERIFY member
router.post("/verify", async (req, res) => {
  try {
    const { email, paapsNo } = req.body;
    const member = await Member.findOne({ email, paapsNo });

    if (member) {
      res.json({ success: true, name: member.name });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error("Error verifying member:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE member
router.put("/:id", async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedMember);
  } catch (err) {
    console.error("Error updating member:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE member
router.delete("/:id", async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: "Member deleted" });
  } catch (err) {
    console.error("Error deleting member:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
