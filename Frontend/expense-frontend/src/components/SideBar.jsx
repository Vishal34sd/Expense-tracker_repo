import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaListAlt,
  FaChartPie,
  FaPlusCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { removeToken } from "../utils/token";

const SideBar = () => {
  return (
    <aside className="w-64 bg-purple-900/20 backdrop-blur border-r border-purple-500/20 p-6 hidden sm:block">
      <h2 className="text-2xl font-bold text-white mb-28 text-center">
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

        <Link
          to="/"
          onClick={() => removeToken()}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 transition mt-6"
        >
          <FaSignOutAlt />
          Logout
        </Link>
      </nav>
    </aside>
  );
};

export default SideBar;
