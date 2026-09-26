import dotenv from "dotenv";
dotenv.config();

import Question from "../model/questionSchema.js";
import User from "../model/userSchema.js";
import Transaction from "../model/transactionSchema.js";
import { askKB } from "../rag/askKB.js";

const MAX_SEARCHES = 10; // Generous daily limit for helpful assistant interactions

export const askChatBot = async (req, res) => {
  try {
    const userId = req.userInfo?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const userInfo = await User.findById(userId);
    if (!userInfo) return res.status(404).json({ error: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!userInfo.lastSearchDate || userInfo.lastSearchDate < today) {
      userInfo.searchCount = 0;
      userInfo.lastSearchDate = today;
    }

    if (userInfo.searchCount >= MAX_SEARCHES) {
      return res.status(429).json({ error: "Daily limit reached" });
    }

    const userQuestion = req.body.userQuestion;
    if (!userQuestion?.trim()) {
      return res.status(400).json({ error: "userQuestion is required" });
    }

    // 1. Analyze and remember user financial behavior from database records
    let behaviorSummary = "New user with minimal transaction history";
    try {
      const recentTransactions = await Transaction.find({ userId })
        .sort({ date: -1 })
        .limit(100)
        .lean();

      let totalExpense = 0;
      let totalIncome = 0;
      const categoryMap = {};

      for (const t of recentTransactions) {
        const amt = Number(t.amount) || 0;
        if (t.type === "expense") {
          totalExpense += amt;
          categoryMap[t.category] = (categoryMap[t.category] || 0) + amt;
        } else if (t.type === "income") {
          totalIncome += amt;
        }
      }

      const topCategories = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat, amt]) => `${cat} (₹${amt.toLocaleString()})`);

      const behaviorParts = [
        `Total Logged Expenses: ₹${totalExpense.toLocaleString()}`,
        `Total Logged Income: ₹${totalIncome.toLocaleString()}`,
        topCategories.length ? `Primary Spending Categories: ${topCategories.join(", ")}` : "No distinct heavy expense categories yet",
        recentTransactions.length ? `Total Transactions Tracked: ${recentTransactions.length}` : "",
      ].filter(Boolean);

      behaviorSummary = behaviorParts.join(" | ");

      // Persist / update remembered behavior in user document
      userInfo.financialBehavior = `Top: ${topCategories.join(", ") || "Diverse"}; Total Expense: ₹${totalExpense}`;
    } catch (bErr) {
      console.warn("Could not calculate user financial behavior:", bErr.message);
    }

    // 2. Prepare userProfile for the AI assistant
    const userProfile = {
      name: userInfo.username || "Friend",
      email: userInfo.email || "",
      behavior: behaviorSummary,
      avatar: userInfo.avatar || "avatar1",
    };

    const ragResult = await askKB(userQuestion.trim(), userId, 5, userProfile);
    const reply = ragResult?.answer || "Unable to generate response from expense knowledge base";
    const confidence = ragResult?.confidence ?? 0;
    const sources = ragResult?.sources || [];

    await Question.create({
      userId,
      question: userQuestion,
      reply,
      answers: reply,
    });

    userInfo.searchCount += 1;
    await userInfo.save();

    return res.status(200).json({
      reply,
      confidence,
      sources,
      searchCount: userInfo.searchCount,
      userName: userInfo.username,
    });
  } catch (err) {
    console.error("Error in askChatBot controller:", err.message);
    return res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
};
