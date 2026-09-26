import React from "react";
import { motion } from "framer-motion";

const CartoonSecurityMascot = ({ isTyping = false, isPeeking = false, size = "w-24 h-24" }) => {
  const peek = isTyping && isPeeking;
  const eyesClosed = isTyping && !isPeeking;

  return (
    <div className="flex flex-col items-center justify-center mb-3">
      <div className={`relative ${size}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none">
          {/* Ears */}
          <circle cx="26" cy="26" r="13" fill="#f59e0b" />
          <circle cx="26" cy="26" r="7" fill="#fbcfe8" />
          <circle cx="74" cy="26" r="13" fill="#f59e0b" />
          <circle cx="74" cy="26" r="7" fill="#fbcfe8" />

          {/* Head */}
          <circle cx="50" cy="52" r="36" fill="#fbbf24" />

          {/* Cheeks */}
          <circle cx="27" cy="57" r="5" fill="#f43f5e" opacity="0.35" />
          <circle cx="73" cy="57" r="5" fill="#f43f5e" opacity="0.35" />

          {/* Snout */}
          <ellipse cx="50" cy="59" rx="14" ry="10" fill="#fef3c7" />
          <path d="M46 55 Q50 59 54 55 Q50 52 46 55" fill="#78350f" />
          <path
            d="M47 58 Q50 62 53 58"
            stroke="#78350f"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Eye */}
          {eyesClosed ? (
            <path
              d="M31 44 Q36 38 41 44"
              stroke="#1e293b"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <g>
              <circle cx="36" cy="43" r="4.5" fill="#1e293b" />
              <circle cx="34.5" cy="41.5" r="1.6" fill="#ffffff" />
            </g>
          )}

          {/* Right Eye */}
          {eyesClosed ? (
            <path
              d="M59 44 Q64 38 69 44"
              stroke="#1e293b"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <g>
              <circle cx="64" cy="43" r="4.5" fill="#1e293b" />
              <circle cx="62.5" cy="41.5" r="1.6" fill="#ffffff" />
            </g>
          )}

          {/* Left Hand & Arm - Visibly covers eyes */}
          <motion.g
            animate={
              eyesClosed
                ? { y: 0, x: 0, rotate: 0 }
                : peek
                ? { y: 0, x: 0, rotate: 0 }
                : { y: 34, x: -4, rotate: -15 }
            }
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
          >
            {/* Arm */}
            <path
              d="M 18 90 Q 24 64 33 46"
              stroke="#d97706"
              strokeWidth="11"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 18 90 Q 24 64 33 46"
              stroke="#fbbf24"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Hand / Palm */}
            <ellipse
              cx="34"
              cy="42"
              rx="10"
              ry="9"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1.8"
            />
            {/* Finger Pads */}
            <circle cx="27" cy="36" r="3.2" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
            <circle cx="34" cy="33" r="3.4" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
            <circle cx="41" cy="36" r="3.2" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
            {/* Palm center pad */}
            <ellipse cx="34" cy="43" rx="4.5" ry="3.5" fill="#fef3c7" />
          </motion.g>

          {/* Right Hand & Arm - Visibly covers eyes / peeks */}
          <motion.g
            animate={
              eyesClosed
                ? { y: 0, x: 0, rotate: 0 }
                : peek
                ? { y: 16, x: 8, rotate: 25 }
                : { y: 34, x: 4, rotate: 15 }
            }
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
          >
            {/* Arm */}
            <path
              d="M 82 90 Q 76 64 67 46"
              stroke="#d97706"
              strokeWidth="11"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 82 90 Q 76 64 67 46"
              stroke="#fbbf24"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Hand / Palm */}
            <ellipse
              cx="66"
              cy="42"
              rx="10"
              ry="9"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1.8"
            />
            {/* Finger Pads */}
            <circle cx="59" cy="36" r="3.2" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
            <circle cx="66" cy="33" r="3.4" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
            <circle cx="73" cy="36" r="3.2" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
            {/* Palm center pad */}
            <ellipse cx="66" cy="43" rx="4.5" ry="3.5" fill="#fef3c7" />
          </motion.g>
        </svg>

        {/* Status badge */}
        <motion.div
          animate={{ scale: [0.95, 1], opacity: 1 }}
          key={isTyping ? "typing" : "idle"}
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-secondary/90 border border-border text-[10px] font-semibold text-muted-foreground whitespace-nowrap shadow-xs backdrop-blur-xs"
        >
          {peek ? "Peeking! 👀" : eyesClosed ? "Eyes covered! 🙈" : "All safe! 🐻"}
        </motion.div>
      </div>
    </div>
  );
};

export default CartoonSecurityMascot;
