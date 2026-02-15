// routes/certificateRoutes.js

import express from "express";
import Attendance from "../models/attendance.js";
import Member from "../models/member.js";
import CertificateSettings from "../models/CertificateSettings.js";

const router = express.Router();

/* ============================================================
   SAVE / UPDATE ATTENDANCE
============================================================ */
router.post("/attendance", async (req, res) => {
  try {
    const { event, emails } = req.body;

    if (!event || !Array.isArray(emails)) {
      return res
        .status(400)
        .json({ error: "Event and emails array are required" });
    }

    const normalizedEmails = emails.map((e) => e.toLowerCase().trim());

    const attendance = await Attendance.findOneAndUpdate(
      { event },
      { event, emails: normalizedEmails },
      { new: true, upsert: true },
    );

    res.json({ success: true, attendance });
  } catch (err) {
    console.error("Error saving attendance:", err);
    res.status(500).json({ error: "Failed to save attendance" });
  }
});

/* ============================================================
   GET ATTENDANCE
============================================================ */
router.get("/attendance", async (req, res) => {
  try {
    const { event } = req.query;

    if (!event) {
      return res.status(400).json({ error: "Event is required" });
    }

    const attendance = await Attendance.findOne({ event });

    if (!attendance) {
      return res.json({ emails: [] });
    }

    res.json({ emails: attendance.emails });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

/* ============================================================
   CERTIFICATE SETTINGS (GET)
============================================================ */
router.get("/settings", async (req, res) => {
  try {
    let settings = await CertificateSettings.findOne();

    if (!settings) {
      settings = await CertificateSettings.create({
        topicName: "",
        resourcePerson: "",
        enabled: false,
      });
    }

    res.json(settings);
  } catch (err) {
    console.error("Error fetching certificate settings:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

/* ============================================================
   CERTIFICATE SETTINGS (SAVE / UPDATE)
============================================================ */
router.post("/settings", async (req, res) => {
  try {
    const { topicName, resourcePerson, enabled } = req.body;

    let settings = await CertificateSettings.findOne();

    if (!settings) {
      settings = new CertificateSettings({
        topicName,
        resourcePerson,
        enabled,
      });
    } else {
      settings.topicName = topicName;
      settings.resourcePerson = resourcePerson;
      settings.enabled = enabled;
    }

    await settings.save();

    res.json({ success: true, settings });
  } catch (err) {
    console.error("Error saving certificate settings:", err);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

/* ============================================================
   VERIFY MEMBER & ATTENDANCE
============================================================ */
router.post("/verify", async (req, res) => {
  try {
    const { email, paapsNo, event } = req.body;

    if (!email || !paapsNo || !event) {
      return res.status(400).json({
        success: false,
        error: "Email, PAAPS No, and event are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find member
    const member = await Member.findOne({
      paapsNo: Number(paapsNo),
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        error: "Member not found",
      });
    }

    if (member.email.toLowerCase().trim() !== normalizedEmail) {
      return res.status(404).json({
        success: false,
        error: "Member email does not match PAAPS number",
      });
    }

    // Check attendance
    const attendance = await Attendance.findOne({ event });

    if (!attendance || !attendance.emails.includes(normalizedEmail)) {
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
      event,
    });
  } catch (err) {
    console.error("Error verifying certificate:", err);
    res.status(500).json({
      success: false,
      error: "Server error while verifying certificate",
    });
  }
});

export default router;
