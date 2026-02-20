import express from "express";
import {
  getOrgMembers,
  getSingleOrgMember, // ✅ NEW
  addOrgMember,
  updateOrgMember,
  deleteOrgMember,
} from "../controllers/orgMemberController.js";

const router = express.Router();

// GET all members (WITHOUT image)
router.get("/", getOrgMembers);

// GET single member (WITH image)
router.get("/:id", getSingleOrgMember); // ✅ NEW ROUTE

// ADD new member
router.post("/", addOrgMember);

// EDIT member by MongoDB _id
router.put("/:id", updateOrgMember);

// DELETE member by MongoDB _id
router.delete("/:id", deleteOrgMember);

export default router;
