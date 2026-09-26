import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { OpenAIEmbeddings } from "@langchain/openai";
import VectorModel from "../model/vectorSchema.js";
import Transaction from "../model/transactionSchema.js";
import { chunkText, formatTransactionToText } from "./chunk.js";

function getProvider() {
  const provider = (process.env.RAG_MODEL_PROVIDER || "gemini").toLowerCase();
  return provider === "gemini" ? "google" : "openai";
}

function makeGoogleEmbeddings() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  if (!key) {
    throw new Error("Google/Gemini API key not found in environment variables");
  }

  return new GoogleGenerativeAIEmbeddings({
    apiKey: key,
    model: "models/gemini-embedding-001",
  });
}

function makeOpenAiEmbeddings() {
  const key = process.env.OPENAI_API_KEY || "";
  if (!key) {
    throw new Error("OpenAI API key not found in environment variables");
  }

  return new OpenAIEmbeddings({
    openAIApiKey: key,
    model: "text-embedding-3-small",
  });
}

export function getEmbeddings() {
  try {
    const provider = getProvider();
    return provider === "google" ? makeGoogleEmbeddings() : makeOpenAiEmbeddings();
  } catch (err) {
    console.error("Error creating embeddings instance:", err.message);
    throw err;
  }
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function addChunks(docs, userId, transactionId = null) {
  try {
    if (!Array.isArray(docs) || docs.length === 0) return 0;
    if (!userId) {
      throw new Error("userId is required for saving vector chunks");
    }

    const embeddingsInstance = getEmbeddings();

    for (const doc of docs) {
      const pageContent = doc.pageContent || "";
      if (!pageContent.trim()) continue;

      const vector = await embeddingsInstance.embedQuery(pageContent);

      const vectorRecord = new VectorModel({
        userId,
        transactionId: transactionId || doc.metadata?.transactionId || null,
        pageContent,
        metadata: doc.metadata || {},
        embedding: vector,
      });

      await vectorRecord.save();
    }

    return docs.length;
  } catch (err) {
    console.error("Error adding chunks to MongoDB Vector DB:", err.message);
    throw err;
  }
}

export async function similaritySearchVectorWithScore(queryVector, userId, k = 5) {
  try {
    if (!userId) return [];

    const records = await VectorModel.find({ userId });
    if (!records.length) return [];

    const scored = records.map((record) => {
      const score = cosineSimilarity(queryVector, record.embedding);
      return [
        {
          pageContent: record.pageContent,
          metadata: {
            ...record.metadata,
            source: record.metadata?.source || "transaction",
            chunkId: record.metadata?.chunkId ?? 0,
            transactionId: record.transactionId,
          },
        },
        score,
      ];
    });

    scored.sort((a, b) => b[1] - a[1]);

    return scored.slice(0, k);
  } catch (err) {
    console.error("Error performing vector similarity search:", err.message);
    return [];
  }
}

export async function deleteChunksForTransaction(transactionId) {
  try {
    if (!transactionId) return;
    await VectorModel.deleteMany({ transactionId });
  } catch (err) {
    console.error("Error deleting transaction vectors:", err.message);
  }
}

export async function syncUserTransactionsToVectorDB(userId) {
  try {
    if (!userId) return 0;
    const transactions = await Transaction.find({ userId });

    let syncedCount = 0;
    for (const tx of transactions) {
      const exists = await VectorModel.exists({ transactionId: tx._id });
      if (!exists) {
        const formattedText = formatTransactionToText(tx);
        const docs = chunkText(formattedText, `transaction-${tx._id}`, {
          transactionId: tx._id,
          category: tx.category,
          amount: tx.amount,
          type: tx.type,
          date: tx.date,
        });
        await addChunks(docs, userId, tx._id);
        syncedCount++;
      }
    }
    return syncedCount;
  } catch (err) {
    console.error("Error syncing transactions to vector DB:", err.message);
    return 0;
  }
}
