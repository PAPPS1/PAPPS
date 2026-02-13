import express from "express";
import {
  getOrgMembers,
  addOrgMember,
  updateOrgMember,
  deleteOrgMember,
} from "../controllers/orgMemberController.js";

const router = express.Router();

router.get("/", getOrgMembers); // GET all members
router.post("/", addOrgMember); // ADD new member
router.put("/:id", updateOrgMember); // EDIT member by MongoDB _id
router.delete("/:id", deleteOrgMember); // DELETE member by MongoDB _id

export default router;
