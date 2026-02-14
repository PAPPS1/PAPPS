import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const images = [
  "/assets/slider1.jpeg",
  "/assets/slider2.jpeg",
  "/assets/slider3.jpeg",
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newsItems, setNewsItems] = useState([]);

  // Load news from MongoDB
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/news");
        setNewsItems(res.data);
      } catch (err) {
        console.error("Failed to load news:", err);
      }
    };

    fetchNews();
  }, []);

  // Auto slider every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      title: "Join PAPPS",
      link: "/membership",
      image: "/assets/joinpapps.jpeg",
    },
    {
      title: "Gallery",
      image: "/assets/gallery1.png",
    },
    {
      title: "Study Corner",
      link: "/studycorner",
      image: "/assets/study.jpeg",
    },
    {
      title: "Courses & Trainings",
      link: "/coursesandtrainings",
      image: "/assets/trainings.jpeg",
    },
  ];

  return (
    <div className="Home w-full border-2 border-black">
      {/* ================= SLIDER ================= */}
      <div className="Advertisement bg-[#f1f5f2] p-3 border-b-2 relative overflow-hidden">
        <div className="relative h-48 w-full overflow-hidden">
          <div
            className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((img, index) => (
              <div key={index} className="w-full shrink-0 h-48">
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CARDS ================= */}
      <div className="relative z-10 bg-[#f1f5f2] grid grid-cols-4  max-xl:grid-cols-2 gap-4 p-6 border-b-2 justify-items-center">
        {cards.map((card, i) => {
          const CardContent = (
            <div className="w-72 bg-[#FFAC1C] rounded-lg shadow-md  overflow-hidden transition-transform duration-300 hover:scale-105">
              <img
                src={card.image}
                alt="Card"
                className="w-full h-44 object-cover"
              />
              {/* Divider */}
              <div className="h-1 "></div>
              <div className="p-4">
                <h5 className="text-lg font-semibold mb-2 text-black ">
                  {card.title}
                </h5>
                <p className="text-gray-700 mb-4 ">
                  Some quick example text to build on the card title.
                </p>
                <button
                  className="inline-block bg-white text-black px-4 py-2 rounded
                             transition-all duration-300 ease-in-out
                             hover:bg-gray-200!
                             active:scale-95"
                >
                  {card.title}
                </button>
              </div>
            </div>
          );

          // If card has a link, wrap in <Link>
          return card.link ? (
            <Link className="no-underline!" key={i} to={card.link}>
              {CardContent}
            </Link>
          ) : (
            <div key={i}>{CardContent}</div>
          );
        })}
      </div>

      {/* ================= NEWS & LINKS ================= */}
      <div className="relative z-10 bg-[#f1f5f2] grid grid-cols-1 md:grid-cols-2 gap-10 p-10 justify-items-center">
        {/* NEWS */}
        <div className="w-full md:w-[70%]">
          <h4 className="text-lg font-semibold">News and Events</h4>
          <hr className="border-t-4 border-blue-700 my-6" />

          <ul className="space-y-4">
            {newsItems.map((item) => (
              <li
                key={item._id}
                className="bg-white rounded p-4 shadow-sm transition hover:bg-blue-50"
              >
                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-gray-700 text-sm wrap-break-word whitespace-normal">
                  {item.paragraph}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* LINKS */}
        <div className="w-full md:w-[70%]">
          <h3 className="text-lg font-medium ">Important Links</h3>
          <hr className="border-t-4 border-blue-700 my-6" />

          <ul className="space-y-2">
            {[
              { label: "Certificates", path: "/certificates" },
              {
                label: "Facebook",
                external: "https://www.facebook.com/share/1LnqbMvKXJ/",
              },

              {
                label: "LinkedIn",
                external: "https://www.linkedin.com/company/papps_pak/",
              },
              {
                label: "WhatsApp",
                external:
                  "https://whatsapp.com/channel/0029VbCeuh76RGJKubuHt50A",
              },
            ].map((item, i) => (
              <li
                key={i}
                className="bg-white rounded p-3 shadow-sm transition hover:bg-blue-50"
              >
                {item.path ? (
                  <Link
                    to={item.path}
                    className="no-underline! block w-full h-full
  px-4 py-2
  rounded-lg
  bg-white
  text-[#FFAC1C]!
  font-bold
  shadow-sm
  transition-all duration-200 ease-in-out
  hover:bg-[#FFAC1C]
  hover:text-white
  hover:shadow-md
  active:scale-95
  cursor-pointer
  focus:outline-none
  focus:ring-2
  focus:ring-[#FFAC1C]"
                  >
                    {item.label}
                  </Link>
                ) : item.external ? (
                  <a
                    href={item.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline! block w-full h-full
  px-4 py-2
  rounded-lg
  bg-white
  text-[#FFAC1C]!
  font-bold
  shadow-sm
  transition-all duration-200 ease-in-out
  hover:bg-[#FFAC1C]
  hover:text-white
  hover:shadow-md
  active:scale-95
  cursor-pointer
  focus:outline-none
  focus:ring-2
  focus:ring-[#FFAC1C]"
                  >
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#1f2937] text-gray-300 pt-12 pb-6 mt-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ABOUT */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              About PAPPS
            </h3>
            <p className="text-sm leading-relaxed">
              Pakistan Association of Phonetics & Phonology Scholars (PAPPS) is
              a non-profit academic body dedicated to the advancement of
              phonetics and phonology research in Pakistan. We promote scholarly
              dialogue, academic networking, and research collaboration at
              national and international levels.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/home"
                  className="hover:text-[#FFAC1C] transition no-underline!"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/membership"
                  className="hover:text-[#FFAC1C] transition no-underline!"
                >
                  Membership
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="hover:text-[#FFAC1C] transition no-underline!"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/certificates"
                  className="hover:text-[#FFAC1C] transition no-underline!"
                >
                  Certificates
                </Link>
              </li>
              <li>
                <Link
                  to="/studycorner"
                  className="hover:text-[#FFAC1C] transition no-underline!"
                >
                  Study Corner
                </Link>
              </li>
            </ul>
          </div>

          {/* ACADEMIC FOCUS */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Academic Focus
            </h3>
            <ul className="space-y-2 text-sm">
              <li>Phonetics Research</li>
              <li>Phonological Theory</li>
              <li>Speech Sound Analysis</li>
              <li>Pakistani Languages</li>
              <li>Workshops & Webinars</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Contact Us
            </h3>
            <p className="text-sm mb-2">Email: papps.pak@gmail.com</p>
            <p className="text-sm mb-2">Pakistan</p>
            <p className="text-sm">Academic • Non-Profit • Research-Based</p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-600 mt-10 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Pakistan Association of Phonetics &
          Phonology Scholars (PAPPS). All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
