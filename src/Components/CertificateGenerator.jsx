import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import axios from "axios";
import QRCode from "qrcode";

export default function CertificateGenerator() {
  /* ================= ADMIN AUTH ================= */
  const auth = JSON.parse(localStorage.getItem("papps_auth"));
  const showLogo = true;
  const isAdmin =
    auth?.isLoggedIn &&
    (auth?.role === "admin" || auth?.role === "senior_admin");

  /* ================= CERTIFICATE TOGGLE ================= */
  const [enabled, setEnabled] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("papps_certificates_enabled")) ?? false
    );
  });

  const toggleCertificates = () => {
    const value = !enabled;
    setEnabled(value);
    localStorage.setItem("papps_certificates_enabled", JSON.stringify(value));
  };

  /* ================= ADMIN CERTIFICATE META ================= */
  const [topicName, setTopicName] = useState(
    () => localStorage.getItem("papps_topic_name") || "",
  );
  const [resourcePerson, setResourcePerson] = useState(
    () => localStorage.getItem("papps_resource_person") || "",
  );

  const saveCertificateMeta = () => {
    localStorage.setItem("papps_topic_name", topicName);
    localStorage.setItem("papps_resource_person", resourcePerson);
    alert("Certificate topic and resource person saved");
  };

  /* ================= ADMIN ATTENDANCE ================= */
  const [attendanceInput, setAttendanceInput] = useState("");
  useEffect(() => {
    if (!topicName) return;
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/certificates/attendance?event=${encodeURIComponent(topicName)}`,
      )
      .then((res) => setAttendanceInput(res.data.emails.join("\n")))
      .catch(() => console.log("No attendance yet"));
  }, [topicName]);

  const saveAttendance = async () => {
    if (!topicName) {
      alert("Set a topic/event name first");
      return;
    }

    const emails = attendanceInput
      .split("\n")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/certificates/attendance`,

        {
          event: topicName,
          emails,
        },
      );

      if (res.data.success) {
        alert("Attendance saved successfully");
      }
    } catch (err) {
      console.error("Failed to save attendance:", err);
      alert("Failed to save attendance");
    }
  };

  /* ================= MEMBER INPUT ================= */
  const [email, setEmail] = useState("");
  const [paapsNo, setPaapsNo] = useState("");
  const [error, setError] = useState("");

  /* ================= CERTIFICATE LOGIC ================= */
  const generateCertificate = async () => {
    setError("");

    if (!enabled) {
      setError("Certificate downloads are currently not available.");
      return;
    }

    if (!topicName || !resourcePerson) {
      setError("Certificate topic or resource person not set by admin.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/certificates/verify`,

        {
          email,
          paapsNo: Number(paapsNo),
          event: topicName,
        },
      );

      if (!res.data.success) {
        setError(res.data.error || "Cannot verify certificate");
        return;
      }

      const member = res.data.member;
      if (!member || !member.firstName || !member.lastName) {
        setError("Member information incomplete");
        return;
      }

      const fullName = `${member.firstName} ${member.lastName}`.toUpperCase();

      /* ================= PDF GENERATION ================= */
      const doc = new jsPDF("landscape");

      const bgImg = "/assets/bg-certificate.png";
      const img = new Image();
      img.src = bgImg;
      await new Promise((resolve) => (img.onload = resolve));
      doc.addImage(img, "PNG", 0, 0, 297, 210);

      if (showLogo) {
        const logoImg = new Image();
        logoImg.src = "/assets/paapslogo2.png";
        await new Promise((resolve) => (logoImg.onload = resolve));
        doc.addImage(logoImg, "PNG", 245, 12, 45, 45);
      }

      const topLeftX = 20;
      const topLeftY = 20;

      doc.setFont("times", "normal");
      doc.setFontSize(14);
      doc.text(`PAAPS Membership No: ${paapsNo}`, topLeftX, topLeftY);
      doc.text(
        `Date: ${new Date().toLocaleDateString()}`,
        topLeftX,
        topLeftY + 10,
      );

      doc.setFont("times", "bold");
      doc.setFontSize(30);
      doc.setTextColor(30, 80, 160);
      doc.text("Certificate of Participation", 148, 50, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("This certificate is proudly presented to", 148, 65, {
        align: "center",
      });

      doc.setFont("times", "bold");
      doc.setFontSize(26);
      doc.text(fullName, 148, 85, { align: "center" });

      const bodyText = `This certificate is awarded in recognition of meaningful participation and demonstrated professional interest.
It highlights the participant’s dedication to skill development, academic growth, and collaborative learning.`;

      doc.setFont("times", "normal");
      doc.setFontSize(13);
      doc.text(bodyText, 148, 105, { align: "center", maxWidth: 200 });

      doc.setFont("times", "bolditalic");
      doc.setFontSize(16);
      doc.text(`Topic: "${topicName}"`, 148, 130, { align: "center" });

      doc.setFont("times", "normal");
      doc.setFontSize(14);
      doc.text(`Resource Person: ${resourcePerson}`, 148, 145, {
        align: "center",
      });

      doc.line(110, 170, 186, 170);
      doc.setFont("times", "bold");
      doc.text("ZA Jasra", 148, 178, { align: "center" });
      doc.setFont("times", "normal");
      doc.text("President PAPPS", 148, 186, { align: "center" });
      /* ================= QR CODE ================= */

      // This should be your deployed frontend URL later
      const verificationURL = `${import.meta.env.VITE_FRONTEND_URL}/membership?verifyEmail=${encodeURIComponent(email)}&verifyNo=${paapsNo}`;

      const qrDataURL = await QRCode.toDataURL(verificationURL);

      // Position QR bottom-right
      doc.addImage(qrDataURL, "PNG", 235, 155, 35, 35);

      doc.setFontSize(10);
      doc.text("Scan to Verify", 252, 195, { align: "center" });

      doc.save(`PAAPS-Certificate-${fullName}.pdf`);
    } catch (err) {
      console.error("Certificate generation error:", err);
      setError("Server error while verifying certificate.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7ec] flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full border-t-8 border-[#FFAC1C] space-y-6">
        {/* ================= ADMIN PANEL ================= */}
        {isAdmin && (
          <div className="border p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-bold text-[#FFAC1C]">Admin Controls</h3>

            <button
              onClick={toggleCertificates}
              className={`w-full py-2 rounded text-white font-semibold ${enabled ? "bg-green-600" : "bg-red-500"}`}
            >
              {enabled ? "Certificates Enabled" : "Certificates Disabled"}
            </button>

            <input
              type="text"
              placeholder="Certificate Topic Name"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              placeholder="Resource Person Name"
              value={resourcePerson}
              onChange={(e) => setResourcePerson(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <button
              onClick={saveCertificateMeta}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
            >
              Save Topic & Resource Person
            </button>

            <textarea
              rows={5}
              value={attendanceInput}
              onChange={(e) => setAttendanceInput(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              placeholder="Attendance emails (one per line)"
            />

            <button
              onClick={saveAttendance}
              className="w-full bg-[#FFAC1C] text-white py-2 rounded font-semibold"
            >
              Save Attendance
            </button>
          </div>
        )}

        {/* ================= MEMBER PANEL ================= */}
        <div>
          <h2 className="text-2xl font-bold text-center text-[#FFAC1C] mb-4">
            Download Certificate
          </h2>

          <input
            type="email"
            placeholder="Registered Email"
            className="w-full border px-3 py-2 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="number"
            placeholder="PAAPS Membership No"
            className="w-full border px-3 py-2 rounded mb-3"
            value={paapsNo}
            onChange={(e) => setPaapsNo(e.target.value)}
          />

          {error && (
            <p className="text-red-600 text-sm text-center mb-2">{error}</p>
          )}

          <button
            onClick={generateCertificate}
            className="w-full bg-[#FFAC1C] text-white py-3 rounded font-semibold"
          >
            Generate Certificate
          </button>

          {!enabled && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Certificate downloads are currently closed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
