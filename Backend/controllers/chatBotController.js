import dotenv from "dotenv";
dotenv.config();
import Transaction from "../model/transactionSchema.js"; 
import Question from "../model/questionSchema.js"
import { flashModel } from "../utils/gemini.js";
import User from "../model/userSchema.js";

const MAX_SEARCHES = 3;

const askChatBot = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    
    const userInfo = await User.findOne({ _id: userId });
    if (!userInfo) {
      return res.status(404).json({ error: "User not found" });
    }

  
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    
    if (!userInfo.lastSearchDate || userInfo.lastSearchDate < today) {
      userInfo.searchCount = 0;
      userInfo.lastSearchDate = today;
    }

    
    if (userInfo.searchCount >= MAX_SEARCHES) {
      return res.status(429).json({ error: `Rate limit reached (${MAX_SEARCHES} searches per day)` });
    }

    // Fetch user's transactions
    const transactionData = await Transaction.find({ userId: userId });
    const filterData = transactionData.filter(
      (item) => item.category && item.amount != null && item.date
    );

    const { userQuestion } = req.body;

    const prompt = `You are an Expense Assistant. Here is the user's expense data: ${JSON.stringify(
      filterData
    )}
User question: ${userQuestion}`;

    
    const result = await flashModel.generateContent(prompt);

    
    userInfo.searchCount += 1;
    await userInfo.save();

    
    res.json({
      reply: result.response.text(), 
      count: userInfo.searchCount
    });

    try {
      const question = new Question({
        userId,
        question: userQuestion,
        answers:  result.response.text(),
      });
      await question.save();
      console.log("Question saved successfully!");
    } catch (saveErr) {
      console.error("Error saving question:", saveErr);
    }

  } catch (err) {
    console.error("Error in askChatBot:", err);
    res.status(500).json({ error: "AI request failed" });
  }
};

export { askChatBot };
