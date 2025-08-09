import React from "react";
import { Link } from "react-router-dom";
import {useState} from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { storeToken } from "../utils/token";

const SignIn = () => {
  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [showLoader , setShowLoader] = useState(false);
  const navigate = useNavigate();

  const formHandler = async(event)=>{
    event.preventDefault();
    setShowLoader(true);
    try{
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/login`, {email , password});
      storeToken(res.data.token);
      navigate("/dashboard")
    }
    catch(err){
      console.log(err)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-teal-400 mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-6">Sign in to continue tracking your expenses</p>

        <form className="space-y-5" onSubmit={formHandler}>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter email"
              value = {email}
              onChange ={(e)=>setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type= {showPassword? "text" : "password"}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter password"
              value = {password}
              onChange = {(e)=>setPassword(e.target.value)}
            />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 cursor-pointer text-sm text-teal-400 select-none"
              >
                {showPassword ? "Hide": "Show"}
              </span>

          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-md transition-all duration-300 shadow-lg "
          >
            {showLoader?<img className="mx-auto w-16 h-16 bg-transparent" src="/loader-unscreen.gif"></img>:"Sign-In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
