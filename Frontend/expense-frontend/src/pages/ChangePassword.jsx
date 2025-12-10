import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../utils/token";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/changePassword`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      alert("Password changed successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error changing password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 sm:px-6 py-10">
      <div className="bg-gray-900 border border-gray-700 shadow-xl rounded-2xl p-6 sm:p-10 w-full max-w-sm sm:max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-2 text-center">
          Change Password
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm sm:text-base">
          Update your password securely
        </p>

        <form className="space-y-5" onSubmit={submitHandler}>
          {/* Old Password */}
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm sm:text-base text-gray-300 mb-1"
            >
              Old Password
            </label>
            <div className="relative">
              <input
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                id="oldPassword"
                type={showOld ? "text" : "password"}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-600 rounded-md text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter old password"
              />
              <span
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-2.5 sm:top-3 cursor-pointer text-xs sm:text-sm text-teal-400 select-none"
              >
                {showOld ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm sm:text-base text-gray-300 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                id="newPassword"
                type={showNew ? "text" : "password"}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-600 rounded-md text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter new password"
              />
              <span
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 sm:top-3 cursor-pointer text-xs sm:text-sm text-teal-400 select-none"
              >
                {showNew ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 sm:py-3 rounded-md text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-teal-600"
          >
            Update Password
          </button>

          {/* Back to Dashboard Button (mobile friendly) */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 sm:py-3 rounded-md text-sm sm:text-base transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
