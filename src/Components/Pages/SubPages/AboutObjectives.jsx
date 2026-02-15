import React from "react";

const AboutObjectives = () => {
  return (
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
      {/* Header */}
      <h2
        className="text-xl sm:text-3xl md:text-4xl 
                   font-extrabold 
                   text-green-600 
                   mb-4 sm:mb-6"
      >
        Objectives
      </h2>

      {/* Content */}
      <ul
        className="text-gray-700 
                   text-left sm:text-justify 
                   text-sm sm:text-base 
                   leading-relaxed sm:leading-loose 
                   space-y-4 
                   list-disc 
                   pl-5 sm:pl-6"
      >
        <li>
          To promote phonetics and phonology education through regular webinars,
          academic talks, workshops, and conferences.
        </li>

        <li>
          To support research in phonetics and phonology, with special focus on
          Pakistani regional and endangered languages, through academic
          platforms and scholarly collaboration.
        </li>

        <li>
          To build capacity in experimental and applied phonetics through
          practical training in analytical tools and research methodologies.
        </li>

        <li>
          To connect Pakistani scholars with the global phonetics and phonology
          community through international collaboration and academic exchange.
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
