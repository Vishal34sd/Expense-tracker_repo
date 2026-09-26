import Transaction from "../model/transactionSchema.js";
import { ingestTransaction } from "../rag/ingest.js";
import { deleteChunksForTransaction } from "../rag/store.js";
import { getCache, setCache, clearCachePattern } from "../utils/redis.js";

// Fetch transactions with pagination, filtering, and Redis caching
const getAllTransaction = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const search = req.query.search ? req.query.search.trim() : null;
    const type = req.query.type && req.query.type !== "all" ? req.query.type : null;

    // Cache key specific to user, pagination, search, and type
    const cacheKey = `transactions:${userId}:p_${page || "all"}:l_${limit || "all"}:s_${search || "none"}:t_${type || "all"}`;

    // 1. Check Redis cache
    try {
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        return res.status(200).json(cachedData);
      }
    } catch (cacheErr) {
      console.error("Cache read error:", cacheErr.message);
    }

    // Build database query
    const filter = { userId };
    if (type) {
      filter.type = type;
    }
    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
      ];
    }

    // 2. Fetch from Database
    let allTransaction;
    let pagination = null;

    if (page && limit) {
      const skip = (page - 1) * limit;
      const total = await Transaction.countDocuments(filter);
      allTransaction = await Transaction.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      pagination = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    } else {
      allTransaction = await Transaction.find(filter).sort({
        date: -1,
        createdAt: -1,
      });
    }

    const responseData = {
      success: true,
      message:
        allTransaction.length > 0
          ? "All data fetched successfully"
          : "No record found",
      data: allTransaction,
      pagination,
    };

    // 3. Save to Redis cache for 5 minutes
    try {
      await setCache(cacheKey, responseData, 300);
    } catch (cacheErr) {
      console.error("Cache write error:", cacheErr.message);
    }

    return res.status(200).json(responseData);
  } catch (err) {
    console.error("Error in getAllTransaction:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

// Add new transaction and invalidate Redis cache
const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, note } = req.body;

    if (!type || amount === undefined || amount === null || !category) {
      return res.status(400).json({
        success: false,
        message: "Type, amount, and category are required",
      });
    }

    const newTransaction = new Transaction({
      userId: req.userInfo.userId,
      type,
      amount: Number(amount),
      category,
      note: note || "",
    });
    await newTransaction.save();

    // Invalidate Redis cache for this user
    try {
      await clearCachePattern(`transactions:${req.userInfo.userId}:*`);
    } catch (cacheErr) {
      console.error("Cache clear error:", cacheErr.message);
    }

    // Ingest into vector DB asynchronously
    ingestTransaction(newTransaction).catch((ingestErr) => {
      console.error("Vector ingest error:", ingestErr?.message || ingestErr);
    });

    return res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      data: newTransaction,
    });
  } catch (err) {
    console.error("Error in addTransaction:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

// Edit existing transaction and invalidate Redis cache
const editTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const newData = req.body;

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId: req.userInfo.userId },
      newData,
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(400).json({
        success: false,
        message: "Transaction not found or not updated",
      });
    }

    // Invalidate Redis cache for this user
    try {
      await clearCachePattern(`transactions:${req.userInfo.userId}:*`);
    } catch (cacheErr) {
      console.error("Cache clear error:", cacheErr.message);
    }

    // Update vector DB asynchronously
    deleteChunksForTransaction(updatedTransaction._id)
      .then(() => ingestTransaction(updatedTransaction))
      .catch((vectorErr) => {
        console.error("Vector update error:", vectorErr?.message || vectorErr);
      });

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (err) {
    console.error("Error in editTransaction:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

// Delete transaction and invalidate Redis cache
const deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const delTransaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId: req.userInfo.userId,
    });

    if (!delTransaction) {
      return res.status(400).json({
        success: false,
        message: "No record deleted",
      });
    }

    // Invalidate Redis cache for this user
    try {
      await clearCachePattern(`transactions:${req.userInfo.userId}:*`);
    } catch (cacheErr) {
      console.error("Cache clear error:", cacheErr.message);
    }

    // Delete vector chunks asynchronously
    deleteChunksForTransaction(delTransaction._id).catch((vectorErr) => {
      console.error("Vector delete error:", vectorErr?.message || vectorErr);
    });

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      data: delTransaction,
    });
  } catch (err) {
    console.error("Error in deleteTransaction:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

// Recent transactions with Redis caching
const recentTransaction = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const cacheKey = `transactions:${userId}:recent`;

    // 1. Check Redis cache
    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        return res.status(200).json(cached);
      }
    } catch (cacheErr) {
      console.error("Cache read error:", cacheErr.message);
    }

    // 2. Fetch from DB
    const recentTrans = await Transaction.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(3);

    const responseData = {
      success: true,
      message: "Recent transactions fetched",
      recent: recentTrans,
    };

    // 3. Store in cache
    try {
      await setCache(cacheKey, responseData, 300);
    } catch (cacheErr) {
      console.error("Cache write error:", cacheErr.message);
    }

    return res.status(200).json(responseData);
  } catch (err) {
    console.error("Error in recentTransaction:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

export {
  getAllTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction,
  recentTransaction,
};
