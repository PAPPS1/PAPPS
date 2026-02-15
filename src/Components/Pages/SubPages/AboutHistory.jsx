import React from "react";

const AboutHistory = () => {
  return (
    <div
      className="max-w-4xl 
                    mx-auto 
                    px-4 sm:px-6 
                    py-4 sm:py-6 
                    bg-white 
                    rounded-xl 
                    shadow-lg 
                    border-l-4 sm:border-l-8 
                    border-[#FFAC1C]"
    >
      {/* Header */}
      <h2
        className="text-xl sm:text-3xl md:text-4xl 
                     font-extrabold 
                     text-green-600 
                     mb-4 sm:mb-6"
      >
        History
      </h2>

      {/* Content */}
      <p
        className="text-gray-700 
                    text-left sm:text-justify 
                    text-sm sm:text-base 
                    leading-relaxed 
                    sm:leading-loose"
      >
        The Pakistan Association of Phonetics & Phonology Scholars (PAPPS) is a
        pioneering academic initiative dedicated to advancing the study,
        research, and teaching of Phonetics and Phonology in Pakistan.
        <br />
        <br />
        At a time when global scholarship in these fields is rapidly expanding,
        embracing experimental methods, acoustic analysis, speech technology,
        and interdisciplinary research, Pakistani academia has largely remained
        confined to textbook-based instruction and examination-oriented
        assessment.
        <br />
        <br />
        For decades, Phonetics and Phonology in Pakistan have been treated as
        peripheral subjects, often reduced to limited classroom coverage and a
        single 100-mark paper, with little emphasis on research, innovation, or
        real-world application.
        <br />
        <br />
        PAPPS emerges as a timely and necessary response to this long-standing
        academic gap. Committed to academic revival and intellectual
        progression, PAPPS aims to introduce contemporary and emerging research
        avenues to young scholars, researchers, and faculty members alike.
        <br />
        <br />
        Through webinars, training sessions, scholarly discussions, and
        collaborative platforms, the association works to bridge the gap between
        global research practices and local academic realities.
        <br />
        <br />
        Founded by ZA Jasra, a dedicated phonetician and academic, PAPPS
        reflects a deep-rooted passion for the discipline and a firm belief that
        Pakistani scholars deserve equal access to cutting-edge knowledge and
        research culture.
        <br />
        <br />
        More than an association, PAPPS represents a movement — one that seeks
        to reposition Phonetics and Phonology as central, dynamic, and
        research-driven fields within Pakistani academia.
        <br />
        <br />
        PAPPS stands for progress, relevance, and scholarly empowerment,
        reshaping how speech sciences are understood, taught, and researched in
        Pakistan.
      </p>
    </div>
  );
};

export default AboutHistory;
