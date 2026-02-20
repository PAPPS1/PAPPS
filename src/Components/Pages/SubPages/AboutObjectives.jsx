import React from "react";

const AboutObjectives = () => {
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
              To promote phonetics and phonology education through regular
              webinars, academic talks, workshops, and conferences.
            </li>

            <li>
              To support research in phonetics and phonology, with special focus
              on Pakistani regional and endangered languages, through academic
              platforms and scholarly collaboration.
            </li>

            <li>
              To build capacity in experimental and applied phonetics through
              practical training in analytical tools and research methodologies.
            </li>

            <li>
              To connect Pakistani scholars with the global phonetics and
              phonology community through international collaboration and
              academic exchange.
            </li>

            <li>
              To encourage students and early-career researchers by providing
              guidance, visibility, and inclusive academic opportunities.
            </li>
          </ul>
        </div>
      </div>

      {/* ================= MOBILE VIEW (Refined & Compact) ================= */}
      <div className="block md:hidden bg-gradient-to-b from-[#fff8ef] to-white pb-6">
        <div className="px-4 pt-5 pb-2 max-w-lg mx-auto">
          {/* Header */}
          <h2 className="text-base font-semibold text-green-600 mb-4 tracking-wide">
            Objectives
          </h2>

          {/* Content */}
          <ul className="text-gray-700 text-[13px] leading-[1.6] space-y-3">
            <li className="flex gap-2">
              <span className="text-[#FFAC1C] font-bold">•</span>
              <span>
                Promote phonetics and phonology education through webinars,
                academic talks, workshops, and conferences.
              </span>
            </li>

            <li className="flex gap-2">
              <span className="text-[#FFAC1C] font-bold">•</span>
              <span>
                Support research in phonetics and phonology, focusing on
                Pakistani regional and endangered languages.
              </span>
            </li>

            <li className="flex gap-2">
              <span className="text-[#FFAC1C] font-bold">•</span>
              <span>
                Build capacity in experimental and applied phonetics through
                practical training and research methodologies.
              </span>
            </li>

            <li className="flex gap-2">
              <span className="text-[#FFAC1C] font-bold">•</span>
              <span>
                Connect Pakistani scholars with the global phonetics and
                phonology community through collaboration and exchange.
              </span>
            </li>

            <li className="flex gap-2">
              <span className="text-[#FFAC1C] font-bold">•</span>
              <span>
                Encourage students and early-career researchers through
                guidance, visibility, and inclusive opportunities.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AboutObjectives;
