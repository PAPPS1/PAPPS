// routes/certificateRoutes.js
import express from "express";
import Attendance from "../models/attendance.js";
import Member from "../models/member.js";

const router = express.Router();

/* ================= SAVE / UPDATE ATTENDANCE ================= */
router.post("/attendance", async (req, res) => {
  try {
    const { event, emails } = req.body;

    if (!event || !emails || !Array.isArray(emails)) {
      return res
        .status(400)
        .json({ error: "Event and emails array are required" });
    }

    // Convert all emails to lowercase and trim spaces
    const normalizedEmails = emails.map((e) => e.toLowerCase().trim());

    // Upsert attendance for the event
    const attendance = await Attendance.findOneAndUpdate(
      { event },
      { emails: normalizedEmails },
      { new: true, upsert: true },
    );

    res.json({ success: true, attendance });
  } catch (err) {
    console.error("Error saving attendance:", err);
    res.status(500).json({ error: "Failed to save attendance" });
  }
});

/* ================= GET ATTENDANCE EMAILS ================= */
router.get("/attendance", async (req, res) => {
  try {
    const { event } = req.query;
    if (!event) return res.status(400).json({ error: "Event is required" });

    const attendance = await Attendance.findOne({ event });
    if (!attendance) return res.json({ emails: [] });

    res.json({ emails: attendance.emails });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

/* ================= VERIFY MEMBER & ATTENDANCE ================= */
router.post("/verify", async (req, res) => {
  try {
    const { email, paapsNo, event } = req.body;

    if (!email || !paapsNo || !event) {
      return res
        .status(400)
        .json({ error: "Email, PAAPS No, and event are required" });
    }

    // Find member by PAAPS number
    const member = await Member.findOne({ paapsNo: Number(paapsNo) });
    if (!member) {
      return res
        .status(404)
        .json({ success: false, error: "Member not found" });
    }

    // Email must match
    if (member.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
      return res.status(404).json({
        success: false,
        error: "Member email does not match PAAPS number",
      });
    }

    // Check attendance for this event
    const attendance = await Attendance.findOne({ event });
    if (
      !attendance ||
      !attendance.emails.includes(email.toLowerCase().trim())
    ) {
      return res.status(404).json({
        success: false,
        error: "Attendance not recorded for this event",
      });
    }

    res.json({
      success: true,
      member: {
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        paapsNo: member.paapsNo,
      },
      event: attendance.event,
    });
  } catch (err) {
    console.error("Error verifying certificate:", err);
    res.status(500).json({ error: "Server error while verifying certificate" });
  }
});

export default router;
