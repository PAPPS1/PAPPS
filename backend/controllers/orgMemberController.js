import OrgMember from "../models/OrgMember.js";

/* ================= GET ALL MEMBERS (NO IMAGE) ================= */
export const getOrgMembers = async (req, res) => {
  try {
    // Exclude heavy base64 image field
    const members = await OrgMember.find({}).select("-image");

    return res.status(200).json(members);
  } catch (err) {
    console.error("Error fetching members:", err);
    return res.status(500).json({ error: err.message });
  }
};

/* ================= GET SINGLE MEMBER (WITH IMAGE) ================= */
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
    const {
      name,
      role,
      roleCategory,
      tenure,
      description,
      affiliation,
      image,
      linkedin,
      website,
    } = req.body;

    if (!name || !role || !roleCategory) {
      return res
        .status(400)
        .json({ error: "name, role, and roleCategory are required" });
    }

    const newMember = new OrgMember({
      name,
      role,
      roleCategory,
      tenure,
      description,
      affiliation,
      image,
      linkedin,
      website,
    });

    await newMember.save();

    // Return lightweight list
    const allMembers = await OrgMember.find({}).select("-image");

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
      image,
      linkedin,
      website,
    } = req.body;

    if (!id || !name || !role || !roleCategory) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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

    if (image !== undefined) member.image = image;
    if (linkedin !== undefined) member.linkedin = linkedin;
    if (website !== undefined) member.website = website;

    await member.save();

    // Return lightweight list
    const allMembers = await OrgMember.find({}).select("-image");

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

    if (!id) {
      return res.status(400).json({ error: "Missing member id" });
    }

    const member = await OrgMember.findByIdAndDelete(id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Return lightweight list
    const allMembers = await OrgMember.find({}).select("-image");

    return res.status(200).json(allMembers);
  } catch (err) {
    console.error("Error deleting member:", err);
    return res.status(500).json({ error: err.message });
  }
};
