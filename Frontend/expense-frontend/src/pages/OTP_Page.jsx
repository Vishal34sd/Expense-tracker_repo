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
  console.error("OTP verification failed:", err.response?.data || err.message);
  alert(err.response?.data?.message || "Verification failed. Please check your OTP or try again.");
}
  };

  // format seconds to MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // start countdown on mount
  useEffect(() => {
    // clear any existing interval
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

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleResend = async () => {
    try {
      
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/resend-otp`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      // reset timer and states on success
      setSecondsLeft(5 * 60);
      setExpired(false);
      // restart interval
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

      alert("A new OTP has been sent to your email (if the server supports resend).");
    } catch (err) {
      console.error("Resend OTP failed:", err);
      alert("Could not resend OTP. Please try again later or re-register.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0617] via-[#120824] to-black flex items-center justify-center px-4 text-white">
      <div className="bg-purple-900/20 backdrop-blur border border-purple-500/20 shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Email Verification</h2>
        <p className="text-white/70 text-center mb-2">Enter the OTP sent to your registered Email-ID</p>
        <p className="text-sm text-white/80 text-center mb-4">
          Time left: <span className="font-mono text-white/80">{formatTime(secondsLeft)}</span>
        </p>

        <form className="space-y-5" onSubmit={handleOtpSubmit}>
          <div>
            <label className="block text-sm text-white/80 mb-1">OTP</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={expired}
            />
          </div>

          <button
            type="submit"
            disabled={expired}
            className={`w-full ${expired ? 'bg-purple-900/30 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white font-semibold py-2.5 rounded-md transition-all duration-300 shadow-lg`}
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-4 text-center">
          {expired ? (
            <div>
              <p className="text-sm text-red-400 mb-2">OTP has expired.</p>
              <button
                onClick={handleResend}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium"
              >
                Resend OTP
              </button>
            </div>
          ) : (
            <p className="text-sm text-white/60">If you didn't receive OTP, please wait or try resending after it expires.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTP_Page;
