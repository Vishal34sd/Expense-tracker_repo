import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { UserAvatar } from "../utils/avatars.jsx";
import { confirmAction } from "../utils/alerts";

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

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

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
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-5 hidden sm:flex flex-col justify-between shrink-0 min-h-screen sticky top-0 transition-colors duration-300">
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
                  <Icon className={`text-base ${isActive ? "text-sidebar-primary-foreground" : "text-sidebar-primary"}`} />
                  <span>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls & user */}
      <div className="pt-4 border-t border-sidebar-border/60 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          type="button"
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-sidebar-foreground/80 bg-sidebar-accent hover:bg-sidebar-accent/80 border border-sidebar-border transition-all"
        >
          <span className="flex items-center gap-2">
            {isDark ? <FiMoon className="text-sidebar-primary text-sm" /> : <FiSun className="text-amber-500 text-sm" />}
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
              <UserAvatar id={userInfo.avatar || "avatar1"} className="w-9 h-9" />
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
          className="flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition-all w-full"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
