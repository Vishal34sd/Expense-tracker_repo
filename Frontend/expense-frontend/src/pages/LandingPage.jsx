import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4 sm:px-6 text-white">

      {/* Main Content */}
      <div className="text-center w-full max-w-6xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-teal-400 mb-3 sm:mb-4 drop-shadow-lg">
          Expense Tracker
        </h1>

        <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto mb-8 sm:mb-10 px-2">
          Track your daily spending, analyze your habits, and reach your financial goals — all in one secure, elegant app.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6 space-y-4 sm:space-y-0 mb-10 sm:mb-12">
          <Link
            to="/register"
            className="w-48 sm:w-auto bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-transform duration-300 hover:scale-105 text-center"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="w-48 sm:w-auto bg-gray-800 border border-teal-400 hover:bg-gray-700 text-teal-300 font-semibold px-6 py-3 rounded-2xl shadow-md transition-transform duration-300 hover:scale-105 text-center"
          >
            Sign In
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center max-w-5xl mx-auto px-4">
          <div className="p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
            <h3 className="text-lg sm:text-xl font-semibold text-teal-300 mb-2">
              📊 Track Expenses
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Log daily expenses easily and stay in control of your spending.
            </p>
          </div>

          <div className="p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
            <h3 className="text-lg sm:text-xl font-semibold text-indigo-300 mb-2">
              📈 Visual Insights
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Understand your financial patterns with clear, insightful charts.
            </p>
          </div>

          <div className="p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
            <h3 className="text-lg sm:text-xl font-semibold text-pink-300 mb-2">
              🔒 Secure & Private
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Your data stays encrypted and private — only you control it.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 sm:mt-20 text-xs sm:text-sm text-gray-500 text-center px-2">
        Latest Version 2.5.1 | Expense Tracker 2025
      </footer>
    </div>
  );
};

export default LandingPage;
