import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center px-6 text-white">

      {/* Main Content */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-teal-400 mb-4 drop-shadow-lg">
           Expense Tracker
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto mb-10">
          Track your daily spending, analyze your habits, and reach your financial goals — all in one secure, elegant app.
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-6 mb-12">
          <Link
            to="/register"
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-transform duration-300 hover:scale-105"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-gray-800 border border-teal-400 hover:bg-gray-700 text-teal-300 font-semibold px-6 py-3 rounded-2xl shadow-md transition-transform duration-300 hover:scale-105"
          >
            Sign In
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center max-w-5xl mx-auto">
          <div className="p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
            <h3 className="text-xl font-semibold text-teal-300 mb-2">📊 Track Expenses</h3>
            <p className="text-gray-400 text-sm">Log daily expenses easily and stay in control of your spending.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
            <h3 className="text-xl font-semibold text-indigo-300 mb-2">📈 Visual Insights</h3>
            <p className="text-gray-400 text-sm">Understand your financial patterns with clear, insightful charts.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
            <h3 className="text-xl font-semibold text-pink-300 mb-2">🔒 Secure & Private</h3>
            <p className="text-gray-400 text-sm">Your data stays encrypted and private — only you control it.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 text-sm text-gray-500">
        Latest Version 2.5.1 | Expense Tracker 2025
      </div>
    </div>
  );
};

export default LandingPage;
