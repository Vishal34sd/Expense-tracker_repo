import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken, removeToken } from "../utils/token";
import ReactMarkdown from "react-markdown";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useNavigate } from "react-router-dom"; 
import { FaMicrophone } from "react-icons/fa";


const AskChatbot = () => {
  const MAX_SEARCHES = 3;
  const navigate = useNavigate(); // ✅ for redirecting to dashboard

  const [userQuestion, setUserQuestion] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [messages, setMessages] = useState([]);

  const handleSearch = async (question = userQuestion) => {
    if (!question.trim() || searchCount >= MAX_SEARCHES) return;

    const trimmed = question.trim();
    setMessages((prev) => [...prev, { role: "user", content: trimmed, ts: Date.now() }]);
    setShowLoader(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/ask-chatbot`,
        { userQuestion: trimmed },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const replyText = res?.data?.reply ?? "";
      setMessages((prev) => [...prev, { role: "assistant", content: replyText, ts: Date.now() }]);
      setSearchCount(res.data.searchCount ?? searchCount + 1);
      setUserQuestion("");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        removeToken();
        setMessages((prev) => [...prev, { role: "assistant", content: "Session expired. Please login again.", ts: Date.now() }]);
        navigate("/login");
        return;
      }
      if (err.response && err.response.status === 429) {
        setSearchCount(MAX_SEARCHES);
        setMessages((prev) => [...prev, { role: "assistant", content: "You have exceeded the asking limits. Try after some time.", ts: Date.now() }]);
      } else {
        const errorMessage = err?.response?.data?.error || "Something went wrong. Please try again.";
        setMessages((prev) => [...prev, { role: "assistant", content: errorMessage, ts: Date.now() }]);
      }
    } finally {
      setShowLoader(false);
    }
  };

  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    alert("Browser doesn't support speech recognition.");
  }

  useEffect(() => {
    if (transcript && transcript.trim().length > 0) {
      setUserQuestion(transcript);
    }
  }, [transcript]);

  

  // Keep the chat scrolled to the newest message
  useEffect(() => {
    const el = document.getElementById("chat-scroll");
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, showLoader]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0617] via-[#120824] to-black flex flex-col sm:flex-row items-stretch justify-center px-4 py-8 relative text-white">
      

      {/* Left Sidebar */}
      <div className="sm:w-1/4 w-full bg-purple-900/20 backdrop-blur border border-purple-500/20 shadow-lg rounded-2xl p-6 mb-6 sm:mb-0 sm:mr-6">
        <h3 className="text-2xl font-semibold text-purple-300 mb-4 text-center">
          Chat-History
        </h3>
        <div className="flex flex-col gap-3">
          {messages
            .filter((m) => m.role === "user")
            .slice(-10)
            .map((m, index) => (
            <button
              key={index}
              className="text-left text-purple-200/80 bg-purple-900/20 border border-purple-500/20 hover:border-purple-400/40 hover:text-purple-200 rounded-lg px-4 py-3 transition duration-300"
              onClick={() => setUserQuestion(m.content)}
            >
              <span className="font-semibold text-purple-300 mr-2">Q{index + 1}:</span>
              {m.content}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-purple-900/20 backdrop-blur border border-purple-500/20 shadow-xl rounded-4xl p-10 sm:p-12 flex-1 flex flex-col">
        <h2 className="text-4xl font-bold text-purple-300 mb-4 text-center">
          AI Expense Assistant
        </h2>
        <p className="text-purple-200/70 text-center mb-8 text-lg">
          Ask anything about your expenses
        </p>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => {
              setUserQuestion(e.target.value);
            }}
            className="flex-1 p-3 rounded-md bg-purple-900/20 text-white border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 h-12"
            placeholder="Type your question..."
          />
          <button
            className="bg-purple-900/30 border border-purple-500/20 w-12 rounded-full h-12 flex items-center justify-center"
            onClick={() => SpeechRecognition.startListening({ continuous: false })}
          >
            <FaMicrophone className="text-purple-400 text-lg center" />
          </button>
          <button
            onClick={() => handleSearch(userQuestion)}
            disabled={searchCount >= MAX_SEARCHES}
            className={`px-6 py-3 min-w-24 h-12 text-white font-semibold rounded-md transition-all duration-300 shadow-lg text-lg ${
              searchCount >= MAX_SEARCHES
                ? "bg-purple-900/30 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {showLoader ? (
              <img className="w-12 h-10 bg-transparent" src="loader-unscreen.gif" alt="loading" />
            ) : (
              "Send"
            )}
          </button>
        </div>

        <div
          id="chat-scroll"
          className="flex-1 min-h-[40vh] max-h-[55vh] overflow-y-auto pr-1 space-y-4"
        >
          {messages.map((m, idx) => (
            <div
              key={`${m.role}-${m.ts}-${idx}`}
              className={`w-full flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] sm:max-w-[70%] bg-purple-600 text-white px-4 py-3 rounded-2xl border border-purple-500/20"
                    : "max-w-[85%] sm:max-w-[70%] bg-purple-900/20 text-purple-100 px-4 py-3 rounded-2xl border border-purple-500/20"
                }
              >
                {m.role === "assistant" ? (
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </div>
          ))}

          {showLoader && (
            <div className="w-full flex justify-start">
              <div className="max-w-[85%] sm:max-w-[70%] bg-purple-900/20 text-purple-100 px-4 py-3 rounded-2xl border border-purple-500/20">
                Thinking…
              </div>
            </div>
          )}
        </div>

        {searchCount >= MAX_SEARCHES && (
          <p className="text-red-400 mt-2 text-center">
            You have exceeded the asking limits. Try after some time.
          </p>
        )}
      </div>

      <style>{`
        .cursor {
          animation: blink 1s step-start 0s infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AskChatbot;
