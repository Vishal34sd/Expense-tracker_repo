import React, { useState , useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/token";
import {useNavigate} from "react-router-dom"

const ChangePassword = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  const submitHandler = async(e)=>{
    e.preventDefault();
    try{
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/changePassword`, {oldPassword, newPassword},{
        headers : {
          Authorization : `Bearer ${getToken()}`
        }
      });
      alert("Password changed successfully");
      navigate("/dashboard");

    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0617] via-[#120824] to-black flex items-center justify-center px-4 text-white">
      <div className="bg-purple-900/20 backdrop-blur border border-purple-500/20 shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-300 mb-2 text-center">
          Change Password
        </h2>
        <p className="text-purple-200/70 text-center mb-6">
          Update your password securely
        </p>

        <form className="space-y-5" onSubmit={submitHandler}>
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm text-purple-200/80 mb-1"
            >
              Old Password
            </label>
            <div className="relative">
              <input
                value= {oldPassword}
                onChange = {(e)=>setOldPassword(e.target.value)}
                id="oldPassword"
                type={showOld ? "text" : "password"}
                className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                placeholder="Enter old password"
              />
              <span
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-2 cursor-pointer text-sm text-purple-300 select-none"
              >
                {showOld ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm text-purple-200/80 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                value = {newPassword}
                onChange = {(e)=>setNewPassword(e.target.value)}
                id="newPassword"
                type={showNew ? "text" : "password"}
                className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                placeholder="Enter new password"
              />
              <span
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2 cursor-pointer text-sm text-purple-300 select-none"
              >
                {showNew ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-md transition-all duration-300 shadow-lg"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
