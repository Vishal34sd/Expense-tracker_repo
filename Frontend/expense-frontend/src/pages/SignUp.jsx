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
  const navigate = useNavigate();

  const formHandler = async (event) => {
    event.preventDefault();
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
      console.error(err);
      Swal.fire({
        title: "Sign Up Failed",
        text: "Something went wrong, please try again.",
        icon: "error",
        timer: 3000,
      });
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

        <form className="space-y-5" onSubmit={formHandler}>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-xs sm:text-sm cursor-pointer text-teal-400 select-none"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button
            type="submit"
            disabled={showLoader}
            className="w-full h-12 flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-md transition-all duration-300 shadow-lg disabled:opacity-70"
          >
            {showLoader ? (
              <img
                className="w-10 h-10 sm:w-12 sm:h-12 p-0 bg-transparent"
                src="/loader-unscreen.gif"
                alt="loading"
              />
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
