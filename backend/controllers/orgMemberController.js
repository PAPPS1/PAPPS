import OrgMember from "../models/OrgMember.js";

// GET all members
export const getOrgMembers = async (req, res) => {
  try {
    const members = await OrgMember.find({});
    res.json(members); // Return array of all members
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ error: err.message });
  }
};

// ADD new member
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
    });

    await newMember.save();

    const allMembers = await OrgMember.find({});
    res.json(allMembers);
  } catch (err) {
    console.error("Error adding member:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE member
export const updateOrgMember = async (req, res) => {
  try {
    const {
      name,
      role,
      roleCategory,
      tenure,
      description,
      affiliation,
      image,
    } = req.body;
    const { id } = req.params;

    if (!id || !name || !role || !roleCategory) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const member = await OrgMember.findById(id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    member.name = name;
    member.role = role;
    member.roleCategory = roleCategory;
    member.tenure = tenure;
    member.description = description;
    member.affiliation = affiliation;
    member.image = image;

    await member.save();

    const allMembers = await OrgMember.find({});
    res.json(allMembers);
  } catch (err) {
    console.error("Error updating member:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE member
export const deleteOrgMember = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing member id" });

    const member = await OrgMember.findByIdAndDelete(id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    const allMembers = await OrgMember.find({});
    res.json(allMembers);
  } catch (err) {
    console.error("Error deleting member:", err);
    res.status(500).json({ error: err.message });
  }
};
