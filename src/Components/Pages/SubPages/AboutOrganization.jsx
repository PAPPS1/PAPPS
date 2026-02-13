import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";

const directorates = [
  "IT & Systems",
  "Finance / Finance Officer",
  "Research & Publications",
  "International Collaboration",
  "Social Media",
  "Public Relations",
  "Membership",
];

const API_URL = "http://localhost:5000/api/org-members";

const AboutOrganization = () => {
  const auth = JSON.parse(localStorage.getItem("papps_auth"));
  const [isAdmin] = useState(auth?.role === "senior_admin");
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeRole, setActiveRole] = useState(null);
  const [activeProfile, setActiveProfile] = useState(null);
  const [showDirectorates, setShowDirectorates] = useState(false);
  const [membersData, setMembersData] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [newMember, setNewMember] = useState({
    name: "",
    affiliation: "",
    role: "",
    tenure: "",
    description: "",
    image: "",
  });

  // Load members data
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await axios.get(API_URL);
        setMembersData(res.data || []);
      } catch {
        console.error("Failed to fetch members from backend");
        setMembersData([]);
      }
    };
    loadMembers();
  }, []);

  // Handle URL parameters after data is loaded
  const handleUrlParams = useCallback(() => {
    if (!membersData.length || isInitialized) return;

    const memberId = searchParams.get("member");
    const roleCategory = searchParams.get("role");
    const showDir = searchParams.get("directorates");

    // Use setTimeout to avoid synchronous state updates
    setTimeout(() => {
      if (showDir === "true") {
        setShowDirectorates(true);
      }

      if (roleCategory) {
        setActiveRole(roleCategory);

        // Check if it's a directorate
        if (directorates.includes(roleCategory)) {
          setShowDirectorates(true);
        }
      }

      if (memberId) {
        const member = membersData.find((m) => m._id === memberId);
        if (member) {
          setActiveProfile(member);
          setActiveRole(member.roleCategory);

          // If member is from directorates, show directorates section
          if (directorates.includes(member.roleCategory)) {
            setShowDirectorates(true);
          }
        }
      }

      setIsInitialized(true);
    }, 0);
  }, [searchParams, membersData, isInitialized]);

  // Effect to handle URL parameters
  useEffect(() => {
    handleUrlParams();
  }, [handleUrlParams]);

  // ================= UPDATE URL FUNCTIONS =================
  const updateURL = (params) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  const generateMemberLink = (member) => {
    const currentUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set("member", member._id);
    params.set("role", member.roleCategory);

    if (directorates.includes(member.roleCategory)) {
      params.set("directorates", "true");
    }

    return `${currentUrl}?${params.toString()}`;
  };

  const copyMemberLink = async (member) => {
    const link = generateMemberLink(member);

    try {
      await navigator.clipboard.writeText(link);
      alert("Member link copied to clipboard!");
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Member link copied to clipboard!");
    }
  };

  // ================= HANDLE IMAGE UPLOAD =================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewMember((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // ================= ADD MEMBER =================
  const handleAddMember = async () => {
    if (!newMember.name || !newMember.role || !activeRole) {
      alert("Name, Role, and Role Category are required!");
      return;
    }

    try {
      const res = await axios.post(API_URL, {
        ...newMember,
        roleCategory: activeRole,
      });

      setMembersData(res.data);
      resetForm();
      setAddModalOpen(false);
    } catch {
      console.error("Failed to add member");
      alert("Failed to add member");
    }
  };

  // ================= EDIT MEMBER =================
  const handleEditMember = async () => {
    if (!newMember.name || !newMember.role || !activeRole || !newMember._id) {
      alert("Name, Role, Role Category, and Member ID are required!");
      return;
    }

    try {
      const res = await axios.put(`${API_URL}/${newMember._id}`, {
        ...newMember,
        roleCategory: activeRole,
      });

      setMembersData(res.data);
      resetForm();
      setEditModalOpen(false);
    } catch {
      console.error("Failed to edit member");
      alert("Failed to update member");
    }
  };

  // ================= DELETE MEMBER =================
  const handleDeleteMember = async (member) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      const res = await axios.delete(`${API_URL}/${member._id}`);
      setMembersData(res.data);
    } catch {
      console.error("Failed to delete member");
      alert("Failed to delete member");
    }
  };

  const openEditModal = (member) => {
    setNewMember(member);
    setActiveRole(member.roleCategory);
    setEditModalOpen(true);
  };

  const resetForm = () => {
    setNewMember({
      name: "",
      affiliation: "",
      role: "",
      tenure: "",
      description: "",
      image: "",
    });
  };

  const roles = [
    "President",
    "General Secretary",
    "Advisory Board",
    "Academic Outreach & Collaboration Board",
    "Executive Committee",
    "Directorates",
  ];

  // ================= NAVIGATION HANDLERS =================
  const handleRoleClick = (role) => {
    if (role === "Directorates") {
      setShowDirectorates(true);
      updateURL({ directorates: "true", role: null, member: null });
    } else {
      setActiveRole(role);
      updateURL({ role: role, member: null, directorates: null });
    }
  };

  const handleDirectorateClick = (dir) => {
    setActiveRole(dir);
    updateURL({ role: dir, member: null, directorates: "true" });
  };

  const handleProfileClick = (member) => {
    setActiveProfile(member);
    updateURL({
      member: member._id,
      role: member.roleCategory,
      directorates: directorates.includes(member.roleCategory) ? "true" : null,
    });
  };

  const handleCloseRole = () => {
    setActiveRole(null);
    updateURL({ role: null, member: null });
  };

  const handleCloseProfile = () => {
    setActiveProfile(null);
    updateURL({ member: null });
  };

  const handleBackToMain = () => {
    setShowDirectorates(false);
    updateURL({ directorates: null, role: null, member: null });
  };

  // ================= FILTER MEMBERS BY ROLE =================
  const membersByRole = (role) =>
    membersData.filter((m) => m.roleCategory === role);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-xl border-l-8 border-[#FFAC1C]">
      <h2 className="text-4xl font-extrabold text-green-700 mb-6">
        Organisational Structure
      </h2>

      <p className="text-gray-600 text-lg leading-relaxed mb-8 text-justify">
        PAPPS follows an internationally recognised academic governance model.
        All positions are honorary, voluntary, and designed to promote scholarly
        excellence, transparency, and collaboration.
      </p>

      {/* ================= MAIN ROLES ================= */}
      <AnimatePresence mode="wait">
        {!showDirectorates && (
          <Motion.div
            key="mainRoles"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {roles.map((role) => (
              <div
                key={role}
                onClick={() => handleRoleClick(role)}
                className="cursor-pointer p-6 rounded-xl border border-gray-200 bg-linear-to-br from-white to-green-50 hover:shadow-lg hover:border-green-600 transition"
              >
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  {role}
                </h3>
                <p className="text-sm text-gray-600">
                  Click to view members and details
                </p>
              </div>
            ))}
          </Motion.div>
        )}

        {showDirectorates && (
          <Motion.div
            key="directorates"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={handleBackToMain}
              className="mb-6 text-green-700 font-semibold hover:underline"
            >
              ← Back to Main Categories
            </button>

            <h3 className="text-2xl font-bold text-green-700 mb-6">
              Directorates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {directorates.map((dir) => (
                <div
                  key={dir}
                  onClick={() => handleDirectorateClick(dir)}
                  className="cursor-pointer p-6 rounded-xl border border-gray-200 bg-linear-to-br from-white to-green-50 hover:shadow-lg hover:border-green-600 transition"
                >
                  <h4 className="text-lg font-bold text-green-700 mb-2">
                    {dir}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Click to view members and details
                  </p>
                </div>
              ))}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* ================= ROLE MODAL ================= */}
      {activeRole && (
        <Modal title={activeRole} onClose={handleCloseRole}>
          <MembersGrid
            members={membersByRole(activeRole)}
            onProfileClick={handleProfileClick}
            onDelete={handleDeleteMember}
            onEdit={openEditModal}
            onCopyLink={copyMemberLink}
            isAdmin={isAdmin}
          />

          {isAdmin && (
            <button
              onClick={() => setAddModalOpen(true)}
              className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              + Add Member
            </button>
          )}
        </Modal>
      )}

      {/* ================= ADD / EDIT MODALS ================= */}
      {addModalOpen && (
        <MemberForm
          title={`Add Member to ${activeRole}`}
          member={newMember}
          setMember={setNewMember}
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAddMember}
          handleImageUpload={handleImageUpload}
        />
      )}
      {editModalOpen && (
        <MemberForm
          title={`Edit Member in ${activeRole}`}
          member={newMember}
          setMember={setNewMember}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleEditMember}
          handleImageUpload={handleImageUpload}
        />
      )}

      {/* ================= PROFILE MODAL ================= */}
      {activeProfile && (
        <Modal
          title={activeProfile.name}
          onClose={handleCloseProfile}
          size="small"
        >
          <div className="space-y-4 text-center">
            {activeProfile.image && (
              <img
                src={activeProfile.image}
                alt={activeProfile.name}
                className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-green-100 shadow-md"
              />
            )}
            <p className="text-green-700 font-semibold">{activeProfile.role}</p>
            {activeProfile.affiliation && (
              <p className="text-gray-600">{activeProfile.affiliation}</p>
            )}
            <p className="text-sm text-gray-500">
              Tenure: {activeProfile.tenure}
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              {activeProfile.description}
            </p>

            {/* Share Link Button */}
            <button
              onClick={() => copyMemberLink(activeProfile)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              📋 Copy Profile Link
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ================= MEMBERS GRID ================= */
const MembersGrid = ({
  members,
  onProfileClick,
  onDelete,
  onEdit,
  onCopyLink,
  isAdmin,
}) => (
  <div className="flex flex-wrap justify-center gap-6 mt-4">
    {members.map((m) => (
      <div
        key={m._id}
        className="relative bg-white p-5 rounded-2xl border border-gray-200 shadow hover:shadow-lg hover:border-green-600 transition text-center w-60"
      >
        {isAdmin && (
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => onEdit(m)}
              className="text-blue-600 hover:text-blue-800 font-bold text-lg"
              title="Edit Member"
            >
              ✎
            </button>
            <button
              onClick={() => onDelete(m)}
              className="text-red-600 hover:text-red-800 font-bold text-xl"
              title="Delete Member"
            >
              ×
            </button>
          </div>
        )}

        {/* Copy Link Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopyLink(m);
          }}
          className="absolute top-2 left-2 text-gray-500 hover:text-blue-600 text-lg"
          title="Copy Profile Link"
        >
          🔗
        </button>

        <div onClick={() => onProfileClick(m)} className="cursor-pointer">
          {m.image && (
            <img
              src={m.image}
              alt={m.name}
              className="w-24 h-24 mx-auto rounded-full object-cover mb-3 border-2 border-green-100"
            />
          )}
          <h4 className="font-bold text-gray-800">{m.name}</h4>
          <p className="text-sm text-green-700 font-semibold">{m.role}</p>
          {m.affiliation && (
            <p className="text-xs text-gray-500">{m.affiliation}</p>
          )}
        </div>
      </div>
    ))}
  </div>
);

/* ================= MODAL ================= */
const Modal = ({ title, children, onClose, size }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto">
    <div
      className={`bg-white rounded-2xl shadow-2xl border-l-8 border-[#FFAC1C] w-full ${
        size === "small" ? "max-w-xl" : "max-w-4xl"
      }`}
      style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
    >
      <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h3 className="text-2xl font-extrabold text-green-700">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-600 text-2xl font-bold"
        >
          ×
        </button>
      </div>
      <div className="p-6 overflow-y-auto flex-1">{children}</div>
    </div>
  </div>
);

/* ================= MEMBER FORM ================= */
const MemberForm = ({
  title,
  member,
  setMember,
  onClose,
  onSubmit,
  handleImageUpload,
}) => (
  <Modal title={title} onClose={onClose} size="small">
    <div className="space-y-3">
      {["name", "affiliation", "role", "tenure", "description"].map((field) => (
        <div key={field}>
          <label className="block text-sm font-semibold mb-1 capitalize">
            {field}
          </label>
          <input
            type="text"
            value={member[field]}
            onChange={(e) => setMember({ ...member, [field]: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-semibold mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full"
        />
        {member.image && (
          <img
            src={member.image}
            alt="Preview"
            className="w-24 h-24 mt-2 rounded-full object-cover border-2 border-green-100"
          />
        )}
      </div>

      <button
        onClick={onSubmit}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        Save
      </button>
    </div>
  </Modal>
);

export default AboutOrganization;
