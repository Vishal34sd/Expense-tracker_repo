import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-teal-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8">
          The page you’re looking for doesn’t exist or might have been moved.
        </p>

        <Link
          to="/"
          className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2.5 rounded-md transition-all duration-300 shadow-lg"
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
