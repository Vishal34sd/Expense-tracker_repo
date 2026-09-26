import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import SideBar from "../components/SideBar";
import CartoonSecurityMascot from "../components/CartoonSecurityMascot";

const ChangePassword = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimerRef = useRef(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handlePasswordInput = (setter) => (e) => {
    setter(e.target.value);
    setIsTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 750);
  };

  const handleBlur = () => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setIsTyping(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      enqueueSnackbar("Please fill in both fields.", { variant: "warning" });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/changePassword`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      enqueueSnackbar("Password updated successfully.", { variant: "success" });
      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Could not change password. Please verify old password.";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      <SideBar />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-card/90 backdrop-blur-xl border border-border/80 shadow-xl rounded-3xl p-5 sm:p-10 w-full max-w-md relative"
        >
          <div className="text-center mb-6">
            <CartoonSecurityMascot
              isTyping={isTyping}
              isPeeking={showOld || showNew}
            />
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              Update Security
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Change your account password securely
            </p>
          </div>

          <form className="space-y-4" onSubmit={submitHandler}>
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
              >
                Current Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                <input
                  value={oldPassword}
                  onFocus={() => setIsTyping(true)}
                  onChange={handlePasswordInput(setOldPassword)}
                  onBlur={handleBlur}
                  id="oldPassword"
                  type={showOld ? "text" : "password"}
                  className="w-full pl-9 pr-10 py-2.5 bg-secondary/30 border border-border/80 rounded-2xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                >
                  {showOld ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
              >
                New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                <input
                  value={newPassword}
                  onFocus={() => setIsTyping(true)}
                  onChange={handlePasswordInput(setNewPassword)}
                  onBlur={handleBlur}
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  className="w-full pl-9 pr-10 py-2.5 bg-secondary/30 border border-border/80 rounded-2xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md shadow-primary/25 transition-all mt-3 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Save New Password"}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default ChangePassword;
