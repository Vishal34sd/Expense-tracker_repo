import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import SideBar from "../components/SideBar";
import {
  FaArrowUp,
  FaArrowDown,
  FaWallet,
  FaList,
  FaClock,
  FaChartPie,
  FaRobot,
  FaPlus,
} from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { UserAvatar } from "../utils/avatars.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserDashboard = () => {
  const [transaction, setTransaction] = useState([]);
  const [recentExpense, setRecentExpense] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [userInfo, setUserInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const handleUserUpdate = () => {
      try {
        setUserInfo(JSON.parse(localStorage.getItem("userInfo") || "{}"));
      } catch {
        // ignore
      }
    };
    window.addEventListener("userInfoUpdated", handleUserUpdate);
    window.addEventListener("storage", handleUserUpdate);
    return () => {
      window.removeEventListener("userInfoUpdated", handleUserUpdate);
      window.removeEventListener("storage", handleUserUpdate);
    };
  }, []);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const load = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/get`,
          { withCredentials: true }
        );

        const allTransactions = res.data.data || [];
        setTransaction(allTransactions);

        const expensesOnly = allTransactions
          .filter((t) => t.type === "expense")
          .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
          .slice(0, 5);

        setRecentExpense(expensesOnly);
      } catch (err) {
        if (err?.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Could not load dashboard data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [isReady, navigate]);

  const totalEarning = transaction
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalSpent = transaction
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const availableBalance = totalEarning - totalSpent;

  // Chart data calculation
  const expenseTransactions = transaction.filter((t) => t.type === "expense");
  const categories = [...new Set(expenseTransactions.map((t) => t.category || "General"))];
  const categoryTotals = categories.map((cat) =>
    expenseTransactions
      .filter((t) => (t.category || "General") === cat)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
  );

  const pieColors = isDark
    ? [
        "rgb(92, 179, 255)",
        "rgb(81, 151, 198)",
        "rgb(187, 207, 239)",
        "rgb(70, 113, 183)",
        "rgb(211, 223, 243)",
        "rgb(202, 85, 81)",
      ]
    : [
        "rgb(0, 90, 233)",
        "rgb(96, 167, 214)",
        "rgb(187, 207, 239)",
        "rgb(11, 65, 150)",
        "rgb(88, 116, 234)",
        "rgb(185, 70, 66)",
      ];

  const pieData = {
    labels: categories.length > 0 ? categories : ["No expenses"],
    datasets: [
      {
        label: "Expense Amount",
        data: categoryTotals.length > 0 ? categoryTotals : [0],
        backgroundColor: pieColors.slice(0, Math.max(categories.length, 1)),
        borderColor: isDark ? "rgb(51, 84, 140)" : "rgb(187, 207, 239)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "rgb(231, 239, 252)" : "rgb(28, 34, 43)",
          font: { family: "Manrope", size: 12 },
          boxWidth: 14,
        },
      },
      tooltip: {
        backgroundColor: isDark ? "rgb(25, 50, 91)" : "rgb(252, 250, 246)",
        titleColor: isDark ? "rgb(231, 239, 252)" : "rgb(28, 34, 43)",
        bodyColor: isDark ? "rgb(231, 239, 252)" : "rgb(28, 34, 43)",
        borderColor: isDark ? "rgb(51, 84, 140)" : "rgb(187, 207, 239)",
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      <SideBar />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto overflow-y-auto">
        {/* Top Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <Link to="/profile" title="View & Edit Profile" className="relative group shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-tr from-primary via-chart-2 to-chart-4 group-hover:scale-105 transition-transform shadow-md">
                <UserAvatar id={userInfo?.avatar || "avatar1"} className="w-full h-full bg-card" />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </Link>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                <span>Financial Overview</span>
                <span>•</span>
                <span className="text-muted-foreground">{new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Welcome back,{" "}
                <span className="text-primary font-serif italic">
                  {userInfo?.username || "Friend"}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Here is your active financial balance and recent transactions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Theme Toggle for mobile or quick access */}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label="Toggle theme"
              className="sm:hidden p-2.5 rounded-full bg-secondary text-secondary-foreground border border-border"
            >
              {isDark ? <FiSun className="text-amber-300" /> : <FiMoon className="text-primary" />}
            </button>

            <Link to="/add" className="flex-1 sm:flex-initial">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-accent border border-border px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all shadow-xs"
              >
                <FaPlus className="text-xs text-primary" />
                <span>Add Entry</span>
              </motion.button>
            </Link>

            <Link to="/ask-chatbot" className="flex-1 sm:flex-initial">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35"
              >
                <FaRobot className="text-sm animate-bounce" />
                <span>AI Co-Pilot</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-36 rounded-3xl bg-card border border-border p-6 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive p-6 rounded-3xl">
            {error}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {/* Earnings */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                whileHover={{ y: -3 }}
                className="bg-card border border-border/80 rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Income
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm shadow-xs">
                    <FaArrowUp />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  ₹ {totalEarning.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
                  <span>● Active earnings recorded</span>
                </div>
              </motion.div>

              {/* Expenses */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -3 }}
                className="bg-card border border-border/80 rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Spent
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center text-sm shadow-xs">
                    <FaArrowDown />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  ₹ {totalSpent.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-destructive font-medium mt-2 flex items-center gap-1">
                  <span>● Outflow across all categories</span>
                </div>
              </motion.div>

              {/* Net Balance */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                whileHover={{ y: -3 }}
                className="bg-card border border-border/80 rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Net Balance
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-sm shadow-xs">
                    <FaWallet />
                  </div>
                </div>
                <div className={`text-2xl sm:text-3xl font-extrabold ${availableBalance >= 0 ? "text-primary" : "text-destructive"}`}>
                  ₹ {availableBalance.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {availableBalance >= 0 ? "Positive liquidity status" : "Spending exceeds income"}
                </div>
              </motion.div>

              {/* Total Transactions */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -3 }}
                className="bg-card border border-border/80 rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Logs
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center text-sm shadow-xs">
                    <FaList />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {transaction.length}
                </div>
                <Link
                  to="/addTransaction"
                  className="text-xs text-primary font-semibold hover:underline mt-2 inline-block"
                >
                  View full ledger →
                </Link>
              </motion.div>
            </div>

            {/* Visuals & Ledger Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Chart Card (3 cols) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="lg:col-span-3 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col"
              >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-chart-1/10 text-chart-1 flex items-center justify-center">
                      <FaChartPie className="text-base" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Expense Distribution</h3>
                      <p className="text-xs text-muted-foreground">Category-wise breakdown of expenses</p>
                    </div>
                  </div>
                  <Link
                    to="/summary"
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Detailed Report →
                  </Link>
                </div>

                {transaction.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-center py-12 text-muted-foreground text-sm">
                    No transactions recorded yet. Add your first expense to see live visual breakdown.
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[300px] my-auto py-2">
                    <div className="w-full max-w-[340px] sm:max-w-[380px] h-[280px] sm:h-[320px] flex items-center justify-center">
                      <Pie data={pieData} options={chartOptions} />
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Recent Expenses (2 cols) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-chart-2/10 text-chart-2 flex items-center justify-center">
                        <FaClock className="text-base" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Recent Expenses</h3>
                        <p className="text-xs text-muted-foreground">Last 5 outgoing payments</p>
                      </div>
                    </div>
                  </div>

                  {recentExpense.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      No expense entries found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentExpense.map((expense, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/40 hover:bg-secondary/60 transition-all text-xs sm:text-sm"
                        >
                          <div className="flex flex-col gap-0.5 truncate pr-2">
                            <span className="font-bold text-foreground truncate">
                              {expense.note || expense.category || "Untitled Expense"}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {expense.category} •{" "}
                              {new Date(expense.createdAt || expense.date || Date.now()).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                }
                              )}
                            </span>
                          </div>

                          <span className="text-destructive font-extrabold shrink-0 text-sm">
                            -₹ {expense.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 text-center">
                  <Link
                    to="/addTransaction"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View and edit all transactions →
                  </Link>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;