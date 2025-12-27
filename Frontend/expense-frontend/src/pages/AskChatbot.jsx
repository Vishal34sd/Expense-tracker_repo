import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/token";
import ReactMarkdown from "react-markdown";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useNavigate } from "react-router-dom"; // ✅ import navigation hook

const AskChatbot = () => {
  const MAX_SEARCHES = 3;
  const navigate = useNavigate(); // ✅ for redirecting to dashboard

  const [userQuestion, setUserQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [previousQuestions, setPreviousQuestions] = useState([]);

  const handleSearch = async (question = userQuestion) => {
    if (!question.trim() || searchCount >= MAX_SEARCHES) return;

    setResponse("");
    setShowLoader(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/ask-chatbot`,
        { userQuestion: question },
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
        setSearchCount(MAX_SEARCHES);
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

  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    alert("Browser doesn't support speech recognition.");
  }

  useEffect(() => {
    if (transcript && transcript.trim().length > 0) {
      setUserQuestion(transcript);
    }
  }, [transcript]);

  // 🟡 Fetch chat history
  const fetchPreviousQuestions = async () => {
    try {
      const chatResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat-history`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setPreviousQuestions(chatResponse.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPreviousQuestions();
  }, []);

  useEffect(() => {
    if (response) {
      fetchPreviousQuestions();
    }
  }, [response]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0617] via-[#120824] to-black flex flex-col sm:flex-row items-stretch justify-center px-4 py-8 relative text-white">
      {/* 🔹 Dashboard Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-12 right-9 bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-lg shadow-lg border border-purple-500/20 transition-all duration-300"
      >
        Dashboard
      </button>

      {/* Left Sidebar */}
      <div className="sm:w-1/4 w-full bg-purple-900/20 backdrop-blur border border-purple-500/20 shadow-lg rounded-2xl p-6 mb-6 sm:mb-0 sm:mr-6">
        <h3 className="text-2xl font-semibold text-purple-300 mb-4 text-center">
          Frequently Asked
        </h3>
        <div className="flex flex-col gap-3">
          {previousQuestions.map((faq, index) => (
            <button
              key={index}
              className="text-left text-purple-200/80 bg-purple-900/20 border border-purple-500/20 hover:border-purple-400/40 hover:text-purple-200 rounded-lg px-4 py-3 transition duration-300"
            >
              <span className="font-semibold text-purple-300 mr-2">Q{index + 1}:</span>
              {faq.question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-purple-900/20 backdrop-blur border border-purple-500/20 shadow-xl rounded-2xl p-10 sm:p-12 flex-1 flex flex-col">
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
              setResponse("");
            }}
            className="flex-1 p-3 rounded-md bg-purple-900/20 text-white border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40 h-12"
            placeholder="Type your question..."
          />
          <button
            className="bg-purple-900/30 border border-purple-500/20 w-20 rounded-lg h-12"
            onClick={() => SpeechRecognition.startListening({ continuous: false })}
          >
            <img className="w-10 h-10 bg-transparent mx-auto" src="new_mic.png" alt="mic" />
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

        {showLoader && <p className="text-purple-200/80 p-3">Thinking response.....</p>}

        {response && (
          <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-md text-white max-h-[50vh] overflow-y-auto">
            <TypingEffect key={response} text={response} speed={300} />
          </div>
        )}

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
