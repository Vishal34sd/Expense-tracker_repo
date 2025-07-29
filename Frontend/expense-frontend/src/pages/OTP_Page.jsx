import React, { useState } from "react";
import { getToken } from "../utils/token";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OTP_Page = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/verify-otp`, 
        { otp },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      alert("Email Verified Successfully!")
      navigate("/dashboard");
    } catch (err) {
      console.log("OTP not provided");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-teal-400 mb-2 text-center">OTP Verification</h2>
        <p className="text-gray-400 text-center mb-6">Enter the OTP sent to your registered Email-ID</p>

        <form className="space-y-5" onSubmit={handleOtpSubmit}>
          <div>
            <label className="block text-sm text-gray-300 mb-1">OTP</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-md transition-all duration-300 shadow-lg hover:shadow-teal-600"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTP_Page;
