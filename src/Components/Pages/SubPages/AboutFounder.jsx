import React from "react";
import { SiLinkedin } from "react-icons/si";
import { FaFacebook } from "react-icons/fa";
import { LuInstagram } from "react-icons/lu";

const AboutFounder = () => {
  return (
    <>
      {/* ================= DESKTOP VIEW (UNCHANGED) ================= */}
      <div className="hidden md:block">
        <div
          className="max-w-4xl 
                    mx-auto 
                    px-4 sm:px-6 
                    py-6 
                    bg-white 
                    rounded-xl 
                    shadow-lg 
                    border-l-4 sm:border-l-8 
                    border-[#FFAC1C]"
        >
          {/* Founder Image */}
          <div className="flex justify-center mb-6">
            <img
              src="/assets/founder.jpeg"
              alt="Founder Zeeshan Akram Jasra"
              className="w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 
                     rounded-full 
                     object-cover 
                     border-4 
                     border-[#FFAC1C] 
                     shadow-md"
            />
          </div>

          {/* Header */}
          <h2
            className="text-xl sm:text-3xl md:text-4xl 
                     font-extrabold 
                     text-[#FFAC1C] 
                     mb-4 sm:mb-6 
                     text-center"
          >
            Founder
          </h2>

          {/* Content */}
          <div
            className="text-gray-700 
                      text-left sm:text-justify 
                      text-sm sm:text-base 
                      leading-relaxed 
                      sm:leading-loose 
                      space-y-4"
          >
            <p>
              Zeeshan Akram Jasra is the visionary founder of the Pakistan
              Association of Phonetics & Phonology Scholars (PAPPS), formally
              established on 28 September 2024. PAPPS represents the culmination
              of a lifelong commitment to phonetic science and phonological
              inquiry — a discipline that has often been overlooked within
              Pakistani academia.
            </p>

            <p>
              Zeeshan’s academic journey in Phonetics began under the mentorship
              of the esteemed Late Brig. Naseeruddin, a respected phonetician in
              Pakistan and a direct pupil of Peter Roach, one of the world’s
              most influential scholars in English phonetics and phonology. This
              intellectual lineage deeply shaped his passion for sound science
              and his commitment to rigorous, research-led scholarship.
            </p>

            <p>
              Throughout his career, Zeeshan has worked tirelessly as an
              educator and researcher, advocating a shift beyond textbook-driven
              instruction toward an evidence-based, research-oriented approach
              to speech sciences. In a context where Phonetics and Phonology are
              often reduced to rote learning for examinations, his work
              champions critical inquiry, methodological innovation, and
              real-world application.
            </p>

            <p>
              Driven by this vision, PAPPS was founded to create a dedicated
              platform for emerging scholars, postgraduate researchers, and
              faculty members committed to advancing phonetic and phonological
              studies in Pakistan.
            </p>

            <p>
              Under his leadership, PAPPS has introduced pioneering initiatives
              including webinar series, workshops on computational phonetics,
              acoustic analysis tools such as PRAAT, and specialised research
              streams like forensic phonetics — bringing international research
              trends into national academic discourse.
            </p>

            <p>
              Zeeshan’s leadership reflects a powerful belief: Pakistani
              scholars should not only engage with global advancements in
              linguistics but also contribute meaningfully to them. PAPPS
              continues to nurture a new generation of linguists prepared to
              explore innovative and interdisciplinary frontiers in phonetic and
              phonological research.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center mt-6 gap-6">
            <a
              href="https://www.linkedin.com/in/zajasra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0077B5] hover:text-[#FFAC1C] transition-colors duration-200"
            >
              <SiLinkedin size={28} className="sm:w-8 sm:h-8" />
            </a>
          </div>
        </div>
      </div>

      {/* ================= MOBILE VIEW (Refined) ================= */}
      <div className="block md:hidden bg-gradient-to-b from-[#fff8ef] to-white min-h-screen">
        <div className="px-4 py-5 max-w-lg mx-auto">
          {/* IMAGE */}
          <div className="flex justify-center mb-4">
            <img
              src="/assets/founder.jpeg"
              alt="Founder Zeeshan Akram Jasra"
              className="w-20 h-20 min-[400px]:w-24 min-[400px]:h-24 
                   rounded-full object-cover 
                   border-4 border-[#FFAC1C] shadow-sm"
            />
          </div>

          {/* TITLE */}
          <h2 className="text-base font-semibold text-[#FFAC1C] text-center mb-4 tracking-wide">
            Founder
          </h2>

          {/* CONTENT */}
          <div className="text-gray-700 text-[13px] leading-[1.6] space-y-3">
            <p>
              Zeeshan Akram Jasra is the visionary founder of the Pakistan
              Association of Phonetics & Phonology Scholars (PAPPS), formally
              established on 28 September 2024.
            </p>

            <p>
              His academic journey in Phonetics began under the mentorship of
              Late Brig. Naseeruddin — a respected phonetician in Pakistan and
              direct pupil of Peter Roach.
            </p>

            <p>
              Throughout his career, he has advocated an evidence-based,
              research-oriented approach to speech sciences beyond
              textbook-driven instruction.
            </p>

            <p>
              PAPPS was founded to provide a dedicated platform for emerging
              scholars, postgraduate researchers, and faculty advancing phonetic
              and phonological studies in Pakistan.
            </p>

            <p>
              Under his leadership, PAPPS introduced webinar series,
              computational phonetics workshops, PRAAT acoustic analysis, and
              forensic phonetics research streams.
            </p>

            <p>
              His vision encourages Pakistani scholars not only to engage with
              global advancements but to contribute meaningfully to them.
            </p>
          </div>

          {/* SOCIAL */}
          <div className="flex justify-center mt-6">
            <a
              href="https://www.linkedin.com/in/zajasra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0077B5] active:scale-95 transition-transform"
            >
              <SiLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutFounder;
