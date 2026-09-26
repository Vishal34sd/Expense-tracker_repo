import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaKey,
  FaCheck,
  FaEdit,
  FaWallet,
  FaShieldAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import SideBar from "../components/SideBar";
import { AVATARS, UserAvatar } from "../utils/avatars.jsx";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "{}");
    } catch {
      return {};
    }
  });

  const [username, setUsername] = useState(userInfo.username || "");
  const [selectedAvatar, setSelectedAvatar] = useState(userInfo.avatar || "avatar1");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({ totalCount: 0, balance: 0 });

  // Set password modal state for users with null password (e.g. Google OAuth)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  // Load latest profile and stats
  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        const [profileRes, statsRes] = await Promise.allSettled([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/profile`, {
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/get`, {
            withCredentials: true,
          }),
        ]);

        if (profileRes.status === "fulfilled" && profileRes.value.data.user) {
          const u = profileRes.value.data.user;
          setUserInfo(u);
          setUsername(u.username || "");
          setSelectedAvatar(u.avatar || "avatar1");
          localStorage.setItem("userInfo", JSON.stringify(u));
        }

        if (statsRes.status === "fulfilled" && statsRes.value.data.data) {
          const txns = statsRes.value.data.data;
          const income = txns
            .filter((t) => t.type === "income")
            .reduce((s, t) => s + Number(t.amount || 0), 0);
          const expense = txns
            .filter((t) => t.type === "expense")
            .reduce((s, t) => s + Number(t.amount || 0), 0);
          setStats({
            totalCount: txns.length,
            balance: income - expense,
          });
        }
      } catch (_err) {
        // Fall back to local info
      }
    };

    fetchProfileAndStats();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      enqueueSnackbar("Username cannot be empty.", { variant: "warning" });
      return;
    }

    setIsSaving(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/profile`,
        { username: username.trim(), avatar: selectedAvatar },
        { withCredentials: true }
      );

      const updated = res.data.user;
      setUserInfo(updated);
      localStorage.setItem("userInfo", JSON.stringify(updated));
      setIsEditing(false);

      // Trigger custom storage event for sync across open components
      window.dispatchEvent(new Event("userInfoUpdated"));

      enqueueSnackbar("Profile updated successfully!", { variant: "success" });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update profile.";
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters.", { variant: "warning" });
      return;
    }
    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Passwords do not match.", { variant: "warning" });
      return;
    }

    setIsSettingPassword(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/changePassword`,
        { newPassword },
        { withCredentials: true }
      );

      const updated = { ...userInfo, hasPassword: true };
      setUserInfo(updated);
      localStorage.setItem("userInfo", JSON.stringify(updated));
      window.dispatchEvent(new Event("userInfoUpdated"));

      enqueueSnackbar("Password created successfully! You can now log in using your email and password.", {
        variant: "success",
      });
      setIsPasswordModalOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create password.";
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setIsSettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      <SideBar />

      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <span>Account Center</span>
            <span>•</span>
            <span className="text-muted-foreground">User Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your personal character avatar, display identity, and security settings.
          </p>
        </div>

        {/* Google OAuth No Password Alert Banner */}
        {userInfo.hasPassword === false && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-200 shadow-lg shadow-amber-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5 sm:mt-0">
                <FaExclamationTriangle className="text-base" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-amber-300">
                    Create a Password for Email Login
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Google Sign-In
                  </span>
                </div>
                <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                  You registered through Google OAuth and do not have a password set. Create a password so you can also log in directly using your email and password.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 transition-all shrink-0 cursor-pointer"
            >
              <FaKey className="text-xs" />
              <span>Set Password Now</span>
            </button>
          </motion.div>
        )}

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Avatar Showcase Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/80 rounded-3xl p-4 sm:p-8 shadow-md flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Glowing avatar ring */}
            <div className="relative mb-4 group cursor-pointer" onClick={() => setIsEditing(true)}>
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-primary via-chart-2 to-chart-4 shadow-xl">
                <UserAvatar
                  id={selectedAvatar}
                  className="w-full h-full bg-card"
                />
              </div>
              <button
                type="button"
                className="absolute bottom-1 right-1 p-2 sm:p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
                title="Change Avatar"
              >
                <FaEdit className="text-xs" />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              {userInfo.username || "User"}
            </h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {userInfo.email || "No email specified"}
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mt-4 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified Account</span>
            </div>

            {/* Quick Mini Stats */}
            <div className="w-full grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-border/60">
              <div className="p-3 rounded-2xl bg-secondary/40 border border-border/60 text-center">
                <div className="text-[11px] text-muted-foreground">Total Logs</div>
                <div className="text-lg font-bold text-foreground mt-0.5">
                  {stats.totalCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/40 border border-border/60 text-center">
                <div className="text-[11px] text-muted-foreground">Net Balance</div>
                <div className={`text-lg font-bold mt-0.5 ${stats.balance >= 0 ? "text-primary" : "text-destructive"}`}>
                  ₹{stats.balance.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Profile Details & Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-card border border-border/80 rounded-3xl p-4 sm:p-8 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Profile Information
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Update your identity and customize your cartoon avatar
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-accent text-xs font-bold border border-border transition-all"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                /* Edit Profile Form */
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Avatar Picker Grid */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Choose Cartoon Avatar
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 p-3 rounded-2xl bg-secondary/30 border border-border/70">
                      {AVATARS.map((av) => {
                        const isSelected = selectedAvatar === av.id;
                        return (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setSelectedAvatar(av.id)}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all cursor-pointer ${
                              isSelected
                                ? "ring-2 ring-primary scale-105 bg-primary/20 shadow-md shadow-primary/25"
                                : "opacity-60 hover:opacity-100 hover:scale-105"
                            }`}
                          >
                            <div className="relative">
                              <UserAvatar id={av.id} className="w-12 h-12" />
                              {isSelected && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[9px] font-bold shadow-xs">
                                  <FaCheck />
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-foreground truncate w-full text-center">
                              {av.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Username Field */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Display Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-secondary/30 border border-border/80 rounded-2xl text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        placeholder="Your username"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field (Disabled) */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Email Address (Locked)
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                      <input
                        type="email"
                        value={userInfo.email || ""}
                        disabled
                        className="w-full pl-9 pr-4 py-2.5 bg-secondary/15 border border-border/50 rounded-2xl text-muted-foreground text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUsername(userInfo.username || "");
                        setSelectedAvatar(userInfo.avatar || "avatar1");
                        setIsEditing(false);
                      }}
                      className="flex-1 py-2.5 rounded-2xl border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-md shadow-primary/25 transition disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                /* View Profile Details */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-semibold">
                        Full Name
                      </div>
                      <div className="text-sm font-bold text-foreground mt-0.5">
                        {userInfo.username || "—"}
                      </div>
                    </div>
                    <span className="text-xs text-primary font-mono">Active</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-semibold">
                        Email Address
                      </div>
                      <div className="text-sm font-bold text-foreground mt-0.5">
                        {userInfo.email || "—"}
                      </div>
                    </div>
                    <span className="text-xs text-emerald-500 font-mono">Verified</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-semibold">
                        Active Avatar Persona
                      </div>
                      <div className="text-sm font-bold text-foreground mt-0.5">
                        {AVATARS.find((a) => a.id === (userInfo.avatar || "avatar1"))?.name || "Cyber Fox"}
                      </div>
                    </div>
                    <UserAvatar id={userInfo.avatar || "avatar1"} className="w-9 h-9" />
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-semibold">
                        Joined Date
                      </div>
                      <div className="text-sm font-bold text-foreground mt-0.5">
                        {userInfo.createdAt
                          ? new Date(userInfo.createdAt).toLocaleDateString("en-IN", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Member"}
                      </div>
                    </div>
                    <FaCalendarAlt className="text-muted-foreground text-sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Security shortcuts */}
            <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FaShieldAlt className="text-primary text-sm" />
                <span>
                  {userInfo.hasPassword === false
                    ? "Password not set (Google OAuth login only)"
                    : "Account secured with JWT encryption & Password"}
                </span>
              </div>

              {userInfo.hasPassword === false ? (
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold border border-amber-500/40 transition cursor-pointer"
                >
                  <FaKey className="text-amber-400 text-xs" />
                  <span>Set Password</span>
                </button>
              ) : (
                <Link
                  to="/changePassword"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 text-foreground hover:bg-secondary text-xs font-semibold border border-border transition"
                >
                  <FaKey className="text-primary text-xs" />
                  <span>Change Password</span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Set Password Modal */}
        <AnimatePresence>
          {isPasswordModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsPasswordModalOpen(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-md bg-card border border-border/90 rounded-3xl p-6 sm:p-8 shadow-2xl z-10"
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <FaKey className="text-sm" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        Set Password
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Enable direct email & password login
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition cursor-pointer"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>

                <form onSubmit={handleSetPassword} className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Create a password for <span className="font-semibold text-foreground">{userInfo.email}</span> so you can log in directly with your email without relying only on Google sign-in.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-9 pr-10 py-2.5 bg-secondary/30 border border-border/80 rounded-2xl text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-9 pr-10 py-2.5 bg-secondary/30 border border-border/80 rounded-2xl text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="flex-1 py-2.5 rounded-2xl border border-border text-muted-foreground hover:text-foreground text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSettingPassword}
                      className="flex-1 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/25 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isSettingPassword ? "Saving..." : "Create Password"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Profile;
