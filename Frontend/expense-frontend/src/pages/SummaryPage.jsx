import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getToken } from "../utils/token.js"; 

ChartJS.register(ArcElement, Tooltip, Legend);

const ViewSummary = () => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(10000); 

  const [totalSpent, setTotalSpent] = useState(0);
  const [percentSpent, setPercentSpent] = useState(0);
  const [mostSpentCategory, setMostSpentCategory] = useState(["N/A", 0]);
  const [averageExpense, setAverageExpense] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [pieData, setPieData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/get", {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      const data = res.data.data;
      setTransactions(data);
      processSummary(data);
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  const processSummary = (data) => {
    // Only consider transactions where type is "expense"
    const expenseTxns = data.filter(txn => txn.type === "expense");

    // Total spent
    const spent = expenseTxns.reduce((acc, txn) => acc + txn.amount, 0);
    setTotalSpent(spent);

    // Percent of budget used
    const percent = ((spent / budget) * 100).toFixed(1);
    setPercentSpent(percent);

    // Average expense
    const avg = expenseTxns.length > 0 ? (spent / expenseTxns.length).toFixed(2) : 0;
    setAverageExpense(avg);

    // Category totals
    const categoryTotals = {};
    expenseTxns.forEach((txn) => {
      const cat = txn.category.toLowerCase();
      categoryTotals[cat] = (categoryTotals[cat] || 0) + txn.amount;
    });
    setCategoryData(categoryTotals);

    // Most spent category
    const maxCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    setMostSpentCategory(maxCategory || ["N/A", 0]);

    // Pie data
    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);
    const colors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#f472b6"];

    setPieData({
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 1
        }
      ]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 px-6 md:px-20">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">📊 Expense Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Budget Overview */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">💼 Monthly Budget</h3>
            <p>Budget: ₹{budget}</p>
            <p>Spent: ₹{totalSpent}</p>
            <p className="mt-1 text-emerald-400 font-bold">{percentSpent}% used</p>
          </div>

          {/* Most Spent Category */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">🔥 Most Spent Category</h3>
            <p>Category: <span className="capitalize">{mostSpentCategory[0]}</span></p>
            <p>Amount: ₹{mostSpentCategory[1]}</p>
          </div>

          {/* Average Expense */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">📈 Average Per Transaction</h3>
            <p>₹{averageExpense}</p>
            <p className="text-sm text-gray-400">
              Across {transactions.filter(t => t.type === "expense").length} expenses
            </p>
          </div>
        </div>

        {/* Chart + Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">📂 Category Distribution</h3>
            {Object.keys(categoryData).length > 0 ? (
              <Pie data={pieData} />
            ) : (
              <p className="text-gray-400">No data available</p>
            )}
          </div>

          {/* Breakdown */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">🔍 Breakdown by Category</h3>
            <div className="space-y-3">
              {Object.entries(categoryData).map(([category, amount], idx) => (
                <div
                  key={idx}
                  className="flex justify-between bg-gray-700 px-4 py-2 rounded-lg"
                >
                  <span className="capitalize">{category}</span>
                  <span className="text-emerald-400 font-semibold">₹{amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Smart Spending Insights */}
        <div className="mt-10 bg-gray-900 p-6 rounded-xl">
          <h3 className="text-2xl font-bold mb-4 text-yellow-400">🧠 Smart Spending Insights</h3>

          {/* Top Categories */}
          <div className="space-y-4">
            {Object.entries(categoryData)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([category, amount], idx) => {
                let label = "";
                if (amount > 0.5 * totalSpent) label = "💰 High Spending";
                else if (amount > 0.3 * totalSpent) label = "⚠️ Be Careful";
                else label = "✅ Balanced";

                return (
                  <div
                    key={idx}
                    className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="capitalize text-lg font-semibold">{category}</p>
                      <p className="text-gray-400 text-sm">Spent ₹{amount}</p>
                    </div>
                    <span className="text-sm font-medium bg-gray-700 px-3 py-1 rounded-full">
                      {label}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* Spending Tip */}
          <div className="mt-6 bg-gray-800 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">💡 Spending Tip</h4>
            <p className="text-gray-300">
              {
                totalSpent > budget
                  ? "You've crossed your monthly budget. Consider limiting non-essential expenses like shopping or food deliveries."
                  : totalSpent > 0.75 * budget
                  ? "You're close to hitting your budget. Monitor your spending carefully in the coming days."
                  : "You're managing your budget well. Keep tracking regularly!"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSummary;
