import React from "react";
import { SiLinkedin } from "react-icons/si";
import { FaFacebook } from "react-icons/fa";
import { LuInstagram } from "react-icons/lu";

const AboutFounder = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border-l-8 border-[#FFAC1C]">
      {/* Founder Image */}
      <div className="flex justify-center mb-6">
        <img
          src="/assets/founder.jpeg" // <-- replace with actual image path or URL
          alt="Founder Zeeshan Akram Jasra"
          className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-[#FFAC1C] shadow-md"
        />
      </div>

      {/* Header */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-[#FFAC1C] mb-6 text-center">
        Founder
      </h2>

      {/* Content */}
      <p className="text-gray-700 text-justify leading-relaxed space-y-4">
        Zeeshan Akram Jasra is the visionary founder of the Pakistan Association
        of Phonetics & Phonology Scholars (PAPPS), formally established on 28
        September 2024. PAPPS represents the culmination of a lifelong
        commitment to phonetic science and phonological inquiry, a discipline
        that has too often been overlooked within Pakistani academia. Zeeshan’s
        academic journey in Phonetics began under the mentorship of the esteemed
        Late Brig. Naseeruddin, a respected phonetician in Pakistan and a direct
        pupil of Peter Roach, one of the world’s most influential scholars in
        English phonetics and phonology. This rich intellectual lineage has
        deeply shaped Zeeshan’s passion for sound science and his belief in
        rigorous, research-led scholarship. Throughout his career, Zeeshan has
        worked tirelessly as an educator and researcher, advocating for a shift
        beyond traditional textbook-driven instruction towards an
        evidence-based, research-oriented approach to speech sciences. In a
        context where Phonetics and Phonology are often reduced to rote learning
        and assessment for exam performance, his work champions critical
        inquiry, methodological innovation, and real-world relevance. Driven by
        this vision, PAPPS was founded to create a dedicated platform for
        emerging scholars, postgraduate researchers, and faculty members
        committed to advancing phonetic and phonological studies in Pakistan.
        Under his leadership, PAPPS has already introduced pioneering
        initiatives, including webinar series, workshops on computational
        phonetics, acoustic analysis tools such as PRAAT, and specialised
        research streams like forensic phonetics, bringing international
        research trends into national academic discourse. Zeeshan’s leadership
        reflects a powerful belief: that Pakistani scholars should not only
        engage with global advancements in linguistics but also contribute
        meaningfully to them. PAPPS, under his guidance, continues to nurture a
        new generation of linguists prepared to explore innovative,
        interdisciplinary frontiers in phonetic and phonological research.
      </p>

      {/* Social Media Links */}
      <div className="flex justify-center mt-6 gap-6">
        <a
          href="https://www.linkedin.com/in/zajasra" // <-- replace with actual LinkedIn
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0077B5] hover:text-[#FFAC1C] transition-colors duration-200"
        >
          <SiLinkedin size={32} />
        </a>

        {/* <a
          href="https://www.facebook.com/founder-link" // <-- replace with actual Facebook
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1877F2] hover:text-[#FFAC1C] transition-colors duration-200"
        >
          <FaFacebook size={32} />
        </a>

        <a
          href="https://www.instagram.com/founder-link" // <-- replace with actual Instagram
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E1306C] hover:text-[#FFAC1C] transition-colors duration-200"
        >
          <LuInstagram size={32} />
        </a> */}
      </div>
    </div>
  );
};

export default AboutFounder;
