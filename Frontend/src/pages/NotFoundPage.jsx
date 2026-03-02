import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0617] via-[#120824] to-black flex items-center justify-center px-4 text-white">
      <div className="bg-purple-900/20 backdrop-blur border border-purple-500/20 shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-white/70 mb-8">
          The page you’re looking for doesn’t exist or might have been moved.
        </p>

        <Link
          to="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-md transition-all duration-300 shadow-lg"
        >
          Go Back Home
        </Link>

        <div className="mt-8">
          <img
            src="/not-found.png"
            alt="Not Found"
            className="w-48 h-48 mx-auto opacity-80"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
