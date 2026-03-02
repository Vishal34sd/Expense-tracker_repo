import React from "react";
import { motion } from "framer-motion";
import { FiHome, FiBookOpen, FiStar, FiInfo } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";

const navItems = [
  { label: "Home", id: "home", icon: FiHome },
  { label: "How it Works", id: "how-it-works", icon: FiBookOpen },
  { label: "Features", id: "features", icon: FiStar },
  { label: "About", id: "about", icon: FiInfo },
];

const Navbar = ({ onNavigate }) => {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-4 left-0 right-0 z-50  px-4 sm:px-6"
    >
      {/* Navbar Container */}
      <div
        className="
          max-w-7xl mx-auto
          flex items-center justify-center md:justify-between
          px-4 sm:px-6  mt-6
          rounded-full
          backdrop-blur-lg
          bg-purple-900/20
          border border-purple-600/40 
          shadow-[0_0_25px_rgba(168,85,247,0.25)]
        "
      >
        {/* Brand */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="
            px-10 py-2  
            text-white
            font-bold
            text-3xl sm:text-3xl
            tracking-wide
            cursor-pointer
          "
        >
          <span className="inline-flex items-center gap-2">
            <img src ="/smartExpense-logo.png " alt="logo"></img>
          </span>
        </motion.div>

        {/* Menu - desktop only */}
        <ul className="hidden md:flex items-center space-x-16 text-xl font-medium text-white/80 mr-10">
          {navItems.map((item) => (
            <motion.li
              key={item.id}
              whileHover={{ y: -2 }}
              className="relative cursor-pointer group"
            >
              <button
                type="button"
                onClick={() => onNavigate && onNavigate(item.id)}
                className="flex items-center gap-2 group-hover:text-white transition focus:outline-none"
              >
                <item.icon className="text-lg" />
                <span>{item.label}</span>
              </button>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-400 group-hover:w-full transition-all duration-300" />
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;
