import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/* ================= JWT MIDDLEWARE ================= */
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id + role
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

/* ================= LOGIN (UNCHANGED) ================= */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: "Username and password required" });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      role: admin.role,
    });
  } catch (err) {
    console.error("Login route error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ================= CHANGE ADMIN PASSWORD ================= */
/* Only senior_admin can change admin password */

router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    console.log("=== CHANGE PASSWORD ROUTE STARTED ===");

    if (req.user.role !== "senior_admin") {
      console.log("Access denied: not senior admin");
      return res.status(403).json({ msg: "Access denied. Senior admin only." });
    }

    const { newPassword } = req.body;

    console.log("New password received:", newPassword);

    const adminAccount = await Admin.findOne({ username: "PAAPS.PAK" });

    console.log("Admin found:", adminAccount);

    if (!adminAccount) {
      console.log("Admin NOT found");
      return res.status(404).json({ msg: "Admin account not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    adminAccount.password = hashedPassword;

    await adminAccount.save();

    console.log("Password updated successfully in DB");

    res.json({ msg: "Admin password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
