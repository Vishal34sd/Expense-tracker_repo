import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../utils/token";

const AskChatbot = () => {
  const [userQuestion, setUserQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [showLoader , setShowLoader] = useState(false);

  const handleSearch = async () => {
    if (!userQuestion.trim()) return;
    setResponse("");
    setShowLoader(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/ask-chatbot",
        { userQuestion },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log(res.data.answer);
      setResponse(res.data.answer);
      setUserQuestion("");
      setShowLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 shadow-xl rounded-2xl p-10 sm:p-12 w-full max-w-3xl flex flex-col">
        <h2 className="text-4xl font-bold text-yellow-400 mb-4 text-center">
          AI Expense Assistant
        </h2>
        <p className="text-gray-400 text-center mb-8 text-lg">
          Ask anything about your expenses
        </p>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            className="flex-1 p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Type your question..."
          />
          <button
            className="px-6 py-3 min-w-24 h-14 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md transition-all duration-300 shadow-lg text-lg"
            onClick={handleSearch}
          >
            {showLoader? <img className="w-12 h-10 bg-transparent" src="loader-unscreen.gif"></img>:"Send"}
          </button>
        </div>
        {showLoader?<p className ="text-yellow-300 p-3">Thinking response.....</p>:null}

        {response && (
          <div className="p-4 bg-gray-800 border border-gray-600 rounded-md text-white max-h-[50vh] overflow-y-auto">
            {response}
          </div>
        )}
      </div>
    </div>
  );
};

export default AskChatbot;
