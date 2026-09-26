import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SideBar from "../components/SideBar";
import {
  FaRocket,
  FaChartPie,
  FaTools,
  FaArrowRight,
  FaWallet,
  FaShieldAlt,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      <SideBar />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto overflow-y-auto">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto pt-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider mb-4 border border-border/70"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>Master Your Capital</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight"
          >
            Take Control of Your Spending
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            A high-precision personal finance suite helping you track every rupee,
            analyze categorized habits, and reach your savings milestones effortlessly.
          </motion.p>

          <div className="mt-8 flex justify-center gap-3">
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition"
              >
                <span>Go to Dashboard</span>
                <FaArrowRight className="text-xs" />
              </motion.button>
            </Link>

            <Link to="/add">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-secondary-foreground hover:bg-accent font-semibold text-sm border border-border transition"
              >
                <FaWallet className="text-xs text-primary" />
                <span>Quick Log</span>
              </motion.button>
            </Link>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl mb-4">
              <FaRocket />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Instant Overview</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your real-time net balance, monthly expenditures, and inflow updates the second you add a transaction.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-chart-2/15 text-chart-2 flex items-center justify-center text-xl mb-4">
              <FaChartPie />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Smart Visuals</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dynamic Chart.js pie graphs and category breakdowns that clearly expose where money flows.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-chart-4/15 text-chart-4 flex items-center justify-center text-xl mb-4">
              <FaTools />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Easy Management</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Edit entries inline, search logs by category or notes, and export professional spreadsheets in one click.
            </p>
          </motion.div>
        </section>

        {/* User Impact Section */}
        <section className="bg-card border border-border/80 rounded-3xl p-8 sm:p-12 shadow-md mb-12 text-center max-w-4xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-primary text-xl mb-3">
            <FaShieldAlt />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
            Why People Trust SmartExpense
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Whether you’re managing personal subscriptions, side-gig revenue, or household budgets —
            having zero clutter and instant clarity makes financial discipline second nature.
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground py-6 border-t border-border/60">
          © {new Date().getFullYear()} SmartExpense — Built for clarity, speed, and intelligence.
        </footer>
      </main>
    </div>
  );
};

export default Home;
