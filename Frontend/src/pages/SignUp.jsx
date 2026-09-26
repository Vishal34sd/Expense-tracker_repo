import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  FaWallet,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaRobot,
  FaChartPie,
  FaShieldAlt,
  FaQuoteLeft,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { AVATARS, UserAvatar } from "../utils/avatars.jsx";

const SignUp = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("avatar4"); // Default Rocket Shiba
  const [showPassword, setShowPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isDark, toggleTheme } = useTheme();

  const formHandler = async (event) => {
    event.preventDefault();
    setShowLoader(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/register`,
        { username, email, password, avatar: selectedAvatar },
        { withCredentials: true }
      );

      if (res.data.user) {
        localStorage.setItem("userInfo", JSON.stringify(res.data.user));
        const normalizedEmail = email.trim().toLowerCase();
        try {
          localStorage.setItem("lastLoginEmail", normalizedEmail);
          const currentList = JSON.parse(localStorage.getItem("recentEmails") || "[]");
          const updatedList = [
            normalizedEmail,
            ...currentList.filter((e) => e !== normalizedEmail),
          ].slice(0, 5);
          localStorage.setItem("recentEmails", JSON.stringify(updatedList));
        } catch {
          // ignore
        }
      }

      enqueueSnackbar("Registration successful! Welcome.", {
        variant: "success",
      });

      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setShowLoader(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/google`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-300">
      {/* Ambient mesh blobs */}
      <div className="ambient-glow-mesh">
        <div className="blob-1" />
        <div className="blob-2" />
      </div>

      {/* Top Navbar Header */}
      <header className="fixed top-3 sm:top-4 left-3 sm:left-6 right-3 sm:right-6 flex justify-between items-center z-20 max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 sm:gap-2.5 text-foreground font-bold text-base sm:text-lg group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
            <FaWallet className="text-sm sm:text-base" />
          </div>
          <span className="font-sans font-extrabold text-base sm:text-xl">
            Smart<span className="text-primary font-serif italic">Expense</span>
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
          className="p-2 sm:p-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-accent border border-border transition-all shadow-xs"
        >
          {isDark ? (
            <FiSun className="text-amber-300 text-sm sm:text-base" />
          ) : (
            <FiMoon className="text-primary text-sm sm:text-base" />
          )}
        </button>
      </header>

      {/* Main Two-Half Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto my-auto pt-14 sm:pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* LEFT HALF: Features, Branding, Quote (Desktop only, hidden on mobile for space) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary/10 via-secondary/40 to-chart-2/10 p-5 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-border/60 flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-5 border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>Next-Gen Money Tracking</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug">
                Take Control of Every Rupee with{" "}
                <span className="text-primary font-serif italic">
                  Smart AI.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Join thousands managing their spending, visualizing categories, and making data-backed budget decisions.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3.5 my-7">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 text-sm mt-0.5 shadow-xs">
                    <FaRobot />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">
                      AI Financial Co-Pilot
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Ask natural language questions about your spending patterns.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-chart-2/15 text-chart-2 flex items-center justify-center shrink-0 text-sm mt-0.5 shadow-xs">
                    <FaChartPie />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">
                      Real-Time Distribution
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Dynamic category ratios, monthly budget pacing & insights.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-sm mt-0.5 shadow-xs">
                    <FaShieldAlt />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">
                      Private & Encrypted
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Your numbers stay confidential with authenticated JWT sessions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="p-4 rounded-2xl bg-card/60 border border-border/70 relative mt-4">
              <FaQuoteLeft className="text-primary/20 text-xl absolute top-3 right-3" />
              <p className="text-xs italic text-foreground/90 leading-relaxed">
                "Beware of little expenses; a small leak will sink a great ship."
              </p>
              <div className="text-[11px] font-bold text-primary mt-1.5 font-mono">
                — Benjamin Franklin
              </div>
            </div>
          </div>

          {/* RIGHT HALF: Registration Form with Side-by-Side Fields */}
          <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-center">
            <div className="mb-5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                Create Your Account
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pick your character avatar and start tracking immediately.
              </p>
            </div>

            <form onSubmit={formHandler} className="space-y-4">
              {/* Avatar Selector Row */}
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Choose Avatar ({AVATARS.find((a) => a.id === selectedAvatar)?.name})
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-2 rounded-2xl bg-secondary/30 border border-border/70">
                  {AVATARS.map((av) => {
                    const isSelected = selectedAvatar === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.id)}
                        className={`relative p-1 rounded-xl transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "ring-2 ring-primary scale-110 bg-primary/20 shadow-md shadow-primary/25"
                            : "opacity-60 hover:opacity-100 hover:scale-105"
                        }`}
                        title={av.name}
                      >
                        <UserAvatar id={av.id} className="w-8 h-8 sm:w-10 sm:h-10 mx-auto" />
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[8px] font-bold shadow-xs">
                            <FaCheck />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Side-by-Side: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-3 py-2 bg-secondary/30 border border-border/80 rounded-xl text-foreground placeholder-muted-foreground/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      placeholder="John Doe"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                    <input
                      type="email"
                      className="w-full pl-9 pr-3 py-2 bg-secondary/30 border border-border/80 rounded-xl text-foreground placeholder-muted-foreground/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-9 pr-10 py-2 bg-secondary/30 border border-border/80 rounded-xl text-foreground placeholder-muted-foreground/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={showLoader}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-md shadow-primary/25 hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {showLoader ? "Registering Account..." : "Complete Sign Up"}
              </motion.button>
            </form>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <span className="relative bg-card px-3 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Or sign up with
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-2.5 py-2 px-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border text-foreground font-semibold text-xs sm:text-sm transition-all shadow-xs"
            >
              <FcGoogle className="text-base" />
              <span>Continue with Google</span>
            </motion.button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-bold hover:underline ml-1"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;