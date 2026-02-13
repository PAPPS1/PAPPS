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

  // Fetch members from backend on mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/members");
        setMembers(res.data); // assuming res.data is an array of members
      } catch (err) {
        console.error("Failed to fetch members:", err);
        alert("Failed to fetch members from server.");
      }
    };

    fetchMembers();
  }, []);

  // Update member in DB
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/members/${editingMemberId}`,
        editedMember,
      );
      // update members array with updated member from backend
      setMembers((prev) =>
        prev.map((m) => (m._id === editingMemberId ? res.data : m)),
      );
      setEditingMemberId(null);
    } catch (err) {
      console.error("Failed to update member:", err);
      alert("Failed to update member.");
    }
  };

  // Delete member from DB
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/members/${id}`);
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

  return (
    <div className="min-h-screen bg-[#fff7ec] px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6 border-t-8 border-[#FFAC1C]">
        <h2 className="text-3xl font-bold text-center text-[#FFAC1C] mb-8">
          Members Data (Admin Panel)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#FFAC1C] text-white">
                <th className="p-3">Select</th>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Institute</th>
                <th className="p-3">Qualification</th>
                <th className="p-3">Country</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member, index) => (
                <tr key={member._id} className="border-b">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member._id)}
                      onChange={() => toggleSelectMember(member._id)}
                    />
                  </td>
                  <td className="p-3">{index + 1}</td>

                  {[
                    "name",
                    "email",
                    "designation",
                    "institute",
                    "qualification",
                    "country",
                  ].map((field) => (
                    <td key={field} className="p-3">
                      {editingMemberId === member._id ? (
                        <input
                          value={editedMember[field]}
                          onChange={(e) =>
                            setEditedMember({
                              ...editedMember,
                              [field]: e.target.value,
                            })
                          }
                          className="border px-2 py-1 w-full"
                        />
                      ) : (
                        member[field]
                      )}
                    </td>
                  ))}

                  <td className="p-3 space-x-2">
                    {editingMemberId === member._id ? (
                      <>
                        <button
                          className="bg-green-500 px-2 py-1 text-white rounded"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 px-2 py-1 text-white rounded"
                          onClick={() => setEditingMemberId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-blue-500 px-2 py-1 text-white rounded"
                          onClick={() => handleEdit(member)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 px-2 py-1 text-white rounded"
                          onClick={() => handleDelete(member._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 border rounded">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-2 mb-2"
            placeholder="Type message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#FFAC1C] text-white px-4 py-2 rounded border"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembersData;
