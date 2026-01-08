// import dotenv from "dotenv";
// dotenv.config();
// import Transaction from "../model/transactionSchema.js"; 
// import Question from "../model/questionSchema.js"
// import { flashModel } from "../utils/gemini.js";
// import User from "../model/userSchema.js";

// const MAX_SEARCHES = 3;

// const askChatBot = async (req, res) => {
//   try {
//     const userId = req.userInfo.userId;

    
//     const userInfo = await User.findOne({ _id: userId });
//     if (!userInfo) {
//       return res.status(404).json({ error: "User not found" });
//     }

  
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

    
//     if (!userInfo.lastSearchDate || userInfo.lastSearchDate < today) {
//       userInfo.searchCount = 0;
//       userInfo.lastSearchDate = today;
//     }

    
//     if (userInfo.searchCount >= MAX_SEARCHES) {
//       return res.status(429).json({ error: `Rate limit reached (${MAX_SEARCHES} searches per day)` });
//     }

//     // Fetch user's transactions
//     const transactionData = await Transaction.find({ userId: userId });
//     const filterData = transactionData.filter(
//       (item) => item.category && item.amount != null && item.date
//     );

//     const { userQuestion } = req.body;

//     const prompt = `You are an Expense Assistant. Here is the user's expense data: ${JSON.stringify(
//       filterData
//     )}
// User question: ${userQuestion}`;

    
//     const result = await flashModel.generateContent(prompt);

    
//     userInfo.searchCount += 1;
//     await userInfo.save();

    
//     res.json({
//       reply: result.response.text(), 
//       count: userInfo.searchCount
//     });

//     try {
//       const question = new Question({
//         userId,
//         question: userQuestion,
//         answers:  result.response.text(),
//       });
//       await question.save();
//       console.log("Question saved successfully!");
//     } catch (saveErr) {
//       console.error("Error saving question:", saveErr);
//     }

//   } catch (err) {
//     console.error("Error in askChatBot:", err);
//     res.status(500).json({ error: "AI request failed" });
//   }
// };

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Transaction from "../model/transactionSchema.js";
import Question from "../model/questionSchema.js";
import User from "../model/userSchema.js";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

const MAX_SEARCHES = 3;

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.7,
});

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

    const transactions = await Transaction.find({ userId });
    const validTx = transactions.filter(
      t => t.category && t.amount != null && t.date
    );

    if (!validTx.length) {
      return res.status(400).json({ error: "No transactions found" });
    }

    const prevQA = await Question.find({ userId })
      .sort({ date: 1 })
      .select("question reply answers -_id");

    const memory = new BufferMemory({
      memoryKey: "history",
      inputKey: "input",
      outputKey: "response",
      returnMessages: false,
    });

    for (const qa of prevQA) {
      const reply = (qa.reply || qa.answers || "").trim();
      if (!reply) continue;
      await memory.saveContext(
        { input: qa.question },
        { response: reply }
      );
    }

    const chain = new ConversationChain({
      llm,
      memory,
    });

    const userQuestion = req.body.userQuestion;
    if (!userQuestion?.trim()) {
      return res.status(400).json({ error: "userQuestion is required" });
    }

    const prompt = `
You are an intelligent Expense Assistant.

User expenses:
${validTx.map(t =>
  `• ₹${t.amount} on ${t.category} (${new Date(t.date).toDateString()})`
).join("\n")}

Question:
${userQuestion}
`;

    const result = await chain.invoke({ input: prompt });
    const reply = result?.response || "Unable to generate response";

    await Question.create({
      userId,
      question: userQuestion,
      reply,
      answers: reply,
    });

    userInfo.searchCount += 1;
    await userInfo.save();

    res.json({
      reply,
      searchCount: userInfo.searchCount,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
};
