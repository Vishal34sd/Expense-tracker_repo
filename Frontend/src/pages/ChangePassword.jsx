import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import SideBar from "../components/SideBar";
import CartoonSecurityMascot from "../components/CartoonSecurityMascot";

const ChangePassword = () => {
  const [userInfo, setUserInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "{}");
    } catch {
      return {};
    }
  });

  const hasPassword = userInfo.hasPassword !== false;
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimerRef = useRef(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // If userInfo doesn't specify hasPassword, check profile
  React.useEffect(() => {
    if (userInfo.hasPassword === undefined) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/profile`, { withCredentials: true })
        .then((res) => {
          if (res.data?.user) {
            setUserInfo(res.data.user);
            localStorage.setItem("userInfo", JSON.stringify(res.data.user));
          }
        })
        .catch(() => {});
    }
  }, [userInfo.hasPassword]);

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

    if (hasPassword) {
      if (!oldPassword || !newPassword) {
        enqueueSnackbar("Please fill in both fields.", { variant: "warning" });
        return;
      }
    } else {
      if (!newPassword || !confirmPassword) {
        enqueueSnackbar("Please fill in both password fields.", { variant: "warning" });
        return;
      }
      if (newPassword !== confirmPassword) {
        enqueueSnackbar("Passwords do not match.", { variant: "warning" });
        return;
      }
    }

    if (newPassword.length < 6) {
      enqueueSnackbar("New password must be at least 6 characters.", { variant: "warning" });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = hasPassword ? { oldPassword, newPassword } : { newPassword };
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/changePassword`,
        payload,
        { withCredentials: true }
      );

      const updated = { ...userInfo, hasPassword: true };
      setUserInfo(updated);
      localStorage.setItem("userInfo", JSON.stringify(updated));
      window.dispatchEvent(new Event("userInfoUpdated"));

      enqueueSnackbar(
        hasPassword
          ? "Password updated successfully."
          : "Password created successfully! You can now log in using your email and password.",
        { variant: "success" }
      );
      navigate("/profile");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Could not update password. Please verify current password.";
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
              isPeeking={showOld || showNew || showConfirm}
            />
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              {hasPassword ? "Update Security" : "Set Account Password"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {hasPassword
                ? "Change your account password securely"
                : "Create a password to enable email & password login"}
            </p>
          </div>

          {!hasPassword && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              You registered with Google and do not have a password set. Set a password below to enable direct email login.
            </div>
          )}

          <form className="space-y-4" onSubmit={submitHandler}>
            {hasPassword && (
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
            )}

            <div>
              <label
                htmlFor="newPassword"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
              >
                {hasPassword ? "New Password" : "Create Password"}
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
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
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

            {!hasPassword && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                  <input
                    value={confirmPassword}
                    onFocus={() => setIsTyping(true)}
                    onChange={handlePasswordInput(setConfirmPassword)}
                    onBlur={handleBlur}
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    className="w-full pl-9 pr-10 py-2.5 bg-secondary/30 border border-border/80 rounded-2xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                    placeholder="Re-enter password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md shadow-primary/25 transition-all mt-3 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : hasPassword
                ? "Update Password"
                : "Save Password"}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default ChangePassword;
