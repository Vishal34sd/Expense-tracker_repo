import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const flashModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});
