import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import {
  FaWallet,
  FaRobot,
  FaMagic,
  FaCloud,
} from "react-icons/fa";
import { MdInsights, MdSecurity } from "react-icons/md";

export default function LandingPage() {
  const fullTitle = useMemo(() => "Expense Tracking, Reimagined", []);
  const [typedTitle, setTypedTitle] = useState("");

  const homeRef = useRef(null);
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);

  const sectionRefs = useMemo(
    () => ({
      home: homeRef,
      "how-it-works": howItWorksRef,
      features: featuresRef,
      about: aboutRef,
    }),
    []
  );

  useEffect(() => {
    let isMounted = true;
    let index = 0;
    let direction = 1;
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
        icon: FaWallet,
        title: "Track Expenses",
        description:
          "Easily log and categorize your daily expenses in seconds.",
      },
      {
        icon: MdInsights,
        title: "Visual Insights",
        description:
          "Understand spending patterns with clean and interactive charts.",
      },
      {
        icon: MdSecurity,
        title: "Secure & Private",
        description:
          "Your financial data stays encrypted, private, and fully yours.",
      },
      {
        icon: FaRobot,
        title: "AI Assistant Support",
        description:
          "Ask questions about your spending and get smart, contextual help.",
      },
      {
        icon: FaMagic,
        title: "Fast Expense Management",
        description:
          "Add, edit, and search transactions quickly with a smooth workflow.",
      },
      {
        icon: FaCloud,
        title: "Reports & Export",
        description:
          "Generate summaries and export data when you need to share or review.",
      },
    ],
    []
  );

  const handleNavigate = (sectionId) => {
    const ref = sectionRefs[sectionId];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      id="top"
      className="min-h-screen bg-gradient-to-br from-[#0b0617] via-[#120824] to-black text-white overflow-x-hidden"
    >
      <Navbar onNavigate={handleNavigate} />

      {/* HERO */}
      <section
        id="home"
        ref={homeRef}
        className="pt-28 sm:pt-32 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
            >
              <span>{typedTitle}</span>
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                className="ml-1"
              >
                |
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base sm:text-lg text-white/90 max-w-xl mb-8 sm:mb-10"
            >
              Track your spending, visualize habits, and make smarter financial
              decisions with a clean, secure, and AI-powered experience.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
            >
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 sm:px-8 rounded-2xl font-semibold shadow-lg transition-transform hover:scale-105 w-full sm:w-auto text-center"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="border border-purple-400 hover:bg-purple-900/40 px-6 py-3 sm:px-8 rounded-2xl font-semibold shadow-lg transition-transform hover:scale-105 w-full sm:w-auto text-center"
              >
                Sign In
              </Link>
            </motion.div>
          </div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="flex justify-center md:justify-end"
          >
            <img
              src="/landing_logo.png"
              alt="Expense Tracker preview"
              className="w-full max-w-[220px] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain"
              style={{
                WebkitMaskImage:
                  "radial-gradient(closest-side, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
                maskImage:
                  "radial-gradient(closest-side, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        ref={howItWorksRef}
        className="max-w-6xl mx-auto px-4 sm:px-6 py-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-purple-900/10 backdrop-blur border border-purple-500/20 p-6 sm:p-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold">
              How it Works
            </h2>
            <p className="text-white/70 mt-3 text-sm sm:text-base max-w-2xl mx-auto">
              Get up and running in minutes. No spreadsheets, no hassle —
              just a simple flow that keeps your money under control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {["Create your account", "Add your expenses", "See smart insights"].map(
              (step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex flex-col gap-3 p-5 sm:p-6 rounded-2xl bg-gray-950 border border-purple-400/30 hover:border-white shadow-lg hover:shadow-purple-900/40 transition"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-600/70 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold">{step}</h3>
                  <p className="text-sm text-white/70">
                    {index === 0 &&
                      "Sign up in a few clicks, set your currency and basic preferences, and you are ready to go."}
                    {index === 1 &&
                      "Log daily expenses in seconds from any device, and categorize them the way you think about money."}
                    {index === 2 &&
                      "Get automatic summaries, trends and AI-powered suggestions to help you spend more intentionally."}
                  </p>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        ref={featuresRef}
        className="max-w-6xl mx-auto px-4 sm:px-6 py-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-purple-900/10 backdrop-blur border border-purple-500/20 p-6 sm:p-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Our Features
            </h2>
            <p className="text-white/70 mt-3 text-sm sm:text-base">
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
                transition={{ delay: idx * 0.08 }}
                className="p-5 sm:p-6 rounded-2xl bg-gray-950 border border-purple-400/20 hover:border-white shadow-lg hover:shadow-purple-900/40 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-900/30 border border-purple-400/20 flex items-center justify-center mb-4">
                  <feature.icon className="text-xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ABOUT US */}
      <section
        id="about"
        ref={aboutRef}
        className="max-w-6xl mx-auto px-4 sm:px-6 pb-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center rounded-3xl bg-purple-900/10 border border-purple-500/30 p-6 sm:p-8"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              About smartExpense
            </h2>
            <p className="text-white/80 text-sm sm:text-base mb-4">
              smartExpense was built by people who were tired of messy
              spreadsheets and confusing budgeting apps. Our goal is to make
              everyday money decisions simple, visual, and actually enjoyable.
            </p>
            <p className="text-white/70 text-sm sm:text-base">
              We focus on clarity, speed, and privacy — giving you the tools
              you need to understand where your money goes without selling or
              sharing your financial data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gray-950 border border-purple-400/30 p-4">
              <p className="text-sm font-semibold mb-1">Built for real life</p>
              <p className="text-xs text-white/70">
                Works for students, freelancers, families, and anyone who
                wants to keep their spending under control.
              </p>
            </div>
            <div className="rounded-2xl bg-gray-950 border border-purple-400/30 p-4">
              <p className="text-sm font-semibold mb-1">Human + AI</p>
              <p className="text-xs text-white/70">
                Combine your intuition with helpful AI suggestions to make
                smarter, faster financial choices.
              </p>
            </div>
            <div className="rounded-2xl bg-gray-950 border border-purple-400/30 p-4">
              <p className="text-sm font-semibold mb-1">Secure by design</p>
              <p className="text-xs text-white/70">
                Modern encryption and best practices keep your data safe and
                private.
              </p>
            </div>
            <div className="rounded-2xl bg-gray-950 border border-purple-400/30 p-4">
              <p className="text-sm font-semibold mb-1">Always improving</p>
              <p className="text-xs text-white/70">
                We ship updates regularly based on real user feedback and
                everyday use cases.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-500/20 bg-purple-900/10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <div className="text-lg font-bold">Expense Tracker</div>
              <p className="text-sm text-white/70 mt-2">
                A practical expense tracker built for everyday finance.
              </p>
              <div className="text-xs text-white/50 mt-3">
                Built with React & Node.js
              </div>
            </div>

            <div className="text-sm">
              <div className="font-semibold mb-3">Product</div>
              <div className="flex flex-col gap-2 text-white/70">
                <Link to="/register" className="hover:text-white py-1">
                  Get Started
                </Link>
                <Link to="/login" className="hover:text-white py-1">
                  Sign In
                </Link>
                <a href="#features" className="hover:text-white py-1">
                  Features
                </a>
              </div>
            </div>

            <div className="text-sm">
              <div className="font-semibold mb-3">Info</div>
              <div className="text-white/70">Version 2.5.1</div>
              <div className="text-white/70 mt-2">© 2025 Expense Tracker</div>
              <a
                href="#top"
                className="text-white/50 hover:text-white mt-2 inline-block"
              >
                Back to top
              </a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-purple-500/10 text-xs text-white/50 flex flex-col sm:flex-row justify-between gap-2">
            <span>Designed for personal finance tracking.</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
