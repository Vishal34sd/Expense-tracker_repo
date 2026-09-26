import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FaWallet,
  FaRobot,
  FaMagic,
  FaCloud,
  FaArrowRight,
  FaShieldAlt,
  FaChartLine,
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

    const typeSpeedMs = 85;
    const deleteSpeedMs = 60;
    const endPauseMs = 1200;
    const startPauseMs = 350;

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
        title: "Track Expenses & Income",
        description: "Log every transaction in seconds with intuitive categories, notes, and auto-timestamps.",
        color: "text-chart-1",
        bg: "bg-chart-1/10",
      },
      {
        icon: MdInsights,
        title: "Visual Financial Insights",
        description: "Understand patterns with sleek interactive charts, category ratios, and budget limits.",
        color: "text-chart-2",
        bg: "bg-chart-2/10",
      },
      {
        icon: MdSecurity,
        title: "Secure & Encrypted",
        description: "Your financial records stay secure with modern encryption, token auth, and private sessions.",
        color: "text-chart-4",
        bg: "bg-chart-4/10",
      },
      {
        icon: FaRobot,
        title: "AI Financial Co-Pilot",
        description: "Ask smart queries like 'How much did I spend on groceries this month?' and get instant answers.",
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        icon: FaMagic,
        title: "Seamless Management",
        description: "Inline editing, rapid deletions, and immediate balance re-calculations without friction.",
        color: "text-chart-5",
        bg: "bg-chart-5/10",
      },
      {
        icon: FaCloud,
        title: "Excel & PDF Export",
        description: "Download detailed monthly Excel reports with formatted columns ready for review anytime.",
        color: "text-chart-2",
        bg: "bg-chart-2/10",
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
      className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-300"
    >
      {/* Dynamic ambient mesh background */}
      <div className="ambient-glow-mesh">
        <div className="blob-1" />
        <div className="blob-2" />
        <div className="blob-3" />
      </div>

      <Navbar onNavigate={handleNavigate} />

      {/* HERO SECTION */}
      <section
        id="home"
        ref={homeRef}
        className="relative z-10 pt-36 sm:pt-44 md:pt-48 pb-20 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider mb-6 border border-border/80 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Smart Finance 2.0 • AI Powered
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
            >
              <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                {typedTitle}
              </span>
              <motion.span
                aria-hidden="true"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-primary font-mono ml-1"
              >
                _
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-9 font-normal leading-relaxed"
            >
              Master your cashflow with automated categorizations, smart balance
              trackers, AI recommendations, and actionable visual reports.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Start Free Now</span>
                <FaArrowRight className="text-xs" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold text-base bg-card hover:bg-secondary text-foreground border border-border hover:border-primary/50 shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Existing User Sign In
              </Link>
            </motion.div>

            {/* Micro proof badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="mt-8 sm:mt-10 flex flex-wrap justify-center md:justify-start items-center gap-3 sm:gap-6 text-xs text-muted-foreground"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <FaShieldAlt className="text-primary text-sm shrink-0" />
                <span>Zero telemetry tracking</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <FaChartLine className="text-emerald-500 text-sm shrink-0" />
                <span>Real-time budget analysis</span>
              </div>
            </motion.div>
          </div>

          {/* Right Hero Visual / Interactive Card Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="flex justify-center md:justify-end relative"
          >
            {/* Decorative background glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-chart-2/20 to-transparent rounded-3xl blur-2xl opacity-60" />

            {/* Glass Container Card */}
            <div className="relative w-full max-w-md bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-2xl">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    ₹
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">Monthly Cashflow</div>
                    <div className="text-xs text-muted-foreground">Updated in real-time</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-semibold border border-emerald-500/20">
                  +18.4%
                </span>
              </div>

              {/* Stat Row */}
              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border/60">
                  <div className="text-xs text-muted-foreground mb-1">Total Savings</div>
                  <div className="text-xl font-extrabold text-foreground">₹ 42,500</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-accent/40 border border-border/60">
                  <div className="text-xs text-muted-foreground mb-1">AI Smart Tips</div>
                  <div className="text-xs font-semibold text-primary">Budget on track!</div>
                </div>
              </div>

              {/* Visual preview list */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-background/80 border border-border/50 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      ↑
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">Salary Deposit</div>
                      <div className="text-[10px] text-muted-foreground">Income • Oct 01</div>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+₹ 65,000</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-background/80 border border-border/50 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-destructive/15 text-destructive flex items-center justify-center font-bold">
                      ↓
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">Groceries & Supplies</div>
                      <div className="text-[10px] text-muted-foreground">Expense • Oct 03</div>
                    </div>
                  </div>
                  <span className="font-bold text-destructive">-₹ 4,320</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-background/80 border border-border/50 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-chart-2/15 text-chart-2 flex items-center justify-center font-bold">
                      ✦
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">AI Insight Prompt</div>
                      <div className="text-[10px] text-muted-foreground">Automated Analysis</div>
                    </div>
                  </div>
                  <span className="font-mono text-primary text-[11px]">Ready</span>
                </div>
              </div>

              {/* Floating interactive badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-primary to-chart-4 text-primary-foreground text-xs flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <FaRobot className="text-base" />
                  <span className="font-semibold">AI Assistant ready to query your trends</span>
                </div>
                <FaArrowRight className="text-xs" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        ref={howItWorksRef}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-card/75 backdrop-blur-xl border border-border/80 p-8 sm:p-12 shadow-xl"
        >
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              How SmartExpense Works
            </h2>
            <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-2xl mx-auto">
              Get up and running in under two minutes. No complex setup, no spreadsheet formulas — just clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create your account",
                desc: "Sign up with email or fast credentials. Your profile is automatically initialized with zero delay.",
              },
              {
                step: "2",
                title: "Log transactions",
                desc: "Add your expenses, income, notes, and custom categories seamlessly on any screen or device.",
              },
              {
                step: "3",
                title: "Unlock AI insights",
                desc: "View category distributions, average spendings, budget alerts, and chat with the AI co-pilot.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                whileHover={{ y: -4 }}
                className="flex flex-col gap-4 p-6 rounded-2xl bg-secondary/30 border border-border/60 hover:border-primary/40 hover:bg-secondary/60 shadow-md transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-extrabold text-lg shadow-md shadow-primary/25">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        ref={featuresRef}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-card/75 backdrop-blur-xl border border-border/80 p-8 sm:p-12 shadow-xl"
        >
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Designed For Financial Freedom
            </h2>
            <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-2xl mx-auto">
              Clean visual components that give you a complete picture of your money.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl bg-secondary/25 border border-border/60 hover:border-primary/50 hover:bg-secondary/50 shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200`}>
                      <Icon className={`text-xl ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ABOUT US */}
      <section
        id="about"
        ref={aboutRef}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center rounded-3xl bg-card/75 backdrop-blur-xl border border-border/80 p-8 sm:p-12 shadow-xl"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
              Our Vision
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4 tracking-tight">
              About SmartExpense
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-4 leading-relaxed">
              SmartExpense was created to liberate people from rigid spreadsheets and confusing budgeting software.
              Our goal is to make everyday financial choices transparent, visual, and rewarding.
            </p>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              We focus on speed, privacy, and actionable intelligence — giving you high-end tools to track
              where every rupee goes with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-secondary/40 border border-border/70 p-4 shadow-sm">
              <p className="text-sm font-bold text-foreground mb-1">Built For Everyday Life</p>
              <p className="text-xs text-muted-foreground">
                Tailored for students, freelancers, and professionals managing daily expenses.
              </p>
            </div>
            <div className="rounded-2xl bg-secondary/40 border border-border/70 p-4 shadow-sm">
              <p className="text-sm font-bold text-foreground mb-1">Human Intuition + AI</p>
              <p className="text-xs text-muted-foreground">
                Combine your personal budget goals with helpful AI co-pilot insights.
              </p>
            </div>
            <div className="rounded-2xl bg-secondary/40 border border-border/70 p-4 shadow-sm">
              <p className="text-sm font-bold text-foreground mb-1">Strict Privacy Standard</p>
              <p className="text-xs text-muted-foreground">
                Protected sessions and authenticated routes ensure your numbers are yours alone.
              </p>
            </div>
            <div className="rounded-2xl bg-secondary/40 border border-border/70 p-4 shadow-sm">
              <p className="text-sm font-bold text-foreground mb-1">Continuous Evolution</p>
              <p className="text-xs text-muted-foreground">
                Frequent updates with modern design paradigms, charts, and report exports.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-border bg-card/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  <FaWallet />
                </div>
                <span className="font-extrabold text-lg text-foreground">
                  Smart<span className="text-primary font-serif italic ml-0.5">Expense</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                A modern, intuitive personal expense manager built with React, Tailwind v4, and AI assistance.
              </p>
              <div className="text-xs text-muted-foreground mt-3 font-mono">
                Version 2.5 Personal Edition
              </div>
            </div>

            <div className="text-sm">
              <div className="font-bold text-foreground mb-3">Quick Navigation</div>
              <div className="flex flex-col gap-2 text-muted-foreground">
                <Link to="/register" className="hover:text-primary transition-colors">
                  Create Account
                </Link>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Sign In
                </Link>
                <a href="#features" className="hover:text-primary transition-colors">
                  Features Overview
                </a>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </a>
              </div>
            </div>

            <div className="text-sm">
              <div className="font-bold text-foreground mb-3">Product Information</div>
              <div className="text-muted-foreground">Designed for effortless finance management.</div>
              <div className="text-muted-foreground mt-2">© {new Date().getFullYear()} SmartExpense. All rights reserved.</div>
              <a
                href="#top"
                className="text-primary hover:underline text-xs mt-3 inline-block font-semibold"
              >
                ↑ Back to top
              </a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border/60 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
            <span>Built with precision for seamless tracking and AI insights.</span>
            <span>All personal financial data protected.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
