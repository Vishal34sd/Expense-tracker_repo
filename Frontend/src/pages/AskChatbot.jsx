import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMicrophone,
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaHistory,
  FaArrowLeft,
  FaLightbulb,
  FaHeart,
} from "react-icons/fa";
import { useSnackbar } from "notistack";
import SideBar from "../components/SideBar";
import { UserAvatar } from "../utils/avatars.jsx";

const SUGGESTED_QUERIES = [
  "How much have I spent on food this month?",
  "What is my highest expense category?",
  "Give me suggestions to cut down expenses",
  "How is my spending behavior looking?",
  "Tips to save on food & dining out",
];

const QUICK_FOLLOWUPS = [
  "💡 Suggestions to do instead?",
  "📊 What are my top expenses?",
  "🎯 How can I budget better?",
];

const AskChatbot = () => {
  const MAX_SEARCHES = 10;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const chatScrollRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userName = storedUser?.username || "Friend";
  const userAvatarId = storedUser?.avatar || "avatar1";

  const [userQuestion, setUserQuestion] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello **${userName}**! 👋 I'm your **SmartExpense AI Assistant**.\n\nI remember your spending behavior and categories from your recorded transactions. Ask me anything about your expenses, and I'll give you clear answers along with friendly suggestions on **what to do instead** to save smarter! 💡`,
      ts: Date.now(),
    },
  ]);

  const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript && transcript.trim().length > 0) {
      setUserQuestion(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, showLoader]);

  const handleSearch = async (questionToAsk = userQuestion) => {
    const question = questionToAsk.trim();
    if (!question || searchCount >= MAX_SEARCHES || showLoader) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: question, ts: Date.now() },
    ]);
    setUserQuestion("");
    resetTranscript();
    setShowLoader(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/ask-chatbot`,
        { userQuestion: question },
        { withCredentials: true }
      );

      const replyText =
        res?.data?.reply ?? "I analyzed your data, but could not produce a response.";
      const confidence = res?.data?.confidence;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: replyText, confidence, ts: Date.now() },
      ]);
      setSearchCount((prev) => res.data.searchCount ?? prev + 1);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("userInfo");
        enqueueSnackbar("Session expired. Please log in again.", { variant: "error" });
        navigate("/login");
        return;
      }
      if (status === 429) {
        setSearchCount(MAX_SEARCHES);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "You have reached your daily AI questions limit. Please return tomorrow!",
            ts: Date.now(),
          },
        ]);
      } else {
        const errorMsg =
          err?.response?.data?.error || "An error occurred while analyzing your finances.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: errorMsg, ts: Date.now() },
        ]);
      }
    } finally {
      setShowLoader(false);
    }
  };

  const handleMicToggle = () => {
    if (!browserSupportsSpeechRecognition) {
      enqueueSnackbar("Browser does not support speech recognition.", {
        variant: "warning",
      });
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      <SideBar />

      <main className="chat-viewport flex-1 p-0 md:p-8 max-w-7xl mx-auto flex flex-col h-screen overflow-hidden">
        {/* Mobile Slim Sub-Header (ChatGPT Style) */}
        <div className="flex md:hidden items-center justify-between px-4 py-2 border-b border-border/50 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs shadow-2xs">
              <FaRobot />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>SmartExpense AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-muted-foreground leading-none">
                Personalized for {userName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full border border-border/50">
              {MAX_SEARCHES - searchCount}/{MAX_SEARCHES} queries
            </span>
          </div>
        </div>

        {/* Desktop Top Header */}
        <div className="hidden md:flex items-center justify-between pb-4 border-b border-border/60 shrink-0 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg shadow-xs">
              <FaRobot />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
                <span>AI Financial Assistant</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                  Personalized
                </span>
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span>Personalized for <strong className="text-foreground">{userName}</strong></span>
                <span>•</span>
                <span className="text-emerald-500 font-medium">Remembering your spending habits</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-muted-foreground font-mono">
              Daily Limit: {searchCount}/{MAX_SEARCHES}
            </span>
          </div>
        </div>

        {/* Chat Layout: History drawer (desktop) + Chat conversation window */}
        <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
          {/* Recent Query History Sidebar (Desktop) */}
          <div className="hidden lg:flex flex-col w-72 shrink-0 bg-card border border-border/80 rounded-3xl p-5 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <FaHistory />
              <span>Question History</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {messages.filter((m) => m.role === "user").length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-8">
                  Your submitted questions will appear here for rapid re-querying.
                </div>
              ) : (
                messages
                  .filter((m) => m.role === "user")
                  .map((m, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(m.content)}
                      className="w-full text-left text-xs font-medium text-foreground/80 hover:text-primary p-3 rounded-xl bg-secondary/30 border border-border/60 hover:border-primary/40 hover:bg-secondary/60 transition line-clamp-2 cursor-pointer"
                    >
                      {m.content}
                    </button>
                  ))
              )}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="pt-4 border-t border-border/60 mt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary mb-2">
                <FaLightbulb className="text-amber-400" />
                <span>Quick Prompts</span>
              </div>
              <div className="space-y-1.5">
                {SUGGESTED_QUERIES.map((query, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(query)}
                    className="w-full text-left text-[11px] text-muted-foreground hover:text-foreground p-2 rounded-lg bg-secondary/20 hover:bg-secondary border border-border/40 transition truncate cursor-pointer"
                  >
                    "{query}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Conversation Container */}
          <div className="flex-1 flex flex-col bg-transparent md:bg-card md:border md:border-border/80 md:rounded-3xl md:shadow-sm overflow-hidden min-h-0">
            {/* Messages Scroll Area */}
            <div
              ref={chatScrollRef}
              className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-3.5 flex flex-col"
            >
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2.5 sm:gap-3 ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    } ${messages.length <= 1 ? "my-auto" : ""}`}
                  >
                    {/* Avatar */}
                    {isUser ? (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 shadow-xs border border-primary/30 mt-0.5">
                        <UserAvatar id={userAvatarId} className="w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/15 text-primary border border-primary/25 flex items-center justify-center shrink-0 text-xs shadow-xs mt-0.5">
                        <FaRobot />
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={`max-w-[90%] sm:max-w-xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs break-words ${
                        isUser
                          ? "bg-primary text-primary-foreground rounded-tr-xs"
                          : "bg-secondary/40 text-foreground border border-border/70 rounded-tl-xs"
                      }`}
                    >
                      <ReactMarkdown
                        components={{
                          p: ({ node: _node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          strong: ({ node: _node, ...props }) => <strong className="font-extrabold text-foreground" {...props} />,
                          ul: ({ node: _node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                          ol: ({ node: _node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                          li: ({ node: _node, ...props }) => <li className="text-xs sm:text-sm" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>

                      {msg.confidence && (
                        <div className="mt-2 text-[10px] text-muted-foreground/80 font-mono">
                          Confidence score: {Math.round(msg.confidence * 100)}%
                        </div>
                      )}

                      {/* Interactive follow-up suggestions under latest assistant response (desktop only, hidden on mobile for cleaner chat) */}
                      {index === messages.length - 1 && !isUser && (
                        <div className="hidden md:flex mt-2.5 pt-2 border-t border-border/40 items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                          <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 shrink-0 mr-0.5">
                            <FaLightbulb className="text-amber-400" />
                            <span>Ask:</span>
                          </span>
                          {QUICK_FOLLOWUPS.map((q, qi) => (
                            <button
                              key={qi}
                              onClick={() => handleSearch(q.replace(/^[^a-zA-Z0-9]+/, ""))}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-card hover:bg-secondary border border-border/70 text-foreground/80 hover:text-foreground transition cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing / Loading indicator */}
              {showLoader && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary text-secondary-foreground border border-border flex items-center justify-center text-xs">
                    <FaRobot />
                  </div>
                  <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-secondary/40 border border-border/70 rounded-tl-xs flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                    <span className="text-xs text-muted-foreground ml-2 font-medium">
                      Co-Pilot is thinking...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar (ChatGPT Style Pill) */}
            <div className="p-2.5 sm:p-4 border-t border-border/50 bg-background/80 md:bg-card/60 backdrop-blur-md shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="flex items-center gap-1.5 sm:gap-2 bg-secondary/40 border border-border/80 rounded-full p-1 sm:p-1.5 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/50 transition-all shadow-xs"
              >
                {/* Speech mic toggle */}
                <button
                  type="button"
                  onClick={handleMicToggle}
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    listening
                      ? "bg-destructive text-destructive-foreground animate-pulse"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                  title={listening ? "Listening... click to stop" : "Voice input"}
                >
                  <FaMicrophone className={`text-xs ${listening ? "animate-spin" : ""}`} />
                </button>

                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  disabled={showLoader || searchCount >= MAX_SEARCHES}
                  placeholder={
                    searchCount >= MAX_SEARCHES
                      ? "Daily question limit reached."
                      : "Ask about your transactions, totals..."
                  }
                  className="flex-1 bg-transparent px-2.5 text-xs sm:text-sm text-foreground placeholder-muted-foreground/60 focus:outline-none disabled:opacity-50"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!userQuestion.trim() || showLoader || searchCount >= MAX_SEARCHES}
                  className="w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center shadow-xs shrink-0 disabled:opacity-30 transition cursor-pointer"
                  title="Send message"
                >
                  <FaPaperPlane className="text-xs -translate-x-0.5" />
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AskChatbot;
