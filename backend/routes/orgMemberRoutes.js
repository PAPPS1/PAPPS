import express from "express";
import {
  getOrgMembers,
  getSingleOrgMember,
  addOrgMember,
  updateOrgMember,
  deleteOrgMember,
  upload, // ✅ import multer upload
} from "../controllers/orgMemberController.js";

const router = express.Router();

/* ================= GET ROUTES ================= */

// GET all members
router.get("/", getOrgMembers);

// GET single member
router.get("/:id", getSingleOrgMember);

/* ================= POST / PUT ROUTES (WITH IMAGE UPLOAD) ================= */

// ADD new member (image upload enabled)
router.post("/", upload.single("image"), addOrgMember);

// UPDATE member (image upload enabled)
router.put("/:id", upload.single("image"), updateOrgMember);

/* ================= DELETE ROUTE ================= */

router.delete("/:id", deleteOrgMember);

export default router;
