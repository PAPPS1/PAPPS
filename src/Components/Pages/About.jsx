import React from "react";
import { Link, Outlet } from "react-router-dom";

const About = () => {
  return (
    <div className="h-auto px-20 py-2 border-2 flex flex-col gap-10">
      <span className="text-2xl font-extrabold text-gray-500 border-b-8 py-3">
        About
      </span>

      <div className="flex flex-col xl:flex-row gap-6 p-6 max-w-7xl mx-auto">
        {/* SIDEBAR */}
        <div className="shrink-0 w-full xl:w-1/4 bg-white border-2 rounded-xl p-6 flex flex-wrap xl:flex-col gap-4 shadow-md">
          {[
            { to: "history", label: "History" },
            { to: "founder", label: "Founder" },
            { to: "objectives", label: "Objectives" },
            { to: "organization", label: "PAAPS Team" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="w-full no-underline! text-center px-6 py-2 rounded-md bg-[#FFAC1C] text-black font-medium shadow-md transition-all duration-200 ease-in-out
                  hover:bg-white hover:text-[#FFAC1C] hover:shadow-lg active:scale-95 active:shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-[#FFAC1C]/50"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-white rounded-xl p-6 shadow-md min-h-75">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default About;
