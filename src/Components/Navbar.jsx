import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { motion as Motion } from "framer-motion";

const Navbar = ({ setAuth }) => {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("papps_auth"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("papps_auth");
    setAuth(null);
    setMenuOpen(false); // close menu
    navigate("/home");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const linkVariants = {
    hover: { scale: 1.1, color: "#000" },
    tap: { scale: 0.95 },
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const renderLinks = (isMobile = false) => (
    <>
      <Motion.span variants={linkVariants} whileHover="hover" whileTap="tap">
        <Link
          to="/home"
          onClick={isMobile ? closeMenu : undefined}
          className="nav-link text-white"
        >
          Home
        </Link>
      </Motion.span>

      <Motion.span variants={linkVariants} whileHover="hover" whileTap="tap">
        <Link
          to="/about"
          onClick={isMobile ? closeMenu : undefined}
          className="nav-link text-white"
        >
          About
        </Link>
      </Motion.span>

      <Motion.span variants={linkVariants} whileHover="hover" whileTap="tap">
        <Link
          to="/blog"
          onClick={isMobile ? closeMenu : undefined}
          className="nav-link text-white"
        >
          Blogs
        </Link>
      </Motion.span>

      <Motion.span variants={linkVariants} whileHover="hover" whileTap="tap">
        <Link
          to="/events"
          onClick={isMobile ? closeMenu : undefined}
          className="nav-link text-white"
        >
          Events
        </Link>
      </Motion.span>

      <Motion.span variants={linkVariants} whileHover="hover" whileTap="tap">
        <Link
          to="/about/organization"
          onClick={isMobile ? closeMenu : undefined}
          className="nav-link text-white whitespace-nowrap"
        >
          PAPPS Team
        </Link>
      </Motion.span>

      <Motion.span variants={linkVariants} whileHover="hover" whileTap="tap">
        <Link
          to="/membership"
          onClick={isMobile ? closeMenu : undefined}
          className="nav-link text-white"
        >
          MemberShip
        </Link>
      </Motion.span>

      {(auth?.role === "admin" || auth?.role === "senior_admin") &&
        auth?.isLoggedIn && (
          <Motion.span
            variants={linkVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="/editnews"
              onClick={isMobile ? closeMenu : undefined}
              className="nav-link text-white"
            >
              Edit
            </Link>
          </Motion.span>
        )}

      {auth?.role === "senior_admin" && auth?.isLoggedIn && (
        <Motion.span variants={linkVariants} whileHover="hover" whileTap="tap">
          <Link
            to="/membersdata"
            onClick={isMobile ? closeMenu : undefined}
            className="nav-link text-white"
          >
            Members Data
          </Link>
        </Motion.span>
      )}
    </>
  );

  return (
    <div className="w-full relative">
      {/* TOP BAR */}
      <div className="w-full bg-[#1f2937] shadow-md">
        <div className="grid grid-cols-[auto_1fr] items-center gap-6 px-20 py-3 max-sm:grid-cols-1 max-sm:text-center">
          <img
            src="/assets/paapslogo.jpg"
            alt="PAPPS Logo"
            className="h-40 w-auto object-contain max-sm:mx-auto"
          />
          <h1 className="text-white text-lg md:text-xl font-semibold tracking-wide">
            Pakistan Association of Phonetics &amp; Phonology Scholars
          </h1>
        </div>
      </div>

      {/* NAV BAR */}
      <div className="w-full bg-[#FFAC1C] grid grid-cols-2 items-center py-4 px-4 relative z-20">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-3xl text-white"
            onClick={toggleMenu}
          >
            <GiHamburgerMenu />
          </button>

          <div className="hidden md:flex gap-12 font-semibold items-center">
            {renderLinks()}
          </div>
        </div>

        <div className="flex justify-end">
          {auth?.isLoggedIn &&
          (auth?.role === "admin" || auth?.role === "senior_admin") ? (
            <Motion.button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#FFAC1C] text-white rounded
                 hover:bg-white hover:text-black! border border-[#FFAC1C]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </Motion.button>
          ) : (
            <Motion.button
              onClick={() => {
                closeMenu();
                navigate("/admin/login");
              }}
              className="px-4 py-2 bg-[#FFAC1C] text-white rounded
                 hover:bg-white hover:text-black! border border-[#FFAC1C]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Admin
            </Motion.button>
          )}
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <Motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="absolute top-full left-0 w-full bg-[#FFAC1C] flex flex-col gap-4 p-4 md:hidden z-20"
          >
            {renderLinks(true)}
          </Motion.div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
