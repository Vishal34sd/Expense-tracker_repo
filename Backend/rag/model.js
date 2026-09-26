import dotenv from "dotenv";
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export function getChatModel(opts = {}) {
  try {
    const temperature = opts.temperature ?? 0.2;
    const maxTokens = opts.maxToken ?? 1024;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

    if (!apiKey) {
      throw new Error("Gemini/Google API key is missing");
    }

    return new ChatGoogleGenerativeAI({
      apiKey,
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      temperature,
      maxOutputTokens: maxTokens,
    });
  } catch (err) {
    console.error("Error creating ChatGoogleGenerativeAI model:", err.message);
    throw err;
  }
}
