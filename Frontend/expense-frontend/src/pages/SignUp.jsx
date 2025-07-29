import React from "react";
import { Link } from "react-router-dom";
import {useState} from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storeToken } from "../utils/token";

const SignUp = () => {

    const [username , setUserName] = useState("");
    const [email , setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate= useNavigate();

    const formHandler = async(event)=>{
      event.preventDefault();
      try{
      const res = await  axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/register`, {username, email, password});
      console.log(res.data);
      storeToken(res.data.token);
      navigate("/otp-verify");

    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-teal-400 mb-2 text-center">Create Account</h2>
        <p className="text-gray-400 text-center mb-6">Start tracking your expenses today!</p>

        <form className="space-y-5" onSubmit={formHandler}>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter username"
              value = {username}
              onChange = {(e)=>setUserName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter email"
               value = {email}
              onChange = {(e)=>setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter password"
               value = {password}
              onChange = {(e)=>setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-md transition-all duration-300 shadow-lg hover:shadow-teal-600"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
