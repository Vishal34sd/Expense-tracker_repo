import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
  FaChevronDown,
  FaChevronUp,
  FaSyncAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Color helper for category dots
const getCategoryDotClass = (category = "") => {
  const cat = category.toLowerCase();
  if (cat.includes("food") || cat.includes("dining")) return "bg-amber-500 shadow-amber-500/50";
  if (cat.includes("transport") || cat.includes("travel")) return "bg-blue-500 shadow-blue-500/50";
  if (cat.includes("rent") || cat.includes("util") || cat.includes("bill")) return "bg-purple-500 shadow-purple-500/50";
  if (cat.includes("shop") || cat.includes("cloth")) return "bg-pink-500 shadow-pink-500/50";
  if (cat.includes("entertain") || cat.includes("movie") || cat.includes("game")) return "bg-indigo-500 shadow-indigo-500/50";
  if (cat.includes("health") || cat.includes("med")) return "bg-emerald-500 shadow-emerald-500/50";
  if (cat.includes("grocer")) return "bg-lime-500 shadow-lime-500/50";
  if (cat.includes("invest") || cat.includes("sav")) return "bg-cyan-500 shadow-cyan-500/50";
  return "bg-sky-400 shadow-sky-400/50";
};

const toDateKey = (dateObj) => {
  const d = new Date(dateObj);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SidebarExpenseAnalysis = ({ className = "", onDaySelect }) => {
  const { isDark } = useTheme();
  const chartRef = useRef(null);

  const [timeframe, setTimeframe] = useState("daily"); // "daily" | "weekly" | "monthly"
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch transactions or listen for updates
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

  // Compute Daily Data (Last 7 days)
  const dailyData = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If transactions exist, find latest expense date
    let anchor = new Date(today);
    if (expenseTransactions.length > 0) {
      const timestamps = expenseTransactions.map((t) =>
        new Date(t.date || t.createdAt || Date.now()).getTime()
      );
      const latestTs = Math.max(...timestamps);
      const latestDate = new Date(latestTs);
      latestDate.setHours(0, 0, 0, 0);

      // If the latest expense was within the last 7 days of today, anchor at today.
      // Otherwise, if the data is historical, anchor at the latest transaction date.
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
        weekday: "short",
        day: "numeric",
        month: "short",
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
        shortLabel: dayName,
        pillLabel: `${dayName[0]} ${dayNum}`,
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
        shortLabel: i === 0 ? "This Wk" : `W-${i}`,
        pillLabel: i === 0 ? "Now" : `W${5 - i}`,
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
        subLabel: `${year.toString().slice(-2)}`,
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

  // Active dataset based on timeframe
  const activeDataset = useMemo(() => {
    if (timeframe === "weekly") return weeklyData;
    if (timeframe === "monthly") return monthlyData;
    return dailyData;
  }, [timeframe, dailyData, weeklyData, monthlyData]);

  // Ensure default selected index is the latest bar whenever timeframe changes
  useEffect(() => {
    if (activeDataset.length > 0) {
      // Default to the last (most recent) item
      setSelectedIdx(activeDataset.length - 1);
    }
  }, [timeframe, activeDataset.length]);

  const selectedItem =
    selectedIdx !== null && activeDataset[selectedIdx]
      ? activeDataset[selectedIdx]
      : activeDataset[activeDataset.length - 1] || null;

  // Chart data and styling
  const chartData = useMemo(() => {
    const labels = activeDataset.map((d) => d.shortLabel);
    const amounts = activeDataset.map((d) => d.total);

    // Selected bar styling
    const backgroundColors = activeDataset.map((_, i) => {
      const isSelected = i === selectedIdx;
      if (isSelected) {
        return isDark ? "rgb(92, 179, 255)" : "rgb(0, 90, 233)";
      }
      return isDark
        ? "rgba(92, 179, 255, 0.32)"
        : "rgba(0, 90, 233, 0.28)";
    });

    const borderColors = activeDataset.map((_, i) => {
      const isSelected = i === selectedIdx;
      if (isSelected) {
        return isDark ? "rgb(231, 239, 252)" : "rgb(11, 65, 150)";
      }
      return isDark
        ? "rgba(92, 179, 255, 0.55)"
        : "rgba(0, 90, 233, 0.5)";
    });

    const borderWidths = activeDataset.map((_, i) => (i === selectedIdx ? 2 : 1));

    return {
      labels,
      datasets: [
        {
          label: "Daily Expense",
          data: amounts,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: borderWidths,
          borderRadius: 6,
          borderSkipped: false,
          minBarLength: 4, // Ensures ₹0 days show a clickable base sliver
          hoverBackgroundColor: isDark
            ? "rgb(130, 200, 255)"
            : "rgb(20, 110, 250)",
        },
      ],
    };
  }, [activeDataset, selectedIdx, isDark]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 350,
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
          borderWidth: 1,
          padding: 8,
          cornerRadius: 8,
          callbacks: {
            title: (items) => {
              if (!items.length) return "";
              const idx = items[0].dataIndex;
              return activeDataset[idx]?.fullLabel || items[0].label;
            },
            label: (context) => {
              return ` Total: ₹${Number(context.raw || 0).toLocaleString("en-IN")}`;
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
              size: 10,
              weight: "600",
            },
          },
        },
        y: {
          display: true,
          beginAtZero: true,
          grid: {
            color: isDark
              ? "rgba(51, 84, 140, 0.2)"
              : "rgba(187, 207, 239, 0.35)",
            drawBorder: false,
          },
          ticks: {
            maxTicksLimit: 3,
            color: isDark ? "rgb(156, 175, 206)" : "rgb(78, 114, 172)",
            font: {
              family: "Manrope",
              size: 9,
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
          if (onDaySelect && activeDataset[clickedIndex]) {
            onDaySelect(activeDataset[clickedIndex]);
          }
        }
      },
    };
  }, [isDark, activeDataset, onDaySelect]);

  const handleBarClick = (index) => {
    setSelectedIdx(index);
    if (onDaySelect && activeDataset[index]) {
      onDaySelect(activeDataset[index]);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-sidebar-border bg-sidebar-accent/30 backdrop-blur-sm p-3.5 transition-all duration-300 shadow-2xs ${className}`}
    >
      {/* Header with Title & Timeframe Selector */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="flex items-center gap-2 text-left group cursor-pointer"
          title={isCollapsed ? "Expand Analysis" : "Collapse Analysis"}
        >
          <div className="w-7 h-7 rounded-lg bg-sidebar-primary/15 border border-sidebar-primary/30 flex items-center justify-center text-sidebar-primary shadow-2xs group-hover:scale-105 transition-transform">
            <FaChartBar className="text-xs" />
          </div>
          <div>
            <span className="text-xs font-bold text-sidebar-foreground tracking-tight flex items-center gap-1.5">
              <span>Expense Analysis</span>
              <span className="text-muted-foreground text-[10px]">
                {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
              </span>
            </span>
            <div className="text-[10px] text-muted-foreground capitalize">
              {timeframe} Trend
            </div>
          </div>
        </button>

        {/* Refresh button */}
        <button
          type="button"
          onClick={fetchTransactions}
          aria-label="Refresh data"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
          title="Refresh Analysis"
        >
          <FaSyncAlt className={`text-[10px] ${isLoading ? "animate-spin text-sidebar-primary" : ""}`} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {/* Timeframe Switcher Tabs (Daily, Weekly, Monthly) */}
            <div className="grid grid-cols-3 gap-1 bg-background/60 p-1 rounded-xl border border-sidebar-border/70 mb-3">
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
                    className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <Icon className="text-[9px]" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Bar Chart */}
            <div className="relative h-32 w-full mb-2">
              <Bar ref={chartRef} data={chartData} options={chartOptions} />
            </div>

            {/* Quick Interactive Day/Period Pill Selector */}
            <div className="flex items-center justify-between gap-1 mb-3 pt-1 border-t border-sidebar-border/40 overflow-x-auto no-scrollbar">
              {activeDataset.map((item, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <button
                    key={item.key || idx}
                    type="button"
                    onClick={() => handleBarClick(idx)}
                    title={`Click to view ${item.fullLabel} (₹${item.total.toLocaleString("en-IN")})`}
                    className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-mono font-medium transition-all text-center cursor-pointer min-w-[32px] ${
                      isSelected
                        ? "bg-sidebar-primary text-sidebar-primary-foreground ring-1 ring-sidebar-primary/80 font-bold scale-105 shadow-2xs"
                        : "bg-sidebar-accent/40 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/80"
                    }`}
                  >
                    <div>{item.shortLabel}</div>
                    <div className="text-[9px] opacity-80">{item.subLabel}</div>
                  </button>
                );
              })}
            </div>

            {/* Details Box: Selected Day's Expenses (Category & Amount Only) */}
            <div className="rounded-xl bg-card/80 border border-border/80 p-2.5 shadow-2xs">
              {/* Selected Day Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
                <div className="min-w-0 pr-1">
                  <div className="text-[11px] font-bold text-foreground truncate">
                    {selectedItem?.fullLabel || "Selected Day"}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {selectedItem?.expenses?.length || 0} expense{selectedItem?.expenses?.length === 1 ? "" : "s"}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-extrabold text-sidebar-primary font-mono">
                    ₹{Number(selectedItem?.total || 0).toLocaleString("en-IN")}
                  </div>
                  <div className="text-[9px] text-muted-foreground uppercase font-mono">
                    Total
                  </div>
                </div>
              </div>

              {/* List of expenses: Category and Amount ONLY */}
              {selectedItem && selectedItem.expenses && selectedItem.expenses.length > 0 ? (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5 custom-sidebar-scroll">
                  {selectedItem.expenses.map((expense, idx) => (
                    <div
                      key={expense._id || idx}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-secondary/30 hover:bg-secondary/60 border border-border/40 text-xs transition-colors group"
                    >
                      {/* Category */}
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 shadow-2xs ${getCategoryDotClass(
                            expense.category
                          )}`}
                        />
                        <span className="font-semibold text-foreground capitalize truncate text-[11px]">
                          {expense.category}
                        </span>
                      </div>

                      {/* Amount */}
                      <span className="font-bold text-destructive font-mono text-[11px] shrink-0 ml-2">
                        ₹{Number(expense.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-3 text-center px-2">
                  <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-500 mb-1.5">
                    <FaInfoCircle className="text-xs" />
                  </div>
                  <div className="text-[11px] font-medium text-foreground">
                    No expenses logged
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Click another day bar to inspect
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarExpenseAnalysis;
