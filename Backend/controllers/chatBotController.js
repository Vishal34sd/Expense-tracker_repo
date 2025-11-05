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

import { CloudClient } from "chromadb";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Document } from "langchain/document";
import { BufferMemory, CombinedMemory, VectorStoreRetrieverMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

const MAX_SEARCHES = 3;

// Initialize Chroma Cloud Client
const chromaClient = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

// LLM Setup
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.7,
});

const EMBEDDING_MODELS = ["gemini-embedding-001", "textembedding-gecko-001"];

let _cachedCollection = null;
async function getCollection() {
  if (_cachedCollection) return _cachedCollection;
  try {
    _cachedCollection = await chromaClient.getCollection({ name: "expense-knowledge" });
    return _cachedCollection;
  } catch {
    _cachedCollection = await chromaClient.createCollection({
      name: "expense-knowledge",
      metadata: { description: "Stores expense knowledge embeddings" },
    });
    return _cachedCollection;
  }
}

async function generateEmbeddings(docsText) {
  for (const model of EMBEDDING_MODELS) {
    try {
      const embeddings = new GoogleGenerativeAIEmbeddings({ model, apiKey: process.env.GEMINI_API_KEY });
      const vectors = await embeddings.embedDocuments(docsText);
      if (!vectors || vectors.length !== docsText.length || vectors.some(v => !Array.isArray(v) || v.length === 0)) continue;
      return vectors;
    } catch {}
  }
  throw new Error("All embedding models failed. Check GEMINI_API_KEY or model");
}

export const askChatBot = async (req, res) => {
  try {
    const userId = req.userInfo?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized: missing userId" });

    const userInfo = await User.findById(userId);
    if (!userInfo) return res.status(404).json({ error: "User not found" });

    // Rate limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!userInfo.lastSearchDate || userInfo.lastSearchDate < today) {
      userInfo.searchCount = 0;
      userInfo.lastSearchDate = today;
    }
    if (userInfo.searchCount >= MAX_SEARCHES) return res.status(429).json({ error: `Rate limit reached (${MAX_SEARCHES} searches per day)` });

    // Transactions
    const transactions = await Transaction.find({ userId });
    const validTx = transactions.filter(t => t.category && t.amount != null && t.date);
    if (!validTx.length) return res.status(400).json({ error: "No valid transactions found." });

    const docs = validTx.map(t => new Document({
      metadata: { id: t._id.toString(), category: t.category },
      pageContent: `Spent ₹${t.amount} on ${t.category} on ${new Date(t.date).toDateString()}. Note: ${t.note || "No note"}`
    }));
    const docsText = docs.map(d => d.pageContent).filter(Boolean);
    const collection = await getCollection();

    // Generate embeddings
    let vectors;
    try { vectors = await generateEmbeddings(docsText); } catch { vectors = null; }

    if (vectors) {
      const ids = docs.map(d => d.metadata.id);
      const metadatas = docs.map(d => d.metadata);
      await collection.add({ ids, embeddings: vectors, documents: docsText, metadatas });
    }

    // Previous Q&A Memory
    const prevQA = await Question.find({ userId }).sort({ createdAt: 1 }).select("question reply -_id");
    let memory = null;

    if (prevQA.some(q => q.reply)) {
      const bufferMemory = new BufferMemory({ memoryKey: "chat_history", inputKey: "input", outputKey: "response", returnMessages: false });
      for (const qa of prevQA) {
        const replyText = qa.reply?.trim() || "No reply";
        await bufferMemory.saveContext({ input: qa.question }, { response: replyText });
      }

      const vectorMemory = vectors ? new VectorStoreRetrieverMemory({
        vectorStoreRetriever: {
          getRelevantDocuments: async query => {
            const queryEmbedding = await generateEmbeddings([query]);
            const results = await collection.query({ queryEmbeddings: queryEmbedding, nResults: 3 });
            const docs = results.documents?.[0] || [];
            return docs.map((doc, i) => ({ pageContent: doc, metadata: results.metadatas?.[0]?.[i] || {} }));
          },
        },
        memoryKey: "long_term_memory",
        inputKey: "input",
        outputKey: "response",
      }) : null;

      memory = new CombinedMemory({ memories: vectorMemory ? [bufferMemory, vectorMemory] : [bufferMemory] });
    }

    const chain = memory ? new ConversationChain({ llm, memory }) : new ConversationChain({ llm });

    const userQuestion = req.body.userQuestion;
    if (!userQuestion?.trim()) return res.status(400).json({ error: "userQuestion is required" });

    const prompt = `You are an intelligent Expense Assistant that understands user's transactions and chat history.
Here are the user's recent expenses:
${validTx.map(t => `• ₹${t.amount} on ${t.category} (${new Date(t.date).toDateString()})`).join("\n")}
User Question: ${userQuestion}`;

    const result = await chain.invoke({ input: prompt });
    const reply = result?.response ?? "Sorry, I couldn’t generate a response.";

    userInfo.searchCount += 1;
    await userInfo.save();
    await Question.create({ userId, question: userQuestion, reply });

    res.json({ reply, searchCount: userInfo.searchCount });

  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong while processing chatbot query." });
  }
};
