import React, { useState, useEffect, useRef } from "react";
import { getToken } from "../utils/token";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OTP_Page = () => {
  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(5 * 60); // 5 minutes in seconds
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (expired) {
      alert("OTP has expired. Please resend to get a new code.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/verify-otp`,
        { otp },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      alert("Email Verified Successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("OTP verification failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Verification failed. Please check your OTP or try again.");
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleResend = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/resend-otp`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setSecondsLeft(5 * 60);
      setExpired(false);

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      alert("A new OTP has been sent to your email!");
    } catch (err) {
      console.error("Resend OTP failed:", err);
      alert("Could not resend OTP. Please try again later or re-register.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="bg-gray-900 border border-gray-700 shadow-xl rounded-2xl w-full max-w-md sm:max-w-lg p-6 sm:p-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-3">Email Verification</h2>
        <p className="text-gray-400 mb-3 text-sm sm:text-base">
          Enter the OTP sent to your registered Email-ID
        </p>
        <p className="text-xs sm:text-sm text-gray-300 mb-5">
          Time left: <span className="font-mono text-teal-300">{formatTime(secondsLeft)}</span>
        </p>

        <form className="space-y-4 sm:space-y-5 text-left" onSubmit={handleOtpSubmit}>
          <div>
            <label className="block text-sm text-gray-300 mb-1">OTP</label>
            <input
              type="text"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={expired}
            />
          </div>

          <button
            type="submit"
            disabled={expired}
            className={`w-full ${
              expired
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600"
            } text-white font-semibold py-2.5 rounded-md transition-all duration-300 shadow-md text-sm sm:text-base`}
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-5 sm:mt-6">
          {expired ? (
            <div>
              <p className="text-sm text-red-400 mb-3">OTP has expired.</p>
              <button
                onClick={handleResend}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-md font-medium text-sm sm:text-base transition-all duration-300"
              >
                Resend OTP
              </button>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-500">
              Didn’t receive OTP? Wait or resend after expiry.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTP_Page;
