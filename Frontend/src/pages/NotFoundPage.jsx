import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Ambient background mesh */}
      <div className="ambient-glow-mesh">
        <div className="blob-1" />
        <div className="blob-2" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 bg-card/90 backdrop-blur-xl border border-border/80 shadow-2xl rounded-3xl p-8 sm:p-12 w-full max-w-md text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive mx-auto flex items-center justify-center text-2xl mb-4">
          <FaExclamationTriangle />
        </div>

        <h1 className="text-6xl sm:text-7xl font-extrabold text-foreground tracking-tighter mb-2 font-mono">
          404
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          Page Not Found
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-8 leading-relaxed">
          The destination you requested does not exist or may have been relocated.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 transition-all"
        >
          <FaArrowLeft className="text-xs" />
          <span>Return to Dashboard / Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
