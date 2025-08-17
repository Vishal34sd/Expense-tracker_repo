import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/token";
import ReactMarkdown from "react-markdown";

const AskChatbot = () => {
  const MAX_SEARCHES = 3;

  const [userQuestion, setUserQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  const handleSearch = async () => {
    if (!userQuestion.trim() || searchCount >= MAX_SEARCHES) return;

    setResponse("");
    setShowLoader(true);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/ask-chatbot`,
        { userQuestion },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setResponse(res.data.reply);
      setSearchCount(res.data.searchCount);
      setUserQuestion("");
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setSearchCount(MAX_SEARCHES); // mark limit reached
      } else {
        console.log(err);
      }
    } finally {
      setShowLoader(false);
    }
  };

  const TypingEffect = ({ text, speed = 300 }) => {
    const words = text.split(" ");
    const [displayedWords, setDisplayedWords] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
      setDisplayedWords([]);
      setIndex(0);
    }, [text]);

    useEffect(() => {
      if (index < words.length) {
        const timeout = setTimeout(() => {
          setDisplayedWords((prev) => [...prev, words[index]]);
          setIndex(index + 1);
        }, speed);

        return () => clearTimeout(timeout);
      }
    }, [index, words, speed]);

    return <ReactMarkdown>{displayedWords.join(" ")}</ReactMarkdown>;
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
            onChange={(e) => {
              setUserQuestion(e.target.value);
              setResponse(""); // Clear old response
            }}
            className="flex-1 p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Type your question..."
          />
          <button
            onClick={handleSearch}
            disabled={searchCount >= MAX_SEARCHES}
            className={`px-6 py-3 min-w-24 h-14 text-white font-semibold rounded-md transition-all duration-300 shadow-lg text-lg ${
              searchCount >= MAX_SEARCHES
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600"
            }`}
          >
            {showLoader ? (
              <img
                className="w-12 h-10 bg-transparent"
                src="loader-unscreen.gif"
                alt="loading"
              />
            ) : (
              "Send"
            )}
          </button>
        </div>

        {showLoader && <p className="text-yellow-300 p-3">Thinking response.....</p>}

        {response && (
          <div className="p-4 bg-gray-800 border border-gray-600 rounded-md text-white max-h-[50vh] overflow-y-auto">
            <TypingEffect key={response} text={response} speed={300} />
          </div>
        )}

        {searchCount >= MAX_SEARCHES && (
          <p className="text-red-400 mt-2">
            You have exceeded the asking limits. Try after some time.
          </p>
        )}

        <style>{`
          .cursor {
            animation: blink 1s step-start 0s infinite;
          }
          @keyframes blink {
            50% { opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AskChatbot;
