import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { storeToken } from "../utils/token";
import Swal from "sweetalert2";

const SignUp = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (username.length < 3) return "Username must be at least 3 characters long";
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email address";
    if (password.length < 6) return "Password must be at least 6 characters long";
    return null;
  };

  const formHandler = async (event) => {
    event.preventDefault();
    setErrorMsg("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setShowLoader(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/register`,
        { username, email, password }
      );
      storeToken(res.data.token);
      Swal.fire({
        title: "Registration Successful!",
        text: "Please verify your email via OTP.",
        icon: "success",
        timer: 3000,
      });
      navigate("/otp-verify");
    } catch (err) {
      const message = err?.response?.data?.message || "Something went wrong";
      setErrorMsg(message);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 py-8 sm:px-6 md:px-8">
      <div className="bg-gray-900 border border-gray-700 shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-sm md:max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-2 text-center">
          Create Account
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm sm:text-base">
          Start tracking your expenses today!
        </p>

        {errorMsg && (
          <p className="mb-4 text-red-400 text-center font-medium">
            {errorMsg}
          </p>
        )}

        <form className="space-y-5" onSubmit={formHandler}>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-teal-500"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-teal-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-teal-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 cursor-pointer text-sm text-teal-400"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md transition-all shadow-lg flex items-center justify-center"
          >
            {showLoader ? (
              <img className="w-12 h-12" src="/loader-unscreen.gif" alt="loading" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-6 text-xs sm:text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-400 hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
