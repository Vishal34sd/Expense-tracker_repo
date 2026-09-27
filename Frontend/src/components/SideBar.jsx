import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaHome,
  FaListAlt,
  FaChartPie,
  FaPlusCircle,
  FaCog,
  FaSignOutAlt,
  FaWallet,
  FaRobot,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaPlus,
  FaChartBar,
} from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { UserAvatar } from "../utils/avatars.jsx";
import { confirmAction } from "../utils/alerts";
import SidebarExpenseAnalysis from "./SidebarExpenseAnalysis";

const menuItems = [
  { path: "/home", label: "Overview", icon: FaHome },
  { path: "/dashboard", label: "Dashboard", icon: FaWallet },
  { path: "/addTransaction", label: "All Transactions", icon: FaListAlt },
  { path: "/summary", label: "Summary & Reports", icon: FaChartPie },
  { path: "/add", label: "Add Expense", icon: FaPlusCircle },
  { path: "/ask-chatbot", label: "AI Financial Assistant", icon: FaRobot },
  { path: "/profile", label: "My Profile", icon: FaUserCircle },
  { path: "/changePassword", label: "Security & Settings", icon: FaCog },
];

const bottomNavItems = [
  { path: "/home", label: "Overview", icon: FaHome },
  { path: "/dashboard", label: "Dashboard", icon: FaWallet },
  { path: "/add", label: "Add", icon: FaPlus, isSpecial: true },
  { path: "/addTransaction", label: "Ledger", icon: FaListAlt },
  { path: "/ask-chatbot", label: "AI Co-Pilot", icon: FaRobot },
];

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileAnalysisModalOpen, setMobileAnalysisModalOpen] = useState(false);

  const [userInfo, setUserInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "{}");
    } catch {
      return {};
    }
  });

  // Listen for live profile updates
  useEffect(() => {
    const handleUpdate = () => {
      try {
        setUserInfo(JSON.parse(localStorage.getItem("userInfo") || "{}"));
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

  // Close mobile drawer and modal on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
    setMobileAnalysisModalOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    const isConfirmed = await confirmAction({
      title: "Sign Out?",
      text: "Are you sure you want to end your current session?",
      icon: "question",
      confirmButtonText: "Yes, Sign Out",
      cancelButtonText: "Stay",
      isDestructive: true,
    });

    if (!isConfirmed) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/logout`,
        {},
        { withCredentials: true }
      );
    } catch {
      // Ignore network error on logout
    }
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <>
      {/* ============================================================== */}
      {/* 1. MOBILE TOP APP BAR (< md)                                   */}
      {/* ============================================================== */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar/95 backdrop-blur-xl border-b border-sidebar-border px-3.5 sm:px-5 py-2.5 flex items-center justify-between transition-colors duration-300 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open Navigation Drawer"
            className="p-2 rounded-xl bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 border border-sidebar-border transition-colors cursor-pointer"
          >
            <FaBars className="text-base" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary/10 border border-sidebar-primary/30 flex items-center justify-center text-sidebar-primary shadow-2xs">
              <FaWallet className="text-sm" />
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-sidebar-foreground font-sans">
              Smart<span className="text-sidebar-primary font-serif italic ml-0.5">Expense</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Expense Analysis trigger */}
          <button
            onClick={() => setMobileAnalysisModalOpen(true)}
            type="button"
            aria-label="Open Expense Analysis"
            title="Expense Analysis"
            className="p-2 rounded-full bg-sidebar-accent text-sidebar-primary hover:bg-sidebar-accent/80 border border-sidebar-border transition-all cursor-pointer relative"
          >
            <FaChartBar className="text-sm" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-sidebar-primary animate-pulse" />
          </button>

          {/* Quick theme toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
            className="p-2 rounded-full bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 border border-sidebar-border transition-all cursor-pointer"
          >
            {isDark ? (
              <FiSun className="text-amber-300 text-sm" />
            ) : (
              <FiMoon className="text-sidebar-primary text-sm" />
            )}
          </button>

          {/* Quick profile avatar link */}
          <Link
            to="/profile"
            title="Profile"
            className="p-0.5 rounded-full border border-sidebar-border hover:border-sidebar-primary transition-all"
          >
            <UserAvatar id={userInfo.avatar || "avatar1"} className="w-7 h-7" />
          </Link>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MOBILE EXPENSE ANALYSIS MODAL (< md)                           */}
      {/* ============================================================== */}
      <AnimatePresence>
        {mobileAnalysisModalOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileAnalysisModalOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full sm:max-w-md bg-sidebar text-sidebar-foreground border-t sm:border border-sidebar-border rounded-t-3xl sm:rounded-2xl p-4 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-sidebar-border/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sidebar-primary/15 border border-sidebar-primary/30 flex items-center justify-center text-sidebar-primary shadow-xs">
                    <FaChartBar className="text-sm" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-sidebar-foreground">Expense Analysis</h3>
                    <p className="text-[10px] text-muted-foreground">Daily, Weekly & Monthly Expenses</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileAnalysisModalOpen(false)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                  aria-label="Close Analysis"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              <SidebarExpenseAnalysis />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 2. MOBILE SLIDE-OVER DRAWER (< md)                             */}
      {/* ============================================================== */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-4/5 max-w-xs bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-full flex flex-col justify-between p-5 shadow-2xl z-10 overflow-y-auto"
            >
              <div>
                {/* Brand & Close Button */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-sidebar-border/60">
                  <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sidebar-primary/10 border border-sidebar-primary/30 flex items-center justify-center text-sidebar-primary shadow-xs">
                      <FaWallet className="text-base" />
                    </div>
                    <div>
                      <span className="font-extrabold text-lg tracking-tight text-sidebar-foreground font-sans">
                        Smart<span className="text-sidebar-primary font-serif italic ml-0.5">Expense</span>
                      </span>
                      <div className="text-[10px] text-muted-foreground font-mono">v2.5 Personal</div>
                    </div>
                  </Link>

                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1 text-sm">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/25"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <Icon
                          className={`text-base ${
                            isActive
                              ? "text-sidebar-primary-foreground"
                              : "text-sidebar-primary"
                          }`}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Expense Analysis Widget in Mobile Drawer */}
                <div className="mt-5 pt-4 border-t border-sidebar-border/60">
                  <SidebarExpenseAnalysis />
                </div>
              </div>

              {/* Drawer Footer Controls */}
              <div className="pt-4 border-t border-sidebar-border/60 space-y-3 mt-6">
                {/* Theme Toggle in Drawer */}
                <button
                  onClick={toggleTheme}
                  type="button"
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-sidebar-foreground/80 bg-sidebar-accent hover:bg-sidebar-accent/80 border border-sidebar-border transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {isDark ? (
                      <FiSun className="text-amber-400 text-sm" />
                    ) : (
                      <FiMoon className="text-sidebar-primary text-sm" />
                    )}
                    <span>{isDark ? "Dark Appearance" : "Light Appearance"}</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-background text-muted-foreground border border-border">
                    Toggle
                  </span>
                </button>

                {/* User Profile Card */}
                {userInfo?.username && (
                  <Link
                    to="/profile"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-2.5 rounded-2xl bg-card hover:bg-secondary/70 border border-border text-xs flex items-center gap-3 transition-all"
                  >
                    <div className="relative">
                      <UserAvatar
                        id={userInfo.avatar || "avatar1"}
                        className="w-9 h-9"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                    </div>
                    <div className="truncate flex-1">
                      <div className="font-bold text-foreground truncate">
                        {userInfo.username}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        View & Edit Profile →
                      </div>
                    </div>
                  </Link>
                )}

                {/* Sign Out */}
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    handleLogout();
                  }}
                  type="button"
                  className="flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition-all w-full cursor-pointer"
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 3. MOBILE BOTTOM NAVIGATION BAR (< md)                         */}
      {/* ============================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border px-2 py-1.5 flex items-center justify-around shadow-lg transition-colors duration-300">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-5"
                title={item.label}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/35 border-2 border-card"
                >
                  <FaPlus className="text-base" />
                </motion.div>
                <span className="text-[10px] font-bold text-primary mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              <Icon className="text-base mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* More / Menu Drawer Toggle Tab */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-muted-foreground hover:text-foreground font-medium cursor-pointer"
        >
          <FaBars className="text-base mb-0.5" />
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </nav>

      {/* ============================================================== */}
      {/* 4. DESKTOP PERMANENT SIDEBAR (>= md)                           */}
      {/* ============================================================== */}
      <aside className="w-72 lg:w-80 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-4 lg:p-5 hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto custom-sidebar-scroll transition-colors duration-300">
        <div>
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 px-2 mb-7 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="w-10 h-10 rounded-xl bg-sidebar-primary/10 border border-sidebar-primary/30 flex items-center justify-center text-sidebar-primary shadow-sm"
            >
              <FaWallet className="text-xl" />
            </motion.div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-sidebar-foreground font-sans">
                Smart<span className="text-sidebar-primary font-serif italic ml-0.5">Expense</span>
              </span>
              <div className="text-[11px] text-muted-foreground font-mono">v2.5 Personal</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1.5 text-sm">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative block"
                >
                  <motion.div
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/25"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <Icon
                      className={`text-base ${
                        isActive
                          ? "text-sidebar-primary-foreground"
                          : "text-sidebar-primary"
                      }`}
                    />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Expense Analysis Section */}
          <div className="mt-5 pt-4 border-t border-sidebar-border/60">
            <SidebarExpenseAnalysis />
          </div>
        </div>

        {/* Footer controls & user */}
        <div className="pt-4 border-t border-sidebar-border/60 space-y-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-sidebar-foreground/80 bg-sidebar-accent hover:bg-sidebar-accent/80 border border-sidebar-border transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {isDark ? (
                <FiMoon className="text-sidebar-primary text-sm" />
              ) : (
                <FiSun className="text-amber-500 text-sm" />
              )}
              <span>{isDark ? "Dark Appearance" : "Light Appearance"}</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-background text-muted-foreground border border-border">
              Toggle
            </span>
          </button>

          {/* Interactive User Avatar Card */}
          {userInfo?.username && (
            <Link
              to="/profile"
              className="p-2.5 rounded-2xl bg-card hover:bg-secondary/70 border border-border text-xs flex items-center gap-3 transition-all group"
              title="View & Edit Profile"
            >
              <div className="relative">
                <UserAvatar
                  id={userInfo.avatar || "avatar1"}
                  className="w-9 h-9"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
              </div>
              <div className="truncate flex-1">
                <div className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {userInfo.username}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  View & Edit Profile →
                </div>
              </div>
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            type="button"
            className="flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition-all w-full cursor-pointer"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
