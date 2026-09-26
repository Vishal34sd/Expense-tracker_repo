import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiBookOpen, FiStar, FiInfo, FiSun, FiMoon, FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { UserAvatar } from "../utils/avatars.jsx";

const navItems = [
  { label: "Home", id: "home", icon: FiHome },
  { label: "How it Works", id: "how-it-works", icon: FiBookOpen },
  { label: "Features", id: "features", icon: FiStar },
  { label: "About", id: "about", icon: FiInfo },
];

const Navbar = ({ onNavigate }) => {
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "null");
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    const handleUpdate = () => {
      try {
        setUserInfo(JSON.parse(localStorage.getItem("userInfo") || "null"));
      } catch {
        // ignore
      }
    };
    window.addEventListener("userInfoUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("userInfoUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleItemClick = (id) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      navigate(`/#${id}`);
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6"
    >
      {/* Navbar Container */}
      <div
        className="
          max-w-7xl mx-auto
          flex items-center justify-between
          px-3.5 py-2.5 sm:px-7 sm:py-3
          rounded-2xl sm:rounded-full
          backdrop-blur-xl
          bg-card/80
          text-card-foreground
          border border-border/80
          shadow-lg
          transition-all duration-300
        "
      >
        {/* Brand */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-sm shadow-primary/20 shrink-0">
            <FaWallet className="text-base sm:text-xl" />
          </div>
          <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-foreground font-sans">
            Smart<span className="text-primary font-serif italic ml-0.5">Expense</span>
          </span>
        </motion.div>

        {/* Menu - desktop only */}
        <ul className="hidden md:flex items-center space-x-8 text-[15px] font-medium text-muted-foreground">
          {navItems.map((item) => (
            <motion.li
              key={item.id}
              whileHover={{ y: -2 }}
              className="relative cursor-pointer group"
            >
              <button
                type="button"
                onClick={() => handleItemClick(item.id)}
                className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors focus:outline-none py-1"
              >
                <item.icon className="text-base text-primary/70 group-hover:text-primary transition-colors" />
                <span>{item.label}</span>
              </button>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300 rounded-full" />
            </motion.li>
          ))}
        </ul>

        {/* Actions (Theme Toggle & CTA) */}
        <div className="flex items-center gap-3">
          {/* Animated Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-accent border border-border/60 transition-all duration-200 shadow-xs focus:outline-none"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDark ? "dark" : "light"}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? (
                  <FiSun className="text-lg text-amber-300" />
                ) : (
                  <FiMoon className="text-lg text-primary" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Quick CTA */}
          {userInfo ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full bg-secondary/70 hover:bg-secondary border border-border text-foreground text-xs font-semibold transition group"
                title="View & Edit Profile"
              >
                <UserAvatar id={userInfo.avatar || "avatar1"} className="w-6 h-6" />
                <span className="truncate max-w-[100px] group-hover:text-primary transition-colors">
                  {userInfo.username}
                </span>
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-semibold text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                <span>Dashboard</span>
                <FiArrowRight className="text-[10px]" />
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <span>Get Started</span>
                <FiArrowRight className="text-xs" />
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-secondary focus:outline-none transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-3 max-w-7xl mx-auto rounded-2xl bg-card border border-border shadow-xl p-5 backdrop-blur-xl"
          >
            <ul className="flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-foreground hover:bg-secondary hover:text-primary transition font-medium text-sm"
                  >
                    <item.icon className="text-primary text-lg" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              {userInfo ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-secondary"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
