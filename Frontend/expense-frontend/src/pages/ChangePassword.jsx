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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-teal-400 mb-2 text-center">
          Change Password
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Update your password securely
        </p>

        <form className="space-y-5" onSubmit={submitHandler}>
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm text-gray-300 mb-1"
            >
              Old Password
            </label>
            <div className="relative">
              <input
                value= {oldPassword}
                onChange = {(e)=>setOldPassword(e.target.value)}
                id="oldPassword"
                type={showOld ? "text" : "password"}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter old password"
              />
              <span
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-2 cursor-pointer text-sm text-teal-400 select-none"
              >
                {showOld ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm text-gray-300 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                value = {newPassword}
                onChange = {(e)=>setNewPassword(e.target.value)}
                id="newPassword"
                type={showNew ? "text" : "password"}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter new password"
              />
              <span
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2 cursor-pointer text-sm text-teal-400 select-none"
              >
                {showNew ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-md transition-all duration-300 shadow-lg hover:shadow-teal-600"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
