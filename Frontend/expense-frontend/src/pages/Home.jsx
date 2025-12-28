import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0617] via-[#120824] to-black text-white px-6 py-10">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-md">
          Take Control of Your Spending 💸
        </h1>
        <p className="mt-4 text-lg text-white/80">
          A simple and powerful Expense Tracker helping 50+ users track, manage, and analyze their finances daily.
        </p>
      </section>

      {/* Features Section */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
        <div className="bg-purple-900/20 backdrop-blur border border-purple-500/20 rounded-xl p-6 shadow-lg hover:shadow-purple-900/40 transition">
          <h3 className="text-xl font-bold text-white">🚀 Instant Overview</h3>
          <p className="text-white/70 mt-2">Dashboard shows total spent, balance left, and budget insights.</p>
        </div>
        <div className="bg-purple-900/20 backdrop-blur border border-purple-500/20 rounded-xl p-6 shadow-lg hover:shadow-purple-900/40 transition">
          <h3 className="text-xl font-bold text-white">📈 Smart Visuals</h3>
          <p className="text-white/70 mt-2">Pie charts, category-wise breakdowns & average transaction tracking.</p>
        </div>
        <div className="bg-purple-900/20 backdrop-blur border border-purple-500/20 rounded-xl p-6 shadow-lg hover:shadow-purple-900/40 transition">
          <h3 className="text-xl font-bold text-white">🛠 Easy Management</h3>
          <p className="text-white/70 mt-2">Add, edit, or delete your income and expenses anytime.</p>
        </div>
      </section>

      {/* User Impact Section */}
      <section className="mt-24 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white">Why People Use It?</h2>
        <p className="mt-4 text-white/70">
          Whether you’re a student, freelancer, or working professional — keeping track of money is crucial.
          Our tool helps 50+ users avoid overspending, track budgets, and form smarter habits.
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-center text-white/50 text-sm">
        &copy; {new Date().getFullYear()} Expense Tracker — Built for simplicity and insight 💼
      </footer>
    </div>
  );
};

export default Home;
