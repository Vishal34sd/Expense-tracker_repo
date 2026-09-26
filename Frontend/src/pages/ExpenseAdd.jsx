import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import axios from "axios";
import confetti from "canvas-confetti";
import { FaArrowLeft, FaPlusCircle, FaWallet } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const QUICK_CATEGORIES = {
  expense: ["Food & Dining", "Transport", "Rent & Utilities", "Shopping", "Entertainment", "Health"],
  income: ["Salary", "Freelance", "Investment", "Bonus", "Gift", "Other Income"],
};

const AddExpense = () => {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isDark } = useTheme();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryQuickSelect = (cat) => {
    setForm((prev) => ({ ...prev, category: cat }));
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      enqueueSnackbar("Please enter a valid amount greater than 0.", { variant: "warning" });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/add`,
        form,
        { withCredentials: true }
      );

      // Celebrate with confetti animation!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: isDark ? ["#5cb3ff", "#5197c6", "#bbe2ef"] : ["#005ae9", "#60a7d6", "#0b4196"],
      });

      enqueueSnackbar("Entry added successfully.", { variant: "success" });
      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not add entry. Please try again.";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="ambient-glow-mesh">
        <div className="blob-1" />
        <div className="blob-2" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-10 w-full max-w-lg shadow-2xl"
      >
        {/* Header with back link */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-secondary"
          >
            <FaArrowLeft />
            <span>Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <FaWallet />
            <span>SmartLedger</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Add Transaction
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Log an outgoing expense or incoming revenue
          </p>
        </div>

        <form className="space-y-5" onSubmit={formSubmitHandler}>
          {/* Segmented Type Switcher */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-secondary/60 border border-border/70">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "expense" })}
                className={`py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  form.type === "expense"
                    ? "bg-destructive text-destructive-foreground shadow-md shadow-destructive/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Expense (Outflow)
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "income" })}
                className={`py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  form.type === "income"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Income (Inflow)
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">
                ₹
              </span>
              <input
                name="amount"
                type="number"
                step="any"
                value={form.amount}
                onChange={inputHandler}
                className="w-full pl-10 pr-4 py-3 bg-secondary/30 border border-border/80 rounded-2xl text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg font-bold transition"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Category Input */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={inputHandler}
              className="w-full px-4 py-2.5 bg-secondary/30 border border-border/80 rounded-2xl text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition"
              placeholder="e.g. Food, Travel, Rent"
              required
            />

            {/* Quick Category Chips */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {QUICK_CATEGORIES[form.type]?.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryQuickSelect(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    form.category === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/40 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Note (Optional)
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={inputHandler}
              className="w-full px-4 py-2.5 bg-secondary/30 border border-border/80 rounded-2xl text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition"
              placeholder="Add details (e.g. dinner with friends, client retainer)..."
              rows="3"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-200 disabled:opacity-50 text-sm mt-4 cursor-pointer"
          >
            <FaPlusCircle />
            <span>{isSubmitting ? "Recording..." : "Record Transaction"}</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddExpense;
