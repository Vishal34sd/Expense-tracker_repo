import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [recentExpense, setRecentExpense] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl && typeof tokenFromUrl === "string") {
      localStorage.setItem("token", tokenFromUrl);
      navigate("/dashboard", { replace: true });
    }
  }, [location, navigate]);

  const token = getToken();
  let decodedData = {};

  if (token && typeof token === "string") {
    try {
      decodedData = decodeToken(token);
    } catch {
      decodedData = {};
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/get`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allTransactions = res.data.data || [];

        setTransaction(allTransactions);

        const expensesOnly = allTransactions
          .filter((t) => t.type === "expense")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentExpense(expensesOnly);

      } catch {
        setError("Could not load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) load();
    else setIsLoading(false);

  }, [token]);

  const totalEarning = transaction
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transaction
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const availableBalance = totalEarning - totalSpent;

  const pieData = {
    labels: [...new Set(transaction.map((t) => t.category))],
    datasets: [
      {
        label: "Your Expenses",
        data: transaction.map((t) => t.amount),
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
              Welcome, {decodedData?.email || "User"}
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
              <div className="bg-purple-900/20 rounded-2xl p-6 text-center">
                <FaArrowUp className="text-green-400 text-2xl mx-auto mb-2" />
                <p>Total Earnings</p>
                <h2 className="text-2xl font-bold text-green-400">
                  ₹ {totalEarning}
                </h2>
              </div>

              <div className="bg-purple-900/20 rounded-2xl p-6 text-center">
                <FaArrowDown className="text-red-400 text-2xl mx-auto mb-2" />
                <p>Amount Spent</p>
                <h2 className="text-2xl font-bold text-red-400">
                  ₹ {totalSpent}
                </h2>
              </div>

              <div className="bg-purple-900/20 rounded-2xl p-6 text-center">
                <FaWallet className="text-yellow-400 text-2xl mx-auto mb-2" />
                <p>Available Balance</p>
                <h2 className="text-2xl font-bold text-yellow-400">
                  ₹ {availableBalance}
                </h2>
              </div>

              <div className="bg-purple-900/20 rounded-2xl p-6 text-center">
                <FaList className="text-white text-2xl mx-auto mb-2" />
                <p>Transactions</p>
                <h2 className="text-2xl font-bold">
                  {transaction.length}
                </h2>
              </div>
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

            {recentExpense.length > 0 && (
              <div className="mt-12">
                <h3 className="flex items-center gap-2 text-2xl font-semibold mb-6">
                  <FaClock /> Recent Expenses
                </h3>

                <div className="bg-purple-900/20 rounded-2xl divide-y divide-purple-500/20">
                  {recentExpense.map((expense, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 hover:bg-purple-800/20 transition text-sm md:text-base"
                    >
                      <div className="flex items-center gap-4 flex-wrap">

                        <span className="font-semibold text-white">
                          {expense.note || "Untitled"}
                        </span>

                        <span className="text-white/40">
                          • {expense.category}
                        </span>

                        <span className="text-white/50">
                          • {new Date(expense.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                        </span>

                      </div>

                      <span className="text-red-400 font-bold">
                        ₹ {expense.amount}
                      </span>
                    </div>
                  ))}
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