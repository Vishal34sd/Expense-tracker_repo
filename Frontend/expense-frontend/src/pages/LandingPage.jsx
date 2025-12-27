import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"

export default function LandingPage() {
  const fullTitle = useMemo(() => "Expense Tracking, Reimagined", []);
  const [typedTitle, setTypedTitle] = useState("");

  useEffect(() => {
    let isMounted = true;
    let index = 0;
    let direction = 1; // 1 = typing, -1 = deleting
    let timeoutId;

    const typeSpeedMs = 95;
    const deleteSpeedMs = 85;
    const endPauseMs = 900;
    const startPauseMs = 300;

    const tick = (delay) => {
      timeoutId = setTimeout(() => {
        if (!isMounted) return;

        index += direction;
        setTypedTitle(fullTitle.slice(0, index));

        if (direction === 1 && index >= fullTitle.length) {
          direction = -1;
          tick(endPauseMs);
          return;
        }

        if (direction === -1 && index <= 0) {
          direction = 1;
          tick(startPauseMs);
          return;
        }

        tick(direction === 1 ? typeSpeedMs : deleteSpeedMs);
      }, delay);
    };

    setTypedTitle("");
    tick(typeSpeedMs);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fullTitle]);

  const features = useMemo(
    () => [
      {
        badge: "TRK",
        title: "Track Expenses",
        description:
          "Easily log and categorize your daily expenses in seconds.",
      },
      {
        badge: "VIZ",
        title: "Visual Insights",
        description:
          "Understand spending patterns with clean and interactive charts.",
      },
      {
        badge: "SEC",
        title: "Secure & Private",
        description:
          "Your financial data stays encrypted, private, and fully yours.",
      },
      {
        badge: "AI",
        title: "AI Assistant Support",
        description:
          "Ask questions about your spending and get smart, contextual help.",
      },
      {
        badge: "FAST",
        title: "Fast Expense Management",
        description:
          "Add, edit, and search transactions quickly with a smooth workflow.",
      },
      {
        badge: "RPT",
        title: "Reports & Export",
        description:
          "Generate summaries and export data when you need to share or review.",
      },
    ],
    []
  );

  return (
      <div
        id="top"
        className="min-h-screen bg-gradient-to-br from-[#0b0617] via-[#120824] to-black text-white overflow-hidden"
      >
      {/* Navbar */}
      <Navbar/>

      {/* Hero Section */}
      <div className="pt-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="text-5xl md:text-6xl font-bold text-purple-300 mb-6 drop-shadow-lg"
            >
              <span className="whitespace-pre-wrap">{typedTitle}</span>
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                className="inline-block align-baseline ml-1 text-purple-200"
              >
                |
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-purple-200/80 max-w-2xl mb-10"
            >
              Track your spending, visualize habits, and make smarter financial
              decisions with a clean, secure, and AI-powered experience.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-16 w-full sm:w-auto"
            >
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 w-full sm:w-auto text-center"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-transparent border border-purple-400 text-purple-300 hover:bg-purple-900/40 font-semibold px-8 py-3 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 w-full sm:w-auto text-center"
              >
                Sign In
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="w-full flex justify-center md:justify-end"
          >
            <img
              src="/landing_logo.png"
              alt="smartExpense preview"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain"
              style={{
                WebkitMaskImage:
                  "radial-gradient(closest-side, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
                maskImage:
                  "radial-gradient(closest-side, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-purple-900/10 backdrop-blur border border-purple-500/20 p-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-300">
              Our Features
            </h2>
            <p className="text-purple-200/70 mt-3">
              Everything you need to track, understand, and improve your spending.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="p-6 rounded-2xl bg-purple-900/20 border border-purple-400/20 hover:border-purple-400/40 shadow-lg hover:shadow-purple-900/40 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-900/30 border border-purple-400/20 flex items-center justify-center text-xs font-bold tracking-wider text-purple-200 mb-4">
                  {feature.badge}
                </div>
                <h3 className="text-xl font-semibold text-purple-300 mb-2">
                  {feature.title}
                </h3>
                <p className="text-purple-200/70 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-purple-900/10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div>
              <div className="text-lg font-bold text-purple-300">smartExpense</div>
              <p className="text-sm text-purple-200/70 mt-2 max-w-sm">
                A practical expense tracker built to help you record spending, see
                trends, and stay consistent.
              </p>
              <div className="text-xs text-purple-200/50 mt-3">
                Built with React and Node.js
              </div>
            </div>

            <div className="text-sm">
              <div className="text-purple-200 font-semibold mb-3">Product</div>
              <div className="flex flex-col gap-2 text-purple-200/70">
                <Link className="hover:text-purple-300 transition" to="/register">
                  Get Started
                </Link>
                <Link className="hover:text-purple-300 transition" to="/login">
                  Sign In
                </Link>
                <a className="hover:text-purple-300 transition" href="#features">
                  Features
                </a>
              </div>
            </div>

            <div className="text-sm">
              <div className="text-purple-200 font-semibold mb-3">Info</div>
              <div className="text-purple-200/70">Version 2.5.1</div>
              <div className="text-purple-200/70 mt-2">© 2025 smartExpense</div>
              <a className="text-purple-200/50 hover:text-purple-300 transition mt-2 inline-block" href="#top">
                Back to top
              </a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-purple-500/10 text-xs text-purple-200/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>Designed for everyday personal finance tracking.</div>
            <div>All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
