import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { getToken, decodeToken } from "../utils/token";
import SideBar from "../components/SideBar";
import {
  FaArrowUp,
  FaArrowDown,
  FaWallet,
  FaList,
  FaClock,
  FaChartPie,
  FaRobot,
} from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserDashboard = () => {
  const [transaction, setTransaction] = useState([]);
  const [recentTransaction, setRecentTransaction] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([fetchData(), fetchRecentData()]);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setError("Could not load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/get`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    setTransaction(res.data.data || []);
  };

  const fetchRecentData = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/recent`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    setRecentTransaction(res.data.recent || []);
  };

  const token = getToken();
  const decodedData = decodeToken(token) || {};

  const totalEarning = transaction
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transaction
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const availableBalance = totalEarning - totalSpent;

  const pieData = {
    labels: [...new Set(transaction.map(t => t.category))],
    datasets: [
      {
        label: "Your Expenses",
        data: transaction.map(t => t.amount),
        backgroundColor: [
          "#14b8a6",
          "#6366f1",
          "#f59e0b",
          "#ef4444",
          "#10b981",
          "#8b5cf6",
        ],
        borderColor: "#1e293b",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0617] via-[#120824] to-black text-white flex">
      <SideBar />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {decodedData.username || "User"}
            </h1>
            <p className="text-white/70">Here’s your financial overview</p>
          </div>

          <Link to="/ask-chatbot">
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-2xl font-bold transition">
              <FaRobot /> Chat with AI
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-purple-900/20 p-6 rounded-2xl">
            Loading your dashboard…
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500/40 p-6 rounded-2xl">
            {error}
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">

              <div className="bg-purple-900/20 border border-transparent hover:border-green-500 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105">
                <FaArrowUp className="text-green-400 text-2xl mx-auto mb-2" />
                <p>Total Earnings</p>
                <h2 className="text-2xl font-bold text-green-400">
                  ₹ {totalEarning}
                </h2>
              </div>

              <div className="bg-purple-900/20 border border-transparent hover:border-red-500 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105">
                <FaArrowDown className="text-red-400 text-2xl mx-auto mb-2" />
                <p>Amount Spent</p>
                <h2 className="text-2xl font-bold text-red-400">
                  ₹ {totalSpent}
                </h2>
              </div>

              <div className="bg-purple-900/20 border border-transparent hover:border-yellow-400 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105">
                <FaWallet className="text-yellow-400 text-2xl mx-auto mb-2" />
                <p>Available Balance</p>
                <h2 className="text-2xl font-bold text-yellow-400">
                  ₹ {availableBalance}
                </h2>
              </div>

              <div className="bg-purple-900/20 border border-transparent hover:border-purple-500 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105">
                <FaList className="text-white text-2xl mx-auto mb-2" />
                <p>Transactions</p>
                <h2 className="text-2xl font-bold">{transaction.length}</h2>
              </div>

            </div>

            {transaction.length === 0 && !error && (
              <div className="mt-10 bg-purple-900/20 p-8 rounded-2xl text-center border border-purple-500/30">
                <h2 className="text-2xl font-bold text-white">Get Started</h2>
                <p className="text-white/70 mt-2">
                  You don&apos;t have any transactions yet. Add your first expense to see your dashboard come to life.
                </p>
                <div className="mt-6">
                  <Link
                    to="/add"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-5 py-3 font-bold transition"
                  >
                    Add New Expense
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-10 bg-purple-900/20 p-6 rounded-2xl">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                <FaClock /> Recent Expenses
              </h2>

              {recentTransaction.length === 0 ? (
                <p className="text-white/60 text-sm">No recent expenses yet.</p>
              ) : (
                <ul className="space-y-3">
                  {recentTransaction.map((item, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span>{item.category} - ₹{item.amount}</span>
                      <span>{item.note}</span>
                      <span className="text-white/50">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {transaction.length > 0 && (
              <div className="mt-10 text-center">
                <h3 className="flex justify-center items-center gap-2 text-2xl font-semibold mb-6">
                  <FaChartPie /> Expense Distribution
                </h3>
                <div className="w-fit mx-auto">
                  <Pie data={pieData} />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
