import OrgMember from "../models/OrgMember.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

/* ================= MULTER SETUP ================= */
const storage = multer.memoryStorage();
export const upload = multer({ storage });

/* ================= GET ALL MEMBERS ================= */
export const getOrgMembers = async (req, res) => {
  try {
    // Now image is only a URL (small), safe to return
    const members = await OrgMember.find({});
    return res.status(200).json(members);
  } catch (err) {
    console.error("Error fetching members:", err);
    return res.status(500).json({ error: err.message });
  }
};

/* ================= GET SINGLE MEMBER ================= */
export const getSingleOrgMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await OrgMember.findById(id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    return res.status(200).json(member);
  } catch (err) {
    console.error("Error fetching single member:", err);
    return res.status(500).json({ error: err.message });
  }
};

/* ================= ADD MEMBER ================= */
export const addOrgMember = async (req, res) => {
  try {
    const body = req.body || {};

    const {
      name,
      role,
      roleCategory,
      tenure,
      description,
      affiliation,
      linkedin,
      website,
    } = body;

    if (!name || !role || !roleCategory) {
      return res
        .status(400)
        .json({ error: "name, role, and roleCategory are required" });
    }

    let imageUrl = "";

    // Upload to Cloudinary if file exists
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "org_members" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const newMember = new OrgMember({
      name,
      role,
      roleCategory,
      tenure,
      description,
      affiliation,
      image: imageUrl,
      linkedin,
      website,
    });

    await newMember.save();

    const allMembers = await OrgMember.find({});
    return res.status(201).json(allMembers);
  } catch (err) {
    console.error("Error adding member:", err);
    return res.status(500).json({ error: err.message });
  }
};

/* ================= UPDATE MEMBER ================= */
export const updateOrgMember = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      role,
      roleCategory,
      tenure,
      description,
      affiliation,
      linkedin,
      website,
    } = req.body;

    const member = await OrgMember.findById(id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    member.name = name;
    member.role = role;
    member.roleCategory = roleCategory;
    member.tenure = tenure;
    member.description = description;
    member.affiliation = affiliation;
    member.linkedin = linkedin;
    member.website = website;

    // If new image uploaded → replace
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "org_members" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      member.image = result.secure_url;
    }

    await member.save();

    const allMembers = await OrgMember.find({}).sort({ createdAt: -1 });
    return res.status(200).json(allMembers);
  } catch (err) {
    console.error("Error updating member:", err);
    return res.status(500).json({ error: err.message });
  }
};

/* ================= DELETE MEMBER ================= */
export const deleteOrgMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await OrgMember.findByIdAndDelete(id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const allMembers = await OrgMember.find({});
    return res.status(200).json(allMembers);
  } catch (err) {
    console.error("Error deleting member:", err);
    return res.status(500).json({ error: err.message });
  }
};
