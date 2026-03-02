import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHome,
  FaListAlt,
  FaChartPie,
  FaPlusCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const SideBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/logout`,
        {},
        { withCredentials: true }
      );
    } catch {
      
    }
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <aside className="w-64 bg-purple-900/20 backdrop-blur border-r border-purple-500/20 p-6 hidden sm:block">
      <h2 className="text-2xl font-bold text-white mb-28 text-center font-outfit">
        SmartExpense
      </h2>

      <nav className="space-y-4 text-[16px] text-white/80">
        <Link
          to="/home"
          className="flex items-center gap-3 hover:text-white transition"
        >
          <FaHome />
          Home
        </Link>

        <Link
          to="/addTransaction"
          className="flex items-center gap-3 hover:text-white transition"
        >
          <FaListAlt />
          See All Transactions
        </Link>

        <Link
          to="/summary"
          className="flex items-center gap-3 hover:text-white transition"
        >
          <FaChartPie />
          View Summary
        </Link>

        <Link
          to="/add"
          className="flex items-center gap-3 hover:text-white transition"
        >
          <FaPlusCircle />
          Add New Expense
        </Link>

        <Link
          to="/changePassword"
          className="flex items-center gap-3 hover:text-white transition"
        >
          <FaCog />
          Change Password
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 transition mt-6 w-full"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default SideBar;
