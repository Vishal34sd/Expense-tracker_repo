import React, { useState } from "react";
import axios from "axios"
import {useNavigate} from "react-router-dom"
import { getToken } from "../utils/token";

const AddExpense = () => {
  const [form , setForm ] = useState({
    type : "expense" ,
    amount : "" , 
    category : "" ,
    note : ""
  });

  const navigate = useNavigate();

  const inputHandler = (e)=>{
       const {name , value} = e.target ;
       setForm({
        ...form,
        [name]:value
       })
  }

  const formSubmitHandler = async(e)=>{
        e.preventDefault();
         console.log("Submitting Form:", form);
        try{
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/add`, form,{
            headers : {
              Authorization : `Bearer ${getToken()}`
            }
          });
          console.log(form);
          alert("expense added");
          navigate("/dashboard");


        }
        catch(err){
          console.log(err);
        }

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0617] via-[#120824] to-black text-white flex items-center justify-center px-4">
      <div className="bg-purple-900/20 backdrop-blur border border-purple-500/20 rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Add Expense / Income</h2>

        <form className="space-y-5" onSubmit={formSubmitHandler}>
          
          <div>
            <label className="block text-sm text-white/80 mb-1">Type</label>
            <select
              name = "type"
              value={form.type}
              onChange={inputHandler}
              className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          
          <div>
            <label className="block text-sm text-white/80 mb-1">Amount</label>
            <input
            name = "amount"
              type="number"
              value={form.amount}
              onChange={inputHandler}
              className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              placeholder="Enter amount"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm text-white/80 mb-1">Category</label>
            <input
              type="text"
              name = "category"
              value={form.category}
              onChange={inputHandler}
              className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              placeholder="e.g. Food, Travel"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm text-white/80 mb-1">Note</label>
            <textarea
              name = "note"
              value={form.note}
              onChange={inputHandler}
              className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              placeholder="Add an optional note..."
              rows="3"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-md transition-all duration-300 shadow-lg"
          >
            Add Entry
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
