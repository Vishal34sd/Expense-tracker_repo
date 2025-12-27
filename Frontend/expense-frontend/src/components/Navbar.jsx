import React from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-purple-900/20 border-b border-purple-500/20"
    >
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand Section */}
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-xl font-bold tracking-wide text-purple-300"
        >
          smartExpense
        </motion.h1>

        {/* Menu Section */}
        <div className="hidden md:block">
          <ul className="flex space-x-8 text-sm font-medium text-purple-200">
            {["Home", "How it Works", "Features", "About"].map((item, idx) => (
              <motion.li
                key={idx}
                whileHover={{ y: -2 }}
                className="relative cursor-pointer group"
              >
                <span className="group-hover:text-purple-400 transition">
                  {item}
                </span>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-400 group-hover:w-full transition-all duration-300" />
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
