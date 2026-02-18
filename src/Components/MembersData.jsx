import { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "emailjs-com";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const MembersData = () => {
  const [members, setMembers] = useState([]);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editedMember, setEditedMember] = useState({});
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/members`,
        );
        setMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch members:", err);
        alert("Failed to fetch members from server.");
      }
    };
    fetchMembers();
  }, []);

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/members/${editingMemberId}`,
        editedMember,
      );
      setMembers((prev) =>
        prev.map((m) => (m._id === editingMemberId ? res.data : m)),
      );
      setEditingMemberId(null);
    } catch (err) {
      console.error("Failed to update member:", err);
      alert("Failed to update member.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/members/${id}`);
      setMembers((prev) => prev.filter((m) => m._id !== id));
      setSelectedMembers((prev) => prev.filter((mid) => mid !== id));
    } catch (err) {
      console.error("Failed to delete member:", err);
      alert("Failed to delete member.");
    }
  };

  const handleEdit = (member) => {
    setEditingMemberId(member._id);
    setEditedMember({ ...member });
  };

  const toggleSelectMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id],
    );
  };

  const handleSendMessage = async () => {
    if (selectedMembers.length === 0) return alert("Select members first");

    try {
      for (const member of members.filter((m) =>
        selectedMembers.includes(m._id),
      )) {
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            to_email: member.email,
            user_name: member.name,
            message_html: message,
          },
          PUBLIC_KEY,
        );
      }
      alert("Message sent!");
      setMessage("");
      setSelectedMembers([]);
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    try {
      setChangingPassword(true);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      alert("Admin password changed successfully!");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7ec] px-3 sm:px-4 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-4 sm:p-6 border-t-8 border-[#FFAC1C]">
        {/* CHANGE PASSWORD */}
        <div className="mb-6 p-4 border rounded bg-[#fff7ec]">
          <h3 className="text-lg font-semibold text-[#FFAC1C] mb-3">
            Change Admin Password
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border px-3 py-2 rounded w-full sm:w-64"
            />

            <button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="bg-[#FFAC1C] text-white px-4 py-2 rounded border w-full sm:w-auto"
            >
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#FFAC1C] mb-6 sm:mb-8">
          Members Data (Admin Panel)
        </h2>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#FFAC1C] text-white">
                <th className="p-2 sm:p-3">Select</th>
                <th className="p-2 sm:p-3">#</th>
                <th className="p-2 sm:p-3">Name</th>
                <th className="p-2 sm:p-3">Email</th>
                <th className="p-2 sm:p-3">Designation</th>
                <th className="p-2 sm:p-3">Institute</th>
                <th className="p-2 sm:p-3">Qualification</th>
                <th className="p-2 sm:p-3">Country</th>
                <th className="p-2 sm:p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member, index) => (
                <tr key={member._id} className="border-b">
                  <td className="p-2 sm:p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member._id)}
                      onChange={() => toggleSelectMember(member._id)}
                    />
                  </td>

                  <td className="p-2 sm:p-3">{index + 1}</td>

                  {[
                    "name",
                    "email",
                    "designation",
                    "institute",
                    "qualification",
                    "country",
                  ].map((field) => (
                    <td key={field} className="p-2 sm:p-3">
                      {editingMemberId === member._id ? (
                        <input
                          value={editedMember[field]}
                          onChange={(e) =>
                            setEditedMember({
                              ...editedMember,
                              [field]: e.target.value,
                            })
                          }
                          className="border px-2 py-1 w-full text-xs sm:text-sm"
                        />
                      ) : (
                        <span className="wrap-break-word">{member[field]}</span>
                      )}
                    </td>
                  ))}

                  <td className="p-2 sm:p-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      {editingMemberId === member._id ? (
                        <>
                          <button
                            className="bg-green-500 px-2 py-1 text-white rounded text-xs sm:text-sm"
                            onClick={handleSave}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-400 px-2 py-1 text-white rounded text-xs sm:text-sm"
                            onClick={() => setEditingMemberId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="bg-blue-500 px-2 py-1 text-white rounded text-xs sm:text-sm"
                            onClick={() => handleEdit(member)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 px-2 py-1 text-white rounded text-xs sm:text-sm"
                            onClick={() => handleDelete(member._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MESSAGE SECTION */}
        <div className="mt-6 p-4 border rounded">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-2 mb-2 text-sm"
            placeholder="Type message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#FFAC1C] text-white px-4 py-2 rounded border w-full sm:w-auto"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembersData;
