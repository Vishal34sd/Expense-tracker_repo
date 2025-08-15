import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { decodeToken, getToken } from "../utils/token.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(ArcElement, Tooltip, Legend);

const ViewSummary = () => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(10000);
  const [totalSpent, setTotalSpent] = useState(0);
  const [percentSpent, setPercentSpent] = useState(0);
  const [mostSpentCategory, setMostSpentCategory] = useState(["N/A", 0]);
  const [averageExpense, setAverageExpense] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [pieData, setPieData] = useState({});
  const summaryRef = useRef();
  
  const userInfo = decodeToken(getToken());
  const username = userInfo.username ;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/get`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = res.data.data;
      setTransactions(data);
      processSummary(data);
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  const processSummary = (data) => {
    const expenseTxns = data.filter(txn => txn.type === "expense");
    const spent = expenseTxns.reduce((acc, txn) => acc + txn.amount, 0);
    setTotalSpent(spent);
    setPercentSpent(((spent / budget) * 100).toFixed(1));
    setAverageExpense(expenseTxns.length > 0 ? (spent / expenseTxns.length).toFixed(2) : 0);

    const categoryTotals = {};
    expenseTxns.forEach(txn => {
      const cat = txn.category.toLowerCase();
      categoryTotals[cat] = (categoryTotals[cat] || 0) + txn.amount;
    });
    setCategoryData(categoryTotals);

    const maxCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    setMostSpentCategory(maxCategory || ["N/A", 0]);

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);
    const colors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#f472b6"];
    setPieData({
      labels: labels,
      datasets: [{ data: values, backgroundColor: colors.slice(0, labels.length), borderWidth: 1 }]
    });
  };

  const downloadPDF = () => {
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString();
    const timeString = currentDate.toLocaleTimeString();

    const input = summaryRef.current;
    html2canvas(input, { scale: 2, backgroundColor: "#1f2937" })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 195;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;


        pdf.addImage(imgData, "PNG", 7, 7, imgWidth, imgHeight);


        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        const footerX = 10;
        const footerY = pageHeight - 30;
        pdf.text(`Downloaded by: ${username}`, footerX, footerY);
        pdf.text(`Date: ${dateString}`, footerX, footerY + 6);
        pdf.text(`Time: ${timeString}`, footerX, footerY + 12);

        pdf.save(`Expense-Summary-${username}.pdf`);
      });
  };

  return (
    <div className="min-h-screen py-10 px-6 md:px-20" style={{ backgroundColor: "#111827", color: "#f9fafb" }}>
      <div ref={summaryRef} className="p-6 rounded-2xl shadow-xl max-w-6xl mx-auto" style={{ backgroundColor: "#1f2937" }}>
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "#14b8a6" }}>📊 Expense Summary</h2>
        <div className="flex justify-end mb-6">
          <button
            onClick={downloadPDF}
            style={{ backgroundColor: "#facc15", color: "#1f2937" }}
            className="px-4 py-2 rounded-md font-bold"
          >
            Download Summary
          </button>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div style={{ backgroundColor: "#111827" }} className="p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">💼 Monthly Budget</h3>
            <p>Budget: ₹{budget}</p>
            <p>Spent: ₹{totalSpent}</p>
            <p style={{ color: "#10b981" }} className="mt-1 font-bold">{percentSpent}% used</p>
          </div>

          <div style={{ backgroundColor: "#111827" }} className="p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">🔥 Most Spent Category</h3>
            <p>Category: <span className="capitalize">{mostSpentCategory[0]}</span></p>
            <p>Amount: ₹{mostSpentCategory[1]}</p>
          </div>

          <div style={{ backgroundColor: "#111827" }} className="p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">📈 Average Per Transaction</h3>
            <p>₹{averageExpense}</p>
            <p style={{ color: "#d1d5db" }} className="text-sm">
              Across {transactions.filter(t => t.type === "expense").length} expenses
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div style={{ backgroundColor: "#111827" }} className="p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">📂 Category Distribution</h3>
            {Object.keys(categoryData).length > 0 ? <Pie data={pieData} /> : <p style={{ color: "#d1d5db" }}>No data available</p>}
          </div>

          <div style={{ backgroundColor: "#111827" }} className="p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">🔍 Breakdown by Category</h3>
            <div className="space-y-3">
              {Object.entries(categoryData).map(([category, amount], idx) => (
                <div key={idx} className="flex justify-between px-4 py-2 rounded-lg" style={{ backgroundColor: "#1f2937" }}>
                  <span className="capitalize">{category}</span>
                  <span style={{ color: "#10b981", fontWeight: "600" }}>₹{amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 rounded-xl" style={{ backgroundColor: "#111827" }}>
          <h3 className="text-2xl font-bold mb-4" style={{ color: "#facc15" }}>🧠 Smart Spending Insights</h3>
          <div className="space-y-4">
            {Object.entries(categoryData)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([category, amount], idx) => {
                let label = "";
                if (amount > 0.5 * totalSpent) label = "💰 High Spending";
                else if (amount > 0.3 * totalSpent) label = "⚠️ Be Careful";
                else label = "✅ Balanced";
                return (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: "#1f2937" }}>
                    <div>
                      <p className="capitalize text-lg font-semibold">{category}</p>
                      <p style={{ color: "#d1d5db" }}>Spent ₹{amount}</p>
                    </div>
                    <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "#111827" }}>{label}</span>
                  </div>
                );
              })}
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: "#1f2937" }}>
            <h4 className="text-lg font-semibold mb-2">💡 Spending Tip</h4>
            <p style={{ color: "#d1d5db" }}>
              {totalSpent > budget
                ? "You've crossed your monthly budget. Consider limiting non-essential expenses like shopping or food deliveries."
                : totalSpent > 0.75 * budget
                  ? "You're close to hitting your budget. Monitor your spending carefully in the coming days."
                  : "You're managing your budget well. Keep tracking regularly!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSummary;
