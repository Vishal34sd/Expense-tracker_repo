import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import SideBar from "../components/SideBar";
import { confirmDelete } from "../utils/alerts";

const ITEMS_PER_PAGE = 10;

const AllTransactions = () => {
  const [transaction, setTransaction] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Pagination states
  const [page, setPage] = useState(1);
  const [mobileLimit, setMobileLimit] = useState(5);

  // Edit modal state
  const [editId, setEditId] = useState(null);
  const [editTransaction, setEditTransaction] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/get?search=${encodeURIComponent(
          searchTerm
        )}&type=${filterType}`,
        { withCredentials: true }
      );

      const data = res.data.data || [];
      setTransaction(data);
    } catch (_err) {
      enqueueSnackbar("Failed to fetch transactions.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterType, enqueueSnackbar]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Reset to page 1 and mobileLimit 5 whenever search or filter type changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setMobileLimit(5);
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setPage(1);
    setMobileLimit(5);
  };

  const handleEditButton = (item) => {
    setEditId(item._id);
    setEditTransaction({
      type: item.type,
      amount: item.amount,
      category: item.category,
      note: item.note || "",
    });
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/edit/${editId}`,
        editTransaction,
        { withCredentials: true }
      );

      setEditId(null);
      enqueueSnackbar("Transaction updated successfully.", {
        variant: "success",
      });
      fetchTransactions();
    } catch (_err) {
      enqueueSnackbar("Could not update transaction.", { variant: "error" });
    }
  };

  const handleDelete = async (item) => {
    const isConfirmed = await confirmDelete({
      title: "Delete Transaction?",
      html: `Are you sure you want to delete <b style="color: inherit;">"${item.title || "this entry"}"</b> (₹${Number(item.amount || 0).toLocaleString()})?<br/><span style="opacity: 0.75; font-size: 12px; display: inline-block; margin-top: 4px;">This action cannot be undone.</span>`,
      confirmButtonText: "Yes, Delete It",
    });

    if (!isConfirmed) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/delete/${item._id}`,
        { withCredentials: true }
      );
      enqueueSnackbar("Transaction deleted.", { variant: "info" });
      fetchTransactions();
    } catch (_err) {
      enqueueSnackbar("Could not delete transaction.", { variant: "error" });
    }
  };

  const totalRecords = transaction.length;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE) || 1;
  const startRecord = totalRecords > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endRecord = Math.min(page * ITEMS_PER_PAGE, totalRecords);

  const desktopTransactions = transaction.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const mobileTransactions = transaction.slice(0, mobileLimit);

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      <SideBar />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              <span>Financial Ledger</span>
              <span>•</span>
              <span className="text-muted-foreground">
                {totalRecords} Total Records
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              All Transactions
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Review, filter, edit, or delete your logged transactions.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-card border border-border/80 rounded-3xl p-4 sm:p-5 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
            <input
              type="text"
              placeholder="Search category or note..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-secondary/30 border border-border/70 rounded-xl text-sm text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/50 border border-border/60 w-full sm:w-auto justify-center">
            {["all", "expense", "income"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleFilterTypeChange(type)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filterType === type
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="bg-card border border-border rounded-3xl p-12 text-center text-muted-foreground animate-pulse">
            Loading transaction ledger…
          </div>
        ) : transaction.length === 0 ? (
          <div className="bg-card border border-border/80 rounded-3xl p-10 text-center shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-primary text-xl mb-4">
              <FaFilter />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {searchTerm || filterType !== "all"
                ? "No matching records found"
                : "No transactions recorded yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search criteria or resetting filters."
                : "Start logging your daily expenses or incoming funds to monitor your balance."}
            </p>
            {searchTerm || filterType !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setPage(1);
                }}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-2xl font-bold text-sm border border-border"
              >
                Reset Filters
              </button>
            ) : (
              <Link
                to="/add"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
              >
                <FaPlus className="text-xs" />
                <span>Add Your First Entry</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border/80 rounded-3xl shadow-md overflow-hidden">
            {/* Mobile Card View (< sm: 320px - 639px) */}
            <div className="sm:hidden p-3.5 space-y-3">
              {mobileTransactions.map((txn, index) => {
                const isIncome = txn.type.toLowerCase() === "income";
                const displayIndex = index + 1;

                return (
                  <motion.div
                    key={txn._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-secondary/25 border border-border/70 flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                          #{displayIndex}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isIncome
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-destructive/10 text-destructive border border-destructive/20"
                          }`}
                        >
                          {txn.type}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {txn.createdAt || txn.date
                          ? new Date(
                              txn.createdAt || txn.date
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground text-sm truncate">
                          {txn.category}
                        </p>
                        {txn.note && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {txn.note}
                          </p>
                        )}
                      </div>
                      <div
                        className={`text-base font-extrabold shrink-0 ${
                          isIncome
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-destructive"
                        }`}
                      >
                        {isIncome ? "+" : "-"}₹{" "}
                        {Number(txn.amount).toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                      <button
                        onClick={() => handleEditButton(txn)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground border border-border/70 text-xs font-medium transition cursor-pointer"
                      >
                        <FaEdit className="text-[10px]" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(txn)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/20 text-xs font-medium transition cursor-pointer"
                      >
                        <FaTrash className="text-[10px]" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              {/* Show More Button (Mobile View only) */}
              {mobileLimit < transaction.length && (
                <div className="pt-2 text-center">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setMobileLimit((prev) => prev + 10)}
                    className="w-full py-3 px-4 rounded-2xl bg-secondary/80 hover:bg-secondary text-foreground border border-border/80 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Show More</span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      ({Math.min(10, transaction.length - mobileLimit)} more of {transaction.length})
                    </span>
                    <FaChevronDown className="text-xs text-primary" />
                  </motion.button>
                </div>
              )}

              {transaction.length > 5 && mobileLimit >= transaction.length && (
                <div className="py-2.5 text-center text-xs text-muted-foreground font-medium">
                  All {transaction.length} records loaded ✓
                </div>
              )}
            </div>

            {/* Desktop Table View (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full text-sm text-foreground">
                <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground uppercase text-xs font-semibold">
                  <tr>
                    <th className="p-4 text-left">#</th>
                    <th className="p-4 text-left">Type</th>
                    <th className="p-4 text-left">Amount</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Note</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {desktopTransactions.map((txn, index) => {
                    const isIncome = txn.type.toLowerCase() === "income";
                    const displayIndex = (page - 1) * ITEMS_PER_PAGE + index + 1;

                    return (
                      <motion.tr
                        key={txn._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-secondary/25 transition-colors"
                      >
                        <td className="p-4 text-muted-foreground font-mono text-xs">
                          {displayIndex}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                              isIncome
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-destructive/10 text-destructive border border-destructive/20"
                            }`}
                          >
                            {txn.type}
                          </span>
                        </td>
                        <td className="p-4 font-extrabold text-sm sm:text-base">
                          <span
                            className={
                              isIncome
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-destructive"
                            }
                          >
                            {isIncome ? "+" : "-"}₹{" "}
                            {Number(txn.amount).toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-foreground">
                          {txn.category}
                        </td>
                        <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">
                          {txn.note || "—"}
                        </td>
                        <td className="p-4 text-xs text-muted-foreground font-mono">
                          {txn.createdAt || txn.date
                            ? new Date(
                                txn.createdAt || txn.date
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleEditButton(txn)}
                              className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground border border-border/70 transition-all text-xs"
                              title="Edit entry"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(txn)}
                              className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/20 transition-all text-xs"
                              title="Delete entry"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Desktop Pagination Controls Section */}
            {totalRecords > ITEMS_PER_PAGE && (
              <div className="hidden sm:flex p-3.5 sm:p-5 border-t border-border/60 bg-secondary/20 flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                {/* Record counter indicator */}
                <div className="text-xs text-muted-foreground font-medium text-center sm:text-left">
                  Showing{" "}
                  <span className="font-bold text-foreground">
                    {startRecord}–{endRecord}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-foreground">
                    {totalRecords}
                  </span>{" "}
                  transactions
                </div>

                {/* Next / Prev and Page Indicator */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                  {/* Previous Button */}
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold border border-border bg-card text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
                  >
                    <FaChevronLeft className="text-[10px]" />
                    <span>Previous</span>
                  </button>

                  {/* Page numbers display */}
                  <div className="px-3 py-1.5 rounded-xl bg-secondary text-xs font-semibold text-foreground border border-border/70 font-mono">
                    {page} / {totalPages}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page >= totalPages}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold border border-border bg-card text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
                  >
                    <span>Next</span>
                    <FaChevronRight className="text-[10px]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal Dialog */}
        <AnimatePresence>
          {editId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-card border border-border rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto my-auto"
              >
                <button
                  onClick={() => setEditId(null)}
                  className="absolute right-5 top-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                >
                  <FaTimes />
                </button>

                <h3 className="text-xl font-bold text-foreground mb-1">
                  Edit Transaction
                </h3>
                <p className="text-xs text-muted-foreground mb-5">
                  Update amount, category, or notes
                </p>

                <form onSubmit={handleUpdateTransaction} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">
                      Type
                    </label>
                    <select
                      value={editTransaction.type}
                      onChange={(e) =>
                        setEditTransaction({
                          ...editTransaction,
                          type: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/30 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={editTransaction.amount}
                      onChange={(e) =>
                        setEditTransaction({
                          ...editTransaction,
                          amount: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/30 border border-border text-foreground text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editTransaction.category}
                      onChange={(e) =>
                        setEditTransaction({
                          ...editTransaction,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/30 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">
                      Note
                    </label>
                    <input
                      type="text"
                      value={editTransaction.note}
                      onChange={(e) =>
                        setEditTransaction({
                          ...editTransaction,
                          note: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/30 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground text-sm font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold shadow-md shadow-primary/20 transition"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AllTransactions;
