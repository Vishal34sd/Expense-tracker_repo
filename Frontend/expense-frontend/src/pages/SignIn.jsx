import React from "react";
import { Link } from "react-router-dom";
import {useState} from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { storeToken } from "../utils/token";
import Swal from "sweetalert2";

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
      if(!res){
        Swal.fire({
          title : "Login Failed",
          text : "Please try again !",
          timer : 3000

        });
      }
      else{
        Swal.fire({
          title : "Login Successfull",
          text : "Welcome back !",
          timer : 3000,
        
        });
      }
      navigate("/dashboard")
    }
    catch(err){
      console.log(err)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0617] via-[#120824] to-black flex items-center justify-center px-4 text-white">
      <div className="bg-purple-900/20 backdrop-blur border border-purple-500/20 shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-300 mb-2 text-center">Welcome Back</h2>
        <p className="text-purple-200/70 text-center mb-6">Sign in to continue tracking your expenses</p>

        <form className="space-y-5" onSubmit={formHandler}>
          <div>
            <label className="block text-sm text-purple-200/80 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              placeholder="Enter email"
              value = {email}
              onChange ={(e)=>setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <label className="block text-sm text-purple-200/80 mb-1">Password</label>
            <input
              type= {showPassword? "text" : "password"}
              className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              placeholder="Enter password"
              value = {password}
              onChange = {(e)=>setPassword(e.target.value)}
            />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 cursor-pointer text-sm text-purple-300 select-none"
              >
                {showPassword ? "Hide": "Show"}
              </span>

          </div>

          <button
            type="submit"
            className="w-full h-12 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-md transition-all duration-300 shadow-lg"
          >
            {showLoader?<img className=" w-12 h-12 p-0 bg-transparent" src="/loader-unscreen.gif"></img>:"Sign-In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-purple-200/70 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-300 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
