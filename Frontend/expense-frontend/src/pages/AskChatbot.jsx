import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getToken } from "../utils/token";
import ReactMarkdown from "react-markdown";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const AskChatbot = () => {
  const MAX_SEARCHES = 6;

  const [userQuestion, setUserQuestion] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [previousQuestions, setPreviousQuestions] = useState([]);

  const chatEndRef = useRef(null);

  const ShimmerBubble = () => (
    <div className="space-y-2">
      <div className="h-3 w-28 bg-gray-700 rounded-md animate-pulse"></div>
      <div className="h-3 w-44 bg-gray-700 rounded-md animate-pulse"></div>
      <div className="h-3 w-32 bg-gray-700 rounded-md animate-pulse"></div>
    </div>
  );

  const handleSearch = async (question = userQuestion) => {
    if (!question.trim() || searchCount >= MAX_SEARCHES) return;

    setUserQuestion("");

    setPreviousQuestions((prev) => [
      ...prev,
      { question, answer: null, loading: true },
    ]);

    setShowLoader(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/ask-chatbot`,
        { userQuestion: question },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      const botReply = res.data.reply;
      setSearchCount(res.data.searchCount ?? searchCount);

      setPreviousQuestions((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].answer = botReply;
        updated[updated.length - 1].loading = false;
        return updated;
      });

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/save-chat`,
        { question, answer: botReply },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
    } catch (err) {
      if (err.response?.status === 429) setSearchCount(MAX_SEARCHES);
    } finally {
      setShowLoader(false);
    }
  };

  const { transcript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript.trim().length > 0) setUserQuestion(transcript);
  }, [transcript]);

  const fetchPreviousQuestions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat-history`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      const history = res.data?.data || res.data;
      if (Array.isArray(history)) {
        setPreviousQuestions(history.filter((item) => item.answer));
      }
    } catch {}
  };

  useEffect(() => {
    fetchPreviousQuestions();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [previousQuestions]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col sm:flex-row px-4 py-6 relative">

      <div className="sm:w-1/4 bg-gray-900 border border-gray-700 rounded-2xl p-5 mb-6 sm:mr-6">
        <h3 className="text-xl font-semibold text-yellow-400 text-center mb-4">
          Frequently Asked
        </h3>

        <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto">
          {previousQuestions.map((faq, index) => (
            <button
              key={index}
              onClick={() => setUserQuestion(faq.question)}
              className="bg-gray-800 text-gray-300 border border-gray-700 hover:border-yellow-400 rounded-lg px-4 py-3"
            >
              <span className="font-semibold text-yellow-400">
                Q{index + 1}:
              </span>{" "}
              {faq.question}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col">

        <h2 className="text-4xl font-bold text-yellow-400 text-center">
          AI Expense Assistant
        </h2>
        <p className="text-gray-300 text-center text-xl mb-3 mt-3">
          Ask anything related to your expense
        </p>

        <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-2">
          {previousQuestions.map((chat, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-end">
                <div className="max-w-[70%] bg-teal-600 text-white px-4 py-2 rounded-2xl shadow">
                  {chat.question}
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-[75%] bg-gray-800 text-white border border-gray-600 px-4 py-3 rounded-2xl shadow">
                  {chat.loading ? (
                    <ShimmerBubble />
                  ) : (
                    <ReactMarkdown>{chat.answer}</ReactMarkdown>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}

          <div ref={chatEndRef}></div>
        </div>

        {previousQuestions.length === 0 ? (
          <div className="flex justify-center items-center h-[40vh]">
            <div className="relative w-[60%]">
              {searchCount >= MAX_SEARCHES && (
                <p className="text-red-500 text-center font-semibold mb-2">
                  Limit reached! Try again after some time.
                </p>
              )}

              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Ask your first question..."
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full p-3 pl-5 pr-28 bg-gray-800 text-white border border-gray-600 rounded-full"
              />

              <button
                onClick={() =>
                  SpeechRecognition.startListening({ continuous: false })
                }
                className="absolute right-16 top-1/2 -translate-y-1/2 bg-amber-300 h-10 w-10 rounded-full flex items-center justify-center shadow"
              >
                <img src="new_mic.png" className="w-5 h-5" alt="mic" />
              </button>

              <button
                onClick={() => handleSearch()}
                disabled={searchCount >= MAX_SEARCHES}
                className={`absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full flex items-center justify-center shadow ${
                  searchCount >= MAX_SEARCHES
                    ? "bg-gray-500"
                    : "bg-teal-500 hover:bg-teal-600"
                }`}
              >
                {showLoader ? (
                  <img
                    className="w-10 h-10"
                    src="loader-unscreen.gif"
                    alt="loading"
                  />
                ) : (
                  <img src="send.png" className="w-6 h-6" alt="send" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
            {searchCount >= MAX_SEARCHES && (
              <p className="text-red-500 text-center font-semibold mb-2">
                Limit reached! Try again after some time.
              </p>
            )}

            <div className="mt-3 relative w-full">
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Type your question..."
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full p-3 pl-5 pr-28 bg-gray-800 text-white border border-gray-600 rounded-full"
              />

              <button
                onClick={() =>
                  SpeechRecognition.startListening({ continuous: false })
                }
                className="absolute right-16 top-1/2 -translate-y-1/2 bg-amber-300 h-10 w-10 rounded-full flex items-center justify-center shadow"
              >
                <img src="new_mic.png" className="w-5 h-5" alt="mic" />
              </button>

              <button
                onClick={() => handleSearch()}
                disabled={searchCount >= MAX_SEARCHES}
                className={`absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full flex items-center justify-center  shadow ${
                  searchCount >= MAX_SEARCHES
                    ? "bg-gray-500"
                    : "bg-teal-500 hover:bg-teal-600"
                }`}
              >
                {showLoader ? (
                  <img
                    className="w-10 h-10"
                    src="loader-unscreen.gif"
                    alt="loading"
                  />
                ) : (
                  <img src="send.png" className="w-6 h-6" alt="send" />
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AskChatbot;
