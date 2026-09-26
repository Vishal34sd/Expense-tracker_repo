import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import SideBar from "../components/SideBar";
import {
  FaChartPie,
  FaFileExcel,
  FaLightbulb,
  FaExclamationTriangle,
  FaCheckCircle,
  FaMoneyBillWave,
  FaPlus,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const ViewSummary = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [budget, setBudget] = useState(15000);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState("15000");

  const [totalSpent, setTotalSpent] = useState(0);
  const [percentSpent, setPercentSpent] = useState(0);
  const [mostSpentCategory, setMostSpentCategory] = useState(["N/A", 0]);
  const [averageExpense, setAverageExpense] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [pieData, setPieData] = useState({});

  const { isDark } = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/get`,
        { withCredentials: true }
      );
      const data = res.data.data || [];
      setTransactions(data);
      processSummary(data, budget);
    } catch (err) {
      // Error fetching
    } finally {
      setIsLoading(false);
    }
  };

  const processSummary = (data, currentBudget) => {
    const expenseTxns = data.filter((txn) => txn.type === "expense");
    const spent = expenseTxns.reduce((acc, txn) => acc + Number(txn.amount || 0), 0);
    setTotalSpent(spent);

    const b = Number(currentBudget) || 1;
    setPercentSpent(((spent / b) * 100).toFixed(1));
    setAverageExpense(
      expenseTxns.length > 0 ? (spent / expenseTxns.length).toFixed(2) : 0
    );

    const categoryTotals = {};
    expenseTxns.forEach((txn) => {
      const cat = (txn.category || "General").trim().toLowerCase();
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(txn.amount || 0);
    });
    setCategoryData(categoryTotals);

    const maxCategory = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0];
    setMostSpentCategory(maxCategory || ["N/A", 0]);

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);
    const colors = isDark
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

    setPieData({
      labels: labels.length > 0 ? labels : ["No data"],
      datasets: [
        {
          data: values.length > 0 ? values : [0],
          backgroundColor: colors.slice(0, Math.max(labels.length, 1)),
          borderColor: isDark ? "rgb(51, 84, 140)" : "rgb(187, 207, 239)",
          borderWidth: 2,
        },
      ],
    });
  };

  const handleBudgetSave = () => {
    const newB = Number(tempBudget) || 10000;
    setBudget(newB);
    setIsEditingBudget(false);
    processSummary(transactions, newB);
  };

  const exportToExcel = () => {
    const excelData = transactions.map((expense) => ({
      "Record ID": expense._id,
      Category: expense.category,
      Type: expense.type,
      "Amount (₹)": expense.amount,
      Note: expense.note || "",
      Date: expense.createdAt || expense.date || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, "SmartExpense_Financial_Report.xlsx");
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
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      <SideBar />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              <span>Analytics & Audit</span>
              <span>•</span>
              <span className="text-muted-foreground">Monthly Digest</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Expense Summary
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Deep dive into budget utilization, category weightage, and spending habits.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportToExcel}
              disabled={transactions.length === 0}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all disabled:opacity-50"
            >
              <FaFileExcel className="text-emerald-300" />
              <span>Export Excel</span>
            </motion.button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-card border border-border rounded-3xl p-8 text-center text-muted-foreground animate-pulse">
            Analyzing transaction statistics…
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-card border border-border/80 rounded-3xl p-10 text-center shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-primary text-xl mb-4">
              <FaChartPie />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No summary data available
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Add your first few transactions to unlock visual trends, budget thresholds, and insights.
            </p>
            <Link
              to="/add"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
            >
              <FaPlus className="text-xs" />
              <span>Record Expense</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Monthly Budget Card */}
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-card border border-border/80 rounded-3xl p-6 shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Monthly Budget
                  </span>
                  <button
                    onClick={() => setIsEditingBudget(!isEditingBudget)}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    {isEditingBudget ? "Cancel" : "Change"}
                  </button>
                </div>

                {isEditingBudget ? (
                  <div className="flex gap-2 my-2">
                    <input
                      type="number"
                      value={tempBudget}
                      onChange={(e) => setTempBudget(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-secondary border border-border text-foreground text-sm font-bold"
                    />
                    <button
                      onClick={handleBudgetSave}
                      className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    ₹ {Number(budget).toLocaleString("en-IN")}
                  </div>
                )}

                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1.5 text-muted-foreground">
                    <span>Spent: ₹{totalSpent.toLocaleString("en-IN")}</span>
                    <span className={`font-bold ${percentSpent > 100 ? "text-destructive" : "text-primary"}`}>
                      {percentSpent}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentSpent, 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        percentSpent > 100
                          ? "bg-destructive"
                          : percentSpent > 75
                          ? "bg-amber-500"
                          : "bg-primary"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Highest Category */}
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-card border border-border/80 rounded-3xl p-6 shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Highest Category
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center text-sm">
                    <FaExclamationTriangle />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground capitalize">
                  {mostSpentCategory[0]}
                </div>
                <p className="text-sm font-semibold text-destructive mt-3">
                  ₹ {Number(mostSpentCategory[1]).toLocaleString("en-IN")} spent
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Dominates your discretionary spending
                </p>
              </motion.div>

              {/* Average Transaction */}
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-card border border-border/80 rounded-3xl p-6 shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Average / Expense
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm">
                    <FaMoneyBillWave />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  ₹ {averageExpense}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Across {transactions.filter((t) => t.type === "expense").length} recorded expenses
                </p>
              </motion.div>
            </div>

            {/* Visual Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Pie Chart Card */}
              <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  Category Distribution
                </h3>
                <p className="text-xs text-muted-foreground mb-4 pb-3 border-b border-border/60">
                  Visual ratio of total expense outflow
                </p>
                <div className="flex-1 flex items-center justify-center w-full min-h-[300px] my-auto py-2">
                  <div className="w-full max-w-[340px] sm:max-w-[380px] h-[280px] sm:h-[320px] flex items-center justify-center">
                    <Pie data={pieData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Category Breakdown List */}
              <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    Breakdown by Category
                  </h3>
                  <p className="text-xs text-muted-foreground mb-5">
                    Individual category aggregates
                  </p>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {Object.entries(categoryData).map(([category, amount], idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 rounded-2xl bg-secondary/30 border border-border/60 hover:bg-secondary/50 transition"
                      >
                        <span className="font-semibold text-foreground capitalize text-sm">
                          {category}
                        </span>
                        <span className="font-extrabold text-foreground text-sm">
                          ₹ {Number(amount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 text-xs text-muted-foreground">
                  Categories automatically populate as you record entries.
                </div>
              </div>
            </div>

            {/* Smart Spending Insights & Tips */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/60">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg">
                  <FaLightbulb />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Smart Financial Insights & Tips
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Actionable advice generated from your recent behavior
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(categoryData)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([category, amount], idx) => {
                    const isHigh = totalSpent > 0 && amount > 0.4 * totalSpent;
                    const isMedium = totalSpent > 0 && amount > 0.2 * totalSpent;

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-foreground capitalize text-sm">
                            {category}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Spent ₹{amount} ({totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(0) : 0}% of expenses)
                          </div>
                        </div>

                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            isHigh
                              ? "bg-destructive/10 text-destructive border border-destructive/20"
                              : isMedium
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {isHigh ? "High Outflow" : isMedium ? "Moderate" : "Well Balanced"}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {/* Dynamic Tip Box */}
              <div className="mt-6 p-4 rounded-2xl bg-accent/30 border border-border text-xs sm:text-sm text-foreground flex items-start gap-3">
                <FaCheckCircle className="text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold mb-0.5">Budget Health Advisory:</div>
                  <div className="text-muted-foreground">
                    {totalSpent > budget
                      ? "You have surpassed your designated monthly budget threshold. Prioritize essential commitments and pause discretionary purchases."
                      : totalSpent > 0.75 * budget
                      ? "You are nearing 75% of your target monthly limit. Monitor daily micro-transactions over the remaining period."
                      : "Great financial discipline! You are pacing well within your designated spending targets."}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ViewSummary;
