import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 py-10">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-teal-400 drop-shadow-md">
          Take Control of Your Spending 💸
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          A simple and powerful Expense Tracker helping 50+ users track, manage, and analyze their finances daily.
        </p>
      </section>

      {/* Features Section */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
        <div className="bg-gray-900 rounded-xl p-6 shadow hover:shadow-xl transition">
          <h3 className="text-xl font-bold text-teal-300">🚀 Instant Overview</h3>
          <p className="text-gray-400 mt-2">Dashboard shows total spent, balance left, and budget insights.</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 shadow hover:shadow-xl transition">
          <h3 className="text-xl font-bold text-teal-300">📈 Smart Visuals</h3>
          <p className="text-gray-400 mt-2">Pie charts, category-wise breakdowns & average transaction tracking.</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 shadow hover:shadow-xl transition">
          <h3 className="text-xl font-bold text-teal-300">🛠 Easy Management</h3>
          <p className="text-gray-400 mt-2">Add, edit, or delete your income and expenses anytime.</p>
        </div>
      </section>

      {/* User Impact Section */}
      <section className="mt-24 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white">Why People Use It?</h2>
        <p className="mt-4 text-gray-400">
          Whether you’re a student, freelancer, or working professional — keeping track of money is crucial.
          Our tool helps 50+ users avoid overspending, track budgets, and form smarter habits.
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Expense Tracker — Built for simplicity and insight 💼
      </footer>
    </div>
  );
};

export default Home;
