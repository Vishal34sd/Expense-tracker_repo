import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";

const SignUp = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const formHandler = async (event) => {
    event.preventDefault();
    setShowLoader(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/register`,
        { username, email, password },
        { withCredentials: true }
      );

      if (res.data.user) {
        localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      }

      enqueueSnackbar(
        "Registration successful. Please verify the OTP sent to your email.",
        { variant: "success" }
      );

      navigate("/otp-verify");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setShowLoader(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0617] via-[#120824] to-black flex items-center justify-center px-4 text-white">
      <div className="bg-purple-900/20 backdrop-blur border border-purple-500/20 shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Create Account
        </h2>
        <p className="text-white/70 text-center mb-6">
          Start tracking your expenses today!
        </p>

        <form className="space-y-5" onSubmit={formHandler}>
          <div>
            <label className="block text-sm text-white/80 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm text-white/80 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 cursor-pointer text-sm text-white select-none"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-all duration-300 shadow-lg flex items-center justify-center cursor-pointer"
          >
            {showLoader ? (
              <img
                className="w-12 h-12"
                src="/loader-unscreen.gif"
                alt="loading"
              />
            ) : (
              "Sign-Up"
            )}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-purple-500/20"></div>
          <span className="px-3 text-sm text-white/60">OR</span>
          <div className="flex-grow h-px bg-purple-500/20"></div>
        </div>

        {/* GOOGLE BUTTON */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full h-12 bg-white text-black font-semibold rounded-md transition-all duration-300 shadow-lg flex items-center justify-center gap-3 hover:bg-gray-200 cursor-pointer"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          Sign-up with Google
        </button>

        <p className="mt-6 text-sm text-white/70 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;