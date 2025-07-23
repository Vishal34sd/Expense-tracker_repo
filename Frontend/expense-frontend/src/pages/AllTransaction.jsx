import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/token";

const AllTransactions = () => {
  const [transaction, setTransaction] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTransaction, setEditTransaction] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
  });

  
  useEffect(() => {
    transactionData();
  }, []);

  const transactionData = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/get",{
        headers : {
          Authorization : `Bearer ${getToken()}`
        }
      });
      setTransaction(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };


  const handleEditButton = (item) => {
    setEditId(item._id);
    setEditTransaction({
      type: item.type,
      amount: item.amount,
      category: item.category,
      note: item.note || "",
    });
  };

  
  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:8080/api/v1/edit/${editId}`,  editTransaction , {
          headers : {
            Authorization : `Bearer ${getToken()}`
          }
        }
       
      );

      const updatedTxn = res.data.data;

      
      const updatedList = transaction.map((item) =>
        item._id === editId ? updatedTxn : item
      );

      setTransaction(updatedList);
      setEditId(null); 
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  
  const handleDelete = async (item) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/delete/${item._id}`,
        {
          headers : {
            Authorization : `Bearer ${getToken()}`
          }
        }
      );
      setTransaction(transaction.filter((txn) => txn._id !== item._id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <h1 className="text-3xl font-bold text-teal-400 mb-6 text-center">
        All Transactions
      </h1>

      <div className="overflow-x-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-md">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="bg-gray-800 text-gray-400 uppercase text-left">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Category</th>
              <th className="p-4">Note</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transaction.map((txn, index) => {
              const isIncome = txn.type.toLowerCase() === "income";
              const typeColor = isIncome ? "text-green-400" : "text-red-400";
              const amountColor = isIncome ? "text-green-300" : "text-red-300";

              return (
                <tr
                  key={txn._id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className={`p-4 font-medium ${typeColor}`}>{txn.type}</td>
                  <td className={`p-4 font-bold ${amountColor}`}>₹ {txn.amount}</td>
                  <td className="p-4">{txn.category}</td>
                  <td className="p-4 text-sm">{txn.note}</td>
                  <td className="p-4">{txn.date ? txn.date.slice(0,10) : "-"}</td>
                  <td className="p-4">
                    <button
                      className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-xs m-3"
                      onClick={() => handleEditButton(txn)}
                    >
                      Edit
                    </button>
                     <button
                      onClick={() => handleDelete(txn)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      
      {editId ? (
        <div className="mt-8 bg-gray-900 border border-gray-700 rounded-2xl shadow-md p-6 max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-teal-400 mb-4 text-center">
            Edit Transaction
          </h2>
          <form onSubmit={handleUpdateTransaction} className="grid gap-4">
            <select
              value={editTransaction.type}
              onChange={(e) =>
                setEditTransaction({ ...editTransaction, type: e.target.value })
              }
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              type="number"
              value={editTransaction.amount}
              onChange={(e) =>
                setEditTransaction({ ...editTransaction, amount: e.target.value })
              }
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
              placeholder="Amount"
              required
            />

            <input
              type="text"
              value={editTransaction.category}
              onChange={(e) =>
                setEditTransaction({ ...editTransaction, category: e.target.value })
              }
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
              placeholder="Category"
              required
            />

            <input
              type="text"
              value={editTransaction.note}
              onChange={(e) =>
                setEditTransaction({ ...editTransaction, note: e.target.value })
              }
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
              placeholder="Note"
            />

            <div className="flex gap-4 justify-center mt-4">
              <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditId(null)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default AllTransactions;
