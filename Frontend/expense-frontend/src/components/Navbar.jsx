import React from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-0 right-0 z-50 px-6"
    >
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Section */}
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-4xl font-bold tracking-wide text-white"
        >
          smartExpense
        </motion.h1>

        {/* Menu Section */}
        <div
          className="
            px-8 py-3
            rounded-full
            backdrop-blur-lg
            bg-purple-900/20
            border border-purple-600/40
            shadow-[0_0_25px_rgba(168,85,247,0.25)]
            w-1/2
          "
        >
          <ul className="flex space-x-24 text-sm font-medium text-white/80">
            {["Home", "How it Works", "Features", "About"].map((item, idx) => (
              <motion.li
                key={idx}
                whileHover={{ y: -2 }}
                className="relative cursor-pointer group"
              >
                <span className="group-hover:text-white transition">
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
