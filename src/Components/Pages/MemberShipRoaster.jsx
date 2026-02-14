import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import emailjs from "emailjs-com";
import axios from "axios";

export default function MemberShipRoaster() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    institute: "",
    designation: "",
    qualification: "",
    country: "",
  });
  const [showRequirements, setShowRequirements] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);

  const toggleRequirements = () => setShowRequirements((prev) => !prev);
  const toggleBenefits = () => setShowBenefits((prev) => !prev);

  /* ================= VERIFY MEMBER STATES ================= */
  const [showVerify, setShowVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyNo, setVerifyNo] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  /* ================= AUTO VERIFY FROM QR ================= */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("verifyEmail");
    const noParam = params.get("verifyNo");

    if (emailParam && noParam) {
      setVerifyEmail(emailParam);
      setVerifyNo(noParam);
      setShowVerify(true);

      // Directly verify (instead of calling handleVerify)
      axios
        .post("http://localhost:5000/api/members/verify", {
          email: emailParam,
          paapsNo: Number(noParam),
        })
        .then((res) => {
          setVerifyResult(res.data);
        })
        .catch(() => {
          alert("Verification failed");
        });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Get registration date in GMT+5 (Pakistan)
  const getPakistanDate = () => {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date());
  };

  /* ================= PDF GENERATOR (UNCHANGED) ================= */
  const generatePDF = async (membershipNo, registrationDate) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let y = 20;

    // HEADER
    doc.setFillColor(0, 102, 51); // pakistan inspired
    doc.rect(0, 0, pageWidth, 35, "F");

    // ✅ LOGO (LEFT-CENTER IN HEADER)
    const logoImg = new Image();
    logoImg.src = "/assets/paapslogo.jpg"; // update path if needed
    await new Promise((resolve) => (logoImg.onload = resolve));

    const logoSize = 32;
    const logoY = (35 - logoSize) / 2;
    doc.addImage(logoImg, "PNG", 10, logoY, logoSize, logoSize);

    // Header text (pushed right to avoid logo overlap)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);

    const textStartX = 10 + logoSize + 8; // logoX + logoSize + gap
    const textAreaWidth = pageWidth - textStartX - 10;

    doc.text(
      "Pakistan Association of Phonetics & Phonology Scholars (PAPPS)",
      textStartX + textAreaWidth / 2,
      18,
      { align: "center", maxWidth: textAreaWidth },
    );

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const lineHeight = 5.5;

    // Membership No & Date
    y = 50;
    doc.text(`Membership No.: PAPPS//${membershipNo}`, margin, y);
    doc.text(`Date: ${registrationDate}`, pageWidth - margin, y, {
      align: "right",
    });

    // Membership No & Date
    y = 50;
    doc.text(`Membership No.: PAPPS//${membershipNo}`, margin, y);
    doc.text(`Date: ${registrationDate}`, pageWidth - margin, y, {
      align: "right",
    });

    y += 12;
    doc.text("To:", margin, y);
    y += 6;
    doc.setFont(undefined, "bold");
    doc.text(`${form.firstName} ${form.lastName}`, margin, y);
    y += lineHeight;
    doc.text(form.designation, margin, y);
    y += lineHeight;
    doc.text(form.institute, margin, y);
    doc.setFont(undefined, "normal");

    y += 10;
    doc.setFont(undefined, "bold");
    doc.text("Subject: PAPPS Membership 2026", margin, y);
    doc.setFont(undefined, "normal");
    y += 6;

    const writeWrapped = (text) => {
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      lines.forEach((line) => {
        doc.text(line, margin, y);
        y += lineHeight;
      });
      y += 2;
    };

    // Body text
    writeWrapped(
      "It is our great pleasure to inform you that your membership with the Pakistan " +
        "Association of Phonetics & Phonology Scholars (PAPPS) has been approved. " +
        "Your membership is valid until 31 December 2026 and is granted on an honorary basis.",
    );

    writeWrapped(
      "We are delighted to welcome you to PAPPS, a non-profit and non-governmental " +
        "academic association dedicated to the scientific study, promotion, and advancement " +
        "of phonetics and phonology, with particular emphasis on Pakistani languages, their " +
        "sound systems, and their interaction with global linguistic traditions.",
    );

    y += 2;
    doc.text(
      "As an active scholarly body, PAPPS regularly organizes:",
      margin,
      y,
    );
    y += lineHeight;
    doc.text("• Academic webinars and lecture series", margin + 4, y);
    y += lineHeight;
    doc.text(
      "• Research-oriented discussions and training sessions",
      margin + 4,
      y,
    );
    y += lineHeight;
    doc.text(
      "• Scholarly collaboration among national and international researchers",
      margin + 4,
      y,
    );

    y += lineHeight;
    writeWrapped(
      "The Association aims to create a strong academic network that supports research, documentation, " +
        "and dissemination of knowledge related to speech sounds, phonological theory, and applied phonetics.",
    );

    y += 2;
    doc.setFont(undefined, "bold");
    doc.text("Your Role as a PAPPS Member", margin, y);
    doc.setFont(undefined, "normal");
    y += lineHeight;
    doc.text("As a valued member of PAPPS, you are encouraged to:", margin, y);
    y += lineHeight;
    doc.text(
      "• Engage in scholarly discussions on phonetics and phonology",
      margin + 4,
      y,
    );
    y += lineHeight;
    doc.text(
      "• Share research ideas and explore collaborative academic opportunities",
      margin + 4,
      y,
    );
    y += lineHeight;
    doc.text(
      "• Contribute your expertise to the promotion of phonetic and phonological research in Pakistan",
      margin + 4,
      y,
    );
    y += lineHeight;
    doc.text(
      "• Support PAPPS initiatives related to academic events, outreach, and capacity building",
      margin + 4,
      y,
    );
    y += lineHeight;
    doc.text(
      "• Expand your professional network by connecting with fellow scholars and researchers",
      margin + 4,
      y,
    );

    y += lineHeight * 2;
    writeWrapped(
      "We are confident that your academic background and professional experience will be a valuable asset to PAPPS and will contribute meaningfully to our ongoing and future initiatives.",
    );

    y += 4;
    doc.text("With best regards,", margin, y);
    y += lineHeight;
    doc.setFont(undefined, "bold");
    doc.text("ZA Jasra", margin, y);
    y += lineHeight;
    doc.setFont(undefined, "normal");
    doc.text("Founder & President", margin, y);
    y += lineHeight;
    doc.text(
      "Pakistan Association of Phonetics & Phonology Scholars (PAPPS)",
      margin,
      y,
    );
    y += lineHeight;
    doc.text("Email: ____________________", margin, y);

    return doc;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registrationDate = getPakistanDate();

    try {
      // 1️⃣ Save member
      const response = await axios.post("http://localhost:5000/api/members", {
        ...form,
      });

      if (!response.data || !response.data.paapsNo) {
        throw new Error("No PAAPS number returned from server");
      }

      const { paapsNo } = response.data;

      // 2️⃣ Generate PDF
      const pdf = await generatePDF(paapsNo, registrationDate);

      pdf.save(`PAPPS_Membership_${form.firstName}_${form.lastName}.pdf`);
      const pdfBase64 = pdf.output("datauristring");

      // 3️⃣ Try sending email (DON'T fail registration if email fails)
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_email: form.email,
            user_name: `${form.firstName} ${form.lastName}`,
            pdf_file: pdfBase64,
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        );
      } catch (emailErr) {
        console.error("Email failed:", emailErr);
        alert("Member registered successfully, but email could not be sent.");
      }

      alert(`Membership approved! PAAPS No: ${paapsNo}.`);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        institute: "",
        designation: "",
        qualification: "",
        country: "",
      });
    } catch (err) {
      console.error("Error registering member:", err);

      const errorMsg =
        err.response?.data?.error || err.message || "Failed to register member";

      alert(`Failed to register member: ${errorMsg}`);
    }
  };

  /* ================= VERIFY MEMBER LOGIC ================= */
  const handleVerify = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/members/verify", {
        email: verifyEmail,
        paapsNo: Number(verifyNo),
      });
      setVerifyResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7ec] px-4 py-8 space-y-6 relative">
      {/* VERIFY MEMBER BUTTON */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => {
            setShowVerify(true);
            setVerifyResult(null);
          }}
          className="bg-[#FFAC1C] text-white px-4 py-2 rounded-lg shadow font-semibold transition-all duration-200 hover:bg-white hover:text-black! hover:shadow-lg active:scale-95"
        >
          Verify Member
        </button>
      </div>

      {/* VERIFY MODAL */}
      {showVerify && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center text-[#FFAC1C]">
              Verify PAPPS Membership
            </h3>

            <input
              type="email"
              placeholder="Enter Email"
              value={verifyEmail}
              onChange={(e) => setVerifyEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <input
              type="number"
              placeholder="Enter PAPPS Member No"
              value={verifyNo}
              onChange={(e) => setVerifyNo(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <button
              onClick={handleVerify}
              className="w-full bg-[#FFAC1C] text-white py-2 rounded"
            >
              Check
            </button>

            {verifyResult && (
              <div className="mt-4 text-center">
                {verifyResult.success ? (
                  <p className="text-green-600 font-semibold">
                    ✅ {verifyResult.name} is a verified member of PAPPS
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">
                    ❌ No matching member found
                  </p>
                )}
              </div>
            )}

            <button
              onClick={() => setShowVerify(false)}
              className="mt-4 text-sm text-gray-500 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* REQUIREMENTS & BENEFITS (UNCHANGED) */}
      <div className="flex flex-col mt-10 gap-4 w-full mb-6">
        {/* REQUIREMENTS */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-[#FFAC1C] overflow-hidden transition-all duration-300 w-full">
          <div
            onClick={toggleRequirements}
            className="flex justify-between items-center cursor-pointer px-6 py-2 bg-[#fff7ec] hover:bg-[#ffe5b3]"
          >
            <h3 className="text-xl font-semibold text-[#FFAC1C]">
              Requirements
            </h3>
            <span className="text-[#FFAC1C] font-bold">
              {showRequirements ? "−" : "+"}
            </span>
          </div>
          <div
            className={`px-6 transition-all duration-500 ${showRequirements ? "py-4" : "py-0 max-h-0"}`}
          >
            {showRequirements && (
              <ul className="list-decimal list-inside text-gray-700 space-y-1 text-sm">
                <li>Interest in phonetics and/or phonology</li>
                <li>
                  Academic background in linguistics, English, languages, or
                  related fields
                </li>
                <li>
                  Students, researchers, teachers, and independent scholars are
                  welcome
                </li>
                <li>
                  Willingness to engage in academic activities (webinars,
                  workshops, discussions, research sharing)
                </li>
                <li>
                  Commitment to maintaining a professional, ethical, and
                  scholarly conduct
                </li>
                <li>
                  Respect for PAPPS rules, policies, and academic standards
                </li>
                <li>Ability to communicate professionally in English</li>
                <li>
                  Readiness to contribute voluntarily to the academic goals of
                  PAPPS (no financial obligation)
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* BENEFITS */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-[#FFAC1C] overflow-hidden transition-all duration-300 w-full">
          <div
            onClick={toggleBenefits}
            className="flex justify-between items-center cursor-pointer px-6 py-2 bg-[#fff7ec] hover:bg-[#ffe5b3]"
          >
            <h3 className="text-lg font-semibold text-[#FFAC1C]">Benefits</h3>
            <span className="text-[#FFAC1C] font-bold">
              {showBenefits ? "−" : "+"}
            </span>
          </div>
          <div
            className={`px-6 transition-all duration-500 ${showBenefits ? "py-4" : "py-0 max-h-0"}`}
          >
            {showBenefits && (
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Event Registration Access (Members-Only)</li>
                <li>
                  Only PAPPS members will be able to get a FREE E-Certificate
                </li>

                <li>
                  Never Miss an Opportunity: Priority updates and notifications
                </li>
                <li>Be Part of Pakistan’s Pioneer Phonetics Community</li>
                <li>
                  Awareness and Academic Growth through events, talks, and
                  discussions
                </li>
                <li>Networking with Scholars Nationwide</li>
                <li>
                  Professional Visibility and Recognition on CVs and LinkedIn
                </li>
                <li>Research and Collaboration Opportunities</li>
                <li>
                  Leadership and Volunteering Roles in events and sessions
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* MEMBERSHIP FORM (UNCHANGED) */}
      <div className="max-w-lg mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-xl p-8 border-t-8 border-[#FFAC1C]"
        >
          <h2 className="text-3xl font-bold text-center text-[#FFAC1C] mb-6">
            Join PAPPS
          </h2>

          {[
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Email", name: "email", type: "email" },
            { label: "Institute", name: "institute" },
            { label: "Designation", name: "designation" },
            { label: "Country", name: "country" },
          ].map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                name={field.name}
                required
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FFAC1C]"
              />
            </div>
          ))}

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">
              Qualification
            </label>
            <select
              name="qualification"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FFAC1C]"
            >
              <option value="">Select</option>
              <option>BS</option>
              <option>MPhil</option>
              <option>PhD</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FFAC1C] text-white py-3 rounded-lg border border-[#FFAC1C] font-semibold transition-all duration-200 hover:bg-white hover:text-black! active:scale-95"
          >
            Become a Member
          </button>
        </form>
      </div>
    </div>
  );
}
