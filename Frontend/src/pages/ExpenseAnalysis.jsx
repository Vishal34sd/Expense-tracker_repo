import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaChartBar,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
  FaWallet,
  FaReceipt,
  FaFire,
  FaTags,
  FaSyncAlt,
  FaInfoCircle,
  FaArrowLeft,
  FaPlusCircle,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";
import SideBar from "../components/SideBar";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Color helper for category dots & badge styles
const getCategoryColor = (category = "") => {
  const cat = category.toLowerCase();
  if (cat.includes("food") || cat.includes("dining")) {
    return {
      dot: "bg-amber-500",
      badge: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    };
  }
  if (cat.includes("transport") || cat.includes("travel")) {
    return {
      dot: "bg-blue-500",
      badge: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    };
  }
  if (cat.includes("rent") || cat.includes("util") || cat.includes("bill")) {
    return {
      dot: "bg-purple-500",
      badge: "bg-purple-500/10 text-purple-500 border-purple-500/30",
    };
  }
  if (cat.includes("shop") || cat.includes("cloth")) {
    return {
      dot: "bg-pink-500",
      badge: "bg-pink-500/10 text-pink-500 border-pink-500/30",
    };
  }
  if (cat.includes("entertain") || cat.includes("movie") || cat.includes("game")) {
    return {
      dot: "bg-indigo-500",
      badge: "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
    };
  }
  if (cat.includes("health") || cat.includes("med")) {
    return {
      dot: "bg-emerald-500",
      badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    };
  }
  if (cat.includes("grocer")) {
    return {
      dot: "bg-lime-500",
      badge: "bg-lime-500/10 text-lime-500 border-lime-500/30",
    };
  }
  if (cat.includes("invest") || cat.includes("sav")) {
    return {
      dot: "bg-cyan-500",
      badge: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
    };
  }
  return {
    dot: "bg-sky-400",
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  };
};

const toDateKey = (dateObj) => {
  const d = new Date(dateObj);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ExpenseAnalysis = () => {
  const { isDark } = useTheme();
  const chartRef = useRef(null);

  const [timeframe, setTimeframe] = useState("daily"); // "daily" | "weekly" | "monthly"
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/get`,
        { withCredentials: true }
      );
      if (res.data?.data) {
        setAllTransactions(res.data.data);
      }
    } catch {
      // Ignore network errors or unauthenticated state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    const handleUpdate = () => {
      fetchTransactions();
    };

    window.addEventListener("transactionUpdated", handleUpdate);
    window.addEventListener("expenseUpdated", handleUpdate);
    window.addEventListener("userInfoUpdated", handleUpdate);

    return () => {
      window.removeEventListener("transactionUpdated", handleUpdate);
      window.removeEventListener("expenseUpdated", handleUpdate);
      window.removeEventListener("userInfoUpdated", handleUpdate);
    };
  }, []);

  // Filter only expenses
  const expenseTransactions = useMemo(() => {
    return allTransactions.filter((t) => t.type === "expense");
  }, [allTransactions]);

  // Compute Daily Data (7 Days)
  const dailyData = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let anchor = new Date(today);
    if (expenseTransactions.length > 0) {
      const timestamps = expenseTransactions.map((t) =>
        new Date(t.date || t.createdAt || Date.now()).getTime()
      );
      const latestTs = Math.max(...timestamps);
      const latestDate = new Date(latestTs);
      latestDate.setHours(0, 0, 0, 0);

      const diffDays = Math.round((today - latestDate) / (1000 * 60 * 60 * 24));
      if (diffDays > 7) {
        anchor = new Date(latestDate);
      }
    }

    for (let i = 6; i >= 0; i--) {
      const d = new Date(anchor);
      d.setDate(anchor.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const key = toDateKey(d);

      const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });
      const dayNum = d.getDate();
      const monthShort = d.toLocaleDateString("en-IN", { month: "short" });
      const fullDate = d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const dayExpenses = expenseTransactions.filter((txn) => {
        const txnDate = new Date(txn.date || txn.createdAt || Date.now());
        return toDateKey(txnDate) === key;
      });

      const total = dayExpenses.reduce(
        (sum, t) => sum + Number(t.amount || 0),
        0
      );

      days.push({
        key,
        shortLabel: `${dayName} ${dayNum}`,
        pillLabel: `${dayName}`,
        subLabel: `${dayNum} ${monthShort}`,
        fullLabel: fullDate,
        total,
        expenses: dayExpenses.map((t) => ({
          _id: t._id || Math.random(),
          category: t.category || "General",
          amount: Number(t.amount || 0),
        })),
      });
    }

    return days;
  }, [expenseTransactions]);

  // Compute Weekly Data (Last 5 weeks)
  const weeklyData = useMemo(() => {
    const weeks = [];
    const today = new Date();

    for (let i = 4; i >= 0; i--) {
      const end = new Date(today);
      end.setDate(today.getDate() - i * 7);
      end.setHours(23, 59, 59, 999);

      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);

      const startLabel = start.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
      const endLabel = end.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });

      const weekExpenses = expenseTransactions.filter((txn) => {
        const d = new Date(txn.date || txn.createdAt || Date.now());
        return d >= start && d <= end;
      });

      const total = weekExpenses.reduce(
        (sum, t) => sum + Number(t.amount || 0),
        0
      );

      weeks.push({
        key: `week-${i}`,
        shortLabel: i === 0 ? "This Week" : `Week -${i}`,
        pillLabel: i === 0 ? "Current" : `Wk -${i}`,
        subLabel: `${startLabel}`,
        fullLabel: `${startLabel} – ${endLabel}`,
        total,
        expenses: weekExpenses.map((t) => ({
          _id: t._id || Math.random(),
          category: t.category || "General",
          amount: Number(t.amount || 0),
        })),
      });
    }

    return weeks;
  }, [expenseTransactions]);

  // Compute Monthly Data (Last 6 months)
  const monthlyData = useMemo(() => {
    const months = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const monthName = d.toLocaleDateString("en-IN", { month: "short" });
      const fullMonth = d.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });

      const monthExpenses = expenseTransactions.filter((txn) => {
        const td = new Date(txn.date || txn.createdAt || Date.now());
        return td.getFullYear() === year && td.getMonth() === month;
      });

      const total = monthExpenses.reduce(
        (sum, t) => sum + Number(t.amount || 0),
        0
      );

      months.push({
        key: `${year}-${month}`,
        shortLabel: monthName,
        pillLabel: monthName,
        subLabel: `${year}`,
        fullLabel: fullMonth,
        total,
        expenses: monthExpenses.map((t) => ({
          _id: t._id || Math.random(),
          category: t.category || "General",
          amount: Number(t.amount || 0),
        })),
      });
    }

    return months;
  }, [expenseTransactions]);

  // Active dataset
  const activeDataset = useMemo(() => {
    if (timeframe === "weekly") return weeklyData;
    if (timeframe === "monthly") return monthlyData;
    return dailyData;
  }, [timeframe, dailyData, weeklyData, monthlyData]);

  // Default selected bar
  useEffect(() => {
    if (activeDataset.length > 0) {
      setSelectedIdx(activeDataset.length - 1);
    }
  }, [timeframe, activeDataset.length]);

  const selectedItem =
    selectedIdx !== null && activeDataset[selectedIdx]
      ? activeDataset[selectedIdx]
      : activeDataset[activeDataset.length - 1] || null;

  // Overview KPIs for the current dataset
  const totalPeriodSpend = useMemo(() => {
    return activeDataset.reduce((sum, item) => sum + item.total, 0);
  }, [activeDataset]);

  const averageSpend = useMemo(() => {
    if (activeDataset.length === 0) return 0;
    return Math.round(totalPeriodSpend / activeDataset.length);
  }, [activeDataset, totalPeriodSpend]);

  const peakItem = useMemo(() => {
    if (activeDataset.length === 0) return null;
    return [...activeDataset].sort((a, b) => b.total - a.total)[0];
  }, [activeDataset]);

  // Chart configuration
  const chartData = useMemo(() => {
    const labels = activeDataset.map((d) => d.shortLabel);
    const amounts = activeDataset.map((d) => d.total);

    const backgroundColors = activeDataset.map((_, i) => {
      const isSelected = i === selectedIdx;
      if (isSelected) {
        return isDark ? "rgb(92, 179, 255)" : "rgb(0, 90, 233)";
      }
      return isDark
        ? "rgba(92, 179, 255, 0.35)"
        : "rgba(0, 90, 233, 0.3)";
    });

    const borderColors = activeDataset.map((_, i) => {
      const isSelected = i === selectedIdx;
      if (isSelected) {
        return isDark ? "rgb(255, 255, 255)" : "rgb(11, 65, 150)";
      }
      return isDark
        ? "rgba(92, 179, 255, 0.6)"
        : "rgba(0, 90, 233, 0.5)";
    });

    const borderWidths = activeDataset.map((_, i) => (i === selectedIdx ? 2 : 1));

    return {
      labels,
      datasets: [
        {
          label: "Expense Amount",
          data: amounts,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: borderWidths,
          borderRadius: 8,
          borderSkipped: false,
          minBarLength: 5,
          hoverBackgroundColor: isDark
            ? "rgb(140, 205, 255)"
            : "rgb(25, 120, 255)",
        },
      ],
    };
  }, [activeDataset, selectedIdx, isDark]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 400,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDark ? "rgb(10, 20, 36)" : "rgb(252, 250, 246)",
          titleColor: isDark ? "rgb(231, 239, 252)" : "rgb(28, 34, 43)",
          bodyColor: isDark ? "rgb(92, 179, 255)" : "rgb(0, 90, 233)",
          borderColor: isDark ? "rgb(45, 71, 114)" : "rgb(187, 207, 239)",
          borderWidth: 1.5,
          padding: 12,
          cornerRadius: 12,
          callbacks: {
            title: (items) => {
              if (!items.length) return "";
              const idx = items[0].dataIndex;
              return activeDataset[idx]?.fullLabel || items[0].label;
            },
            label: (context) => {
              return ` Total Expense: ₹${Number(context.raw || 0).toLocaleString("en-IN")}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: isDark ? "rgb(156, 175, 206)" : "rgb(78, 114, 172)",
            font: {
              family: "Manrope",
              size: 11,
              weight: "600",
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: isDark
              ? "rgba(51, 84, 140, 0.22)"
              : "rgba(187, 207, 239, 0.35)",
            strokeDash: [4, 4],
          },
          ticks: {
            color: isDark ? "rgb(156, 175, 206)" : "rgb(78, 114, 172)",
            font: {
              family: "Manrope",
              size: 10,
            },
            callback: (val) => {
              if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
              return `₹${val}`;
            },
          },
        },
      },
      onClick: (event, elements) => {
        if (elements && elements.length > 0) {
          const clickedIndex = elements[0].index;
          setSelectedIdx(clickedIndex);
        }
      },
    };
  }, [isDark, activeDataset]);

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      <SideBar />

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              <span>Financial Analytics</span>
              <span>•</span>
              <span className="text-muted-foreground capitalize">{timeframe} Breakdown</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-xs">
                <FaChartBar className="text-base" />
              </div>
              <span>Daily Expense Analysis</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Interactive bar charts showing daily spending. Click any bar to inspect that day's category & amount.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={fetchTransactions}
              type="button"
              className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-secondary/60 hover:bg-secondary text-secondary-foreground text-xs font-semibold border border-border transition-all cursor-pointer shadow-2xs"
            >
              <FaSyncAlt className={isLoading ? "animate-spin text-primary" : ""} />
              <span>Refresh</span>
            </button>
            <Link
              to="/add"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/25 hover:brightness-110 transition-all cursor-pointer"
            >
              <FaPlusCircle />
              <span>Add Expense</span>
            </Link>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {/* Card 1: Total Period Spent */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs"
          >
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Spent</span>
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FaWallet className="text-xs" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground font-mono">
              ₹{totalPeriodSpend.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 capitalize">
              In this {timeframe} window
            </div>
          </motion.div>

          {/* Card 2: Average Daily */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs"
          >
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Average</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <FaReceipt className="text-xs" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground font-mono">
              ₹{averageSpend.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Per {timeframe === "daily" ? "day" : timeframe === "weekly" ? "week" : "month"}
            </div>
          </motion.div>

          {/* Card 3: Peak Spending */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs"
          >
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Peak Spend</span>
              <div className="w-7 h-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                <FaFire className="text-xs" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-destructive font-mono">
              ₹{Number(peakItem?.total || 0).toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 truncate">
              {peakItem?.shortLabel || "No spikes"}
            </div>
          </motion.div>

          {/* Card 4: Selected Period */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs"
          >
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Selected Day</span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <FaCalendarDay className="text-xs" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-primary font-mono">
              ₹{Number(selectedItem?.total || 0).toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 truncate">
              {selectedItem?.expenses?.length || 0} logged expense{selectedItem?.expenses?.length === 1 ? "" : "s"}
            </div>
          </motion.div>
        </div>

        {/* Main Chart Card */}
        <div className="p-4 sm:p-6 rounded-3xl bg-card border border-border/80 shadow-xs mb-6">
          {/* Controls Bar: Title & Timeframe Switcher */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 mb-4 border-b border-border/60">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                <span>Interactive Expense Bar Chart</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Click on any bar to see that specific day's expenses below
              </p>
            </div>

            {/* Timeframe Switcher */}
            <div className="flex items-center bg-secondary/50 p-1 rounded-2xl border border-border">
              {[
                { id: "daily", label: "Daily", icon: FaCalendarDay },
                { id: "weekly", label: "Weekly", icon: FaCalendarWeek },
                { id: "monthly", label: "Monthly", icon: FaCalendarAlt },
              ].map((tab) => {
                const isActive = timeframe === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTimeframe(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="text-xs" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Canvas Bar Chart */}
          <div className="h-64 sm:h-80 w-full mb-4">
            <Bar ref={chartRef} data={chartData} options={chartOptions} />
          </div>

          {/* Interactive Day/Period Pill Selector */}
          <div className="pt-3 border-t border-border/60">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FaFilter className="text-[10px]" />
              <span>Tap a period to inspect:</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
              {activeDataset.map((item, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <button
                    key={item.key || idx}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-md scale-102"
                        : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary hover:text-foreground hover:border-primary/40"
                    }`}
                  >
                    <div className="text-xs font-bold truncate">
                      {item.shortLabel}
                    </div>
                    <div
                      className={`text-[11px] font-mono mt-0.5 ${
                        isSelected ? "text-primary-foreground/90 font-bold" : "text-foreground"
                      }`}
                    >
                      ₹{item.total.toLocaleString("en-IN")}
                    </div>
                    <div
                      className={`text-[9px] mt-0.5 truncate ${
                        isSelected ? "text-primary-foreground/75" : "text-muted-foreground"
                      }`}
                    >
                      {item.expenses.length} expense{item.expenses.length === 1 ? "" : "s"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Day's Expense Breakdown: Category and Amount Only */}
        <motion.div
          key={selectedItem?.key || "selected"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-5 sm:p-6 rounded-3xl bg-card border border-border/80 shadow-xs mb-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 mb-4 border-b border-border/60">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                <span>Selected Date Breakdown</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
                {selectedItem?.fullLabel || "Selected Day"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Showing individual expenses (Category & Amount) logged for this period
              </p>
            </div>

            <div className="text-left sm:text-right bg-secondary/40 sm:bg-transparent p-3 sm:p-0 rounded-2xl w-full sm:w-auto border sm:border-0 border-border">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total for this day
              </div>
              <div className="text-2xl font-extrabold text-primary font-mono">
                ₹{Number(selectedItem?.total || 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* List of expenses: Category and Amount ONLY */}
          {selectedItem && selectedItem.expenses && selectedItem.expenses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {selectedItem.expenses.map((expense, idx) => {
                const colors = getCategoryColor(expense.category);
                return (
                  <motion.div
                    key={expense._id || idx}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 hover:bg-secondary/60 border border-border/70 transition-all shadow-2xs group"
                  >
                    {/* Category */}
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-xs ${colors.dot}`} />
                      <div className="min-w-0">
                        <span className="font-bold text-foreground capitalize text-sm truncate block group-hover:text-primary transition-colors">
                          {expense.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono">
                          Category
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-destructive text-base font-mono block">
                        ₹{Number(expense.amount || 0).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono">
                        Amount
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center px-4 rounded-2xl bg-secondary/20 border border-border/40">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <FaInfoCircle className="text-lg" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                No Expenses Logged
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
                You didn't log any expenses for {selectedItem?.fullLabel || "this date"}. Tap any other day on the chart above to inspect.
              </p>
              <Link
                to="/add"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:brightness-110 transition-all"
              >
                <FaPlusCircle />
                <span>Log an Expense</span>
              </Link>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ExpenseAnalysis;
