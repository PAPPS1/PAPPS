import React from "react";

const AboutObjectives = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border-l-8 border-[#FFAC1C]">
      {/* Header */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-green-600 mb-6">
        Objectives
      </h2>

      {/* Content */}
      <ul className="text-gray-700 text-justify leading-relaxed space-y-4 list-disc list-outside pl-6">
        <li className=" wrap-break-word ">
          To promote phonetics and phonology education through regular
          webinars,academic talks, workshops, and conferences.
        </li>

        <li>
          To support research on phonetics and phonology, with special focus on
          Pakistani regional and endangered languages, through academic
          platforms and scholarly collaboration.
        </li>

        <li>
          To build capacity in experimental and applied phonetics through
          practical training in analysis tools and research methods.
        </li>

        <li>
          To link Pakistani scholars with the global phonetics and phonology
          community through international collaboration and exchange.
        </li>

        <li>
          To encourage students and early-career researchers by providing
          guidance, visibility, and inclusive academic opportunities.
        </li>
      </ul>
    </div>
  );
};

export default AboutObjectives;
