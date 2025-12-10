import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/token";

const AddExpense = () => {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
  });

  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/add`, form, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      alert("Expense added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Error adding expense. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center px-4 sm:px-6 py-10">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 sm:p-10 w-full max-w-sm sm:max-w-md shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 sm:mb-6 text-center">
          Add Expense / Income
        </h2>

        <form className="space-y-5" onSubmit={formSubmitHandler}>
          {/* Type */}
          <div>
            <label className="block text-sm sm:text-base text-gray-300 mb-1">
              Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={inputHandler}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-600 rounded-md text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm sm:text-base text-gray-300 mb-1">
              Amount
            </label>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={inputHandler}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-600 rounded-md text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter amount"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm sm:text-base text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={inputHandler}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-600 rounded-md text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Food, Travel"
              required
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm sm:text-base text-gray-300 mb-1">
              Note
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={inputHandler}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-600 rounded-md text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              placeholder="Add an optional note..."
              rows="3"
            ></textarea>
          </div>

          {/* Buttons */}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 sm:py-3 rounded-md text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-teal-600"
          >
            Add Entry
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 sm:py-3 rounded-md text-sm sm:text-base transition-all duration-300 mt-2"
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
