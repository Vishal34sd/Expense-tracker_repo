import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import axios from "axios";
import SideBar from "../components/SideBar";
import {
  FaArrowUp,
  FaArrowDown,
  FaWallet,
  FaList,
  FaClock,
  FaChartPie,
  FaChartLine,
} from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { UserAvatar } from "../utils/avatars.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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

  // 1. Expense Category Breakdown for Donut Chart
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

  const donutData = {
    labels: categories.length > 0 ? categories : ["No expenses"],
    datasets: [
      {
        label: "Expense Amount",
        data: categoryTotals.length > 0 ? categoryTotals : [0],
        backgroundColor: pieColors.slice(0, Math.max(categories.length, 1)),
        borderColor: isDark ? "rgb(20, 35, 60)" : "rgb(255, 255, 255)",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "rgb(231, 239, 252)" : "rgb(28, 34, 43)",
          font: { family: "Manrope", size: 11, weight: "500" },
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "rgb(25, 50, 91)" : "rgb(252, 250, 246)",
        titleColor: isDark ? "rgb(231, 239, 252)" : "rgb(28, 34, 43)",
        bodyColor: isDark ? "rgb(231, 239, 252)" : "rgb(28, 34, 43)",
        borderColor: isDark ? "rgb(51, 84, 140)" : "rgb(187, 207, 239)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 12,
        callbacks: {
          label: (context) => ` ${context.label}: ₹${Number(context.raw || 0).toLocaleString("en-IN")}`,
        },
      },
    },
  };

  // 2. Chronological Income vs Expense Area/Line Chart
  const sortedTxns = [...transaction].sort(
    (a, b) => new Date(a.createdAt || a.date || 0) - new Date(b.createdAt || b.date || 0)
  );

  const dateMap = {};
  sortedTxns.forEach((txn) => {
    const d = new Date(txn.createdAt || txn.date || Date.now());
    const dateKey = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    if (!dateMap[dateKey]) {
      dateMap[dateKey] = { income: 0, expense: 0 };
    }
    const amt = Number(txn.amount || 0);
    if (txn.type === "income") {
      dateMap[dateKey].income += amt;
    } else {
      dateMap[dateKey].expense += amt;
    }
  });

  const chartLabels = Object.keys(dateMap).slice(-7);
  const incomeData = chartLabels.map((k) => dateMap[k].income);
  const expenseData = chartLabels.map((k) => dateMap[k].expense);

  const finalLabels =
    chartLabels.length === 1
      ? ["Start", chartLabels[0]]
      : chartLabels.length > 0
      ? chartLabels
      : ["No logs"];
  const finalIncome =
    chartLabels.length === 1
      ? [0, incomeData[0]]
      : incomeData.length > 0
      ? incomeData
      : [0];
  const finalExpense =
    chartLabels.length === 1
      ? [0, expenseData[0]]
      : expenseData.length > 0
      ? expenseData
      : [0];

  const areaChartData = {
    labels: finalLabels,
    datasets: [
      {
        label: "Income",
        data: finalIncome,
        borderColor: isDark ? "rgb(52, 211, 153)" : "rgb(16, 185, 129)",
        backgroundColor: isDark
          ? "rgba(52, 211, 153, 0.15)"
          : "rgba(16, 185, 129, 0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 3.5,
        pointHoverRadius: 6,
        pointBackgroundColor: isDark ? "rgb(52, 211, 153)" : "rgb(16, 185, 129)",
        pointBorderColor: isDark ? "rgb(10, 20, 36)" : "rgb(255, 255, 255)",
        pointBorderWidth: 2,
      },
      {
        label: "Expense",
        data: finalExpense,
        borderColor: isDark ? "rgb(248, 113, 113)" : "rgb(239, 68, 68)",
        backgroundColor: isDark
          ? "rgba(248, 113, 113, 0.15)"
          : "rgba(239, 68, 68, 0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 3.5,
        pointHoverRadius: 6,
        pointBackgroundColor: isDark ? "rgb(248, 113, 113)" : "rgb(239, 68, 68)",
        pointBorderColor: isDark ? "rgb(10, 20, 36)" : "rgb(255, 255, 255)",
        pointBorderWidth: 2,
      },
    ],
  };

  const areaChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          color: isDark ? "rgb(231, 239, 252)" : "rgb(28, 34, 43)",
          font: { family: "Manrope", size: 11, weight: "600" },
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "rgb(25, 50, 91)" : "rgb(252, 250, 246)",
        titleColor: isDark ? "rgb(231, 239, 252)" : "rgb(28, 34, 43)",
        bodyColor: isDark ? "rgb(231, 239, 252)" : "rgb(28, 34, 43)",
        borderColor: isDark ? "rgb(51, 84, 140)" : "rgb(187, 207, 239)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 12,
        callbacks: {
          label: (context) =>
            ` ${context.dataset.label}: ₹${Number(context.raw || 0).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? "rgb(187, 207, 239)" : "rgb(78, 114, 172)",
          font: { family: "Manrope", size: 11 },
        },
      },
      y: {
        grid: {
          color: isDark ? "rgba(45, 71, 114, 0.25)" : "rgba(187, 207, 239, 0.3)",
        },
        ticks: {
          color: isDark ? "rgb(187, 207, 239)" : "rgb(78, 114, 172)",
          font: { family: "Manrope", size: 11 },
          callback: (val) => `₹${val >= 1000 ? (val / 1000).toFixed(0) + "k" : val}`,
        },
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
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link to="/profile" title="View & Edit Profile" className="relative group shrink-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-tr from-primary via-chart-2 to-chart-4 group-hover:scale-105 transition-transform shadow-md">
                <UserAvatar id={userInfo?.avatar || "avatar1"} className="w-full h-full bg-card" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary mb-0.5">
                <span>Overview</span>
                <span>•</span>
                <span className="text-muted-foreground">{new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground truncate">
                Welcome back,{" "}
                <span className="text-primary font-serif italic">
                  {userInfo?.username || "Friend"}
                </span>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Active financial balance & recent logs
              </p>
            </div>
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Income vs Expense Area/Line Chart - Visible on both Mobile & Desktop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="col-span-1 lg:col-span-7 bg-card border border-border/80 rounded-3xl p-4 sm:p-6 md:p-8 shadow-md flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <FaChartLine className="text-base" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground">Income vs Expense</h3>
                      <p className="text-xs text-muted-foreground">Cash flow trends over time</p>
                    </div>
                  </div>
                  <Link
                    to="/summary"
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Summary →
                  </Link>
                </div>

                {transaction.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-center py-12 text-muted-foreground text-sm">
                    No transactions recorded yet. Add your first income or expense to see the trend.
                  </div>
                ) : (
                  <div className="flex-1 w-full min-h-[240px] sm:min-h-[280px] md:min-h-[310px] flex items-center justify-center py-2">
                    <Line data={areaChartData} options={areaChartOptions} />
                  </div>
                )}
              </motion.div>

              {/* Expense Category Donut Chart - Web/Desktop only (Hidden on Mobile) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="hidden lg:flex lg:col-span-5 bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-md flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-chart-1/10 text-chart-1 flex items-center justify-center">
                      <FaChartPie className="text-base" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground">Expense Breakdown</h3>
                      <p className="text-xs text-muted-foreground">Category-wise expenditure</p>
                    </div>
                  </div>
                  <Link
                    to="/summary"
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Report →
                  </Link>
                </div>

                {expenseTransactions.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-center py-12 text-muted-foreground text-sm">
                    No expense records found to generate category distribution.
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[260px] py-2">
                    <div className="w-full max-w-[280px] h-[260px] flex items-center justify-center">
                      <Doughnut data={donutData} options={donutOptions} />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Recent Expenses Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-6 sm:mt-8 bg-card border border-border/80 rounded-3xl p-4 sm:p-6 md:p-8 shadow-md"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-chart-2/10 text-chart-2 flex items-center justify-center">
                    <FaClock className="text-base" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">Recent Expenses</h3>
                    <p className="text-xs text-muted-foreground">Latest outgoing transactions</p>
                  </div>
                </div>
                <Link
                  to="/addTransaction"
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  View full ledger →
                </Link>
              </div>

              {recentExpense.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No recent expenses found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recentExpense.map((expense, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3.5 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/40 hover:bg-secondary/60 transition-all text-xs sm:text-sm"
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
                        -₹ {Number(expense.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;