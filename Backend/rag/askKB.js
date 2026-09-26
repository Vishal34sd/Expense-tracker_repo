import { getEmbeddings, similaritySearchVectorWithScore, syncUserTransactionsToVectorDB } from "./store.js";
import { getChatModel } from "./model.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

function buildContext(chunks) {
  try {
    return chunks
      .map(({ text, meta }, i) =>
        [
          `[#${i + 1}] (${String(meta?.source ?? "expense-record")} #${String(
            meta?.chunkId ?? "0"
          )})`,
          text ?? "Empty record",
        ].join("\n")
      )
      .join("\n\n---\n\n");
  } catch (err) {
    console.error("Error building context:", err.message);
    return "";
  }
}

async function buildFinalAnswerFromLLM(query, context, userProfile = {}) {
  try {
    const model = getChatModel({ temperature: 0.3 });
    const userName = userProfile?.name || "Friend";
    const userBehavior = userProfile?.behavior || "Regular expense tracking";

    const systemPrompt = [
      `You are the SmartExpense AI Assistant, a friendly, warm, empathetic, and encouraging personal financial guide.`,
      `You are chatting directly with ${userName}.`,
      ``,
      `Remembered User Profile & Behavior from Backend:`,
      `- Name: ${userName}`,
      `- Spending Habits & Behavior Profile: ${userBehavior}`,
      ``,
      `Guidelines for your responses:`,
      `1. Friendly Greeting & Caring Tone: Greet ${userName} warmly by their first name (e.g. "Hi ${userName}!", "Hey ${userName}! 😊"). Always speak with a helping, kind, and supportive nature. Celebrate good saving discipline and offer encouraging guidance.`,
      `2. Helpful & Clear Expense Answers: Directly answer their financial or expense questions based on their logged transactions and context. Be specific with numbers (in ₹ INR), dates, and categories.`,
      `3. Actionable "💡 Suggestions to Do Instead": Whenever addressing expense inquiries, high spending categories, or budget limits, ALWAYS provide 1-2 small, practical, and realistic alternative suggestions they can do instead to save or optimize money (e.g., swapping frequent takeout for quick home-cooked meals, setting a weekly spending cap, using the 24-hour rule for non-essential purchases, setting up automatic micro-savings).`,
      `4. Clean Formatting & Conciseness: Use markdown bullet points, bold key numbers, and keep responses engaging and concise (3 to 6 sentences plus the suggestions). Avoid dense walls of text.`,
    ].join("\n");

    const res = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(
        [
          `Question from ${userName}:\n${query}`,
          "",
          `Context (User Expense Records):\n${context || "No specific matching transaction records found."}`,
        ].join("\n")
      ),
    ]);

    const finalRes =
      typeof res.content === "string" ? res.content : String(res.content);

    return finalRes.trim().slice(0, 1800);
  } catch (err) {
    console.error("Error calling LLM for final answer:", err.message);
    return "I'm sorry, I encountered an error analyzing your expenses. Please try again.";
  }
}

function buildConfidence(scores) {
  try {
    if (!Array.isArray(scores) || !scores.length) return 0;

    const clamped = scores.map((score) => Math.max(0, Math.min(1, score)));
    const avg = clamped.reduce((a, b) => a + b, 0) / clamped.length;

    return Math.round(avg * 100) / 100;
  } catch (err) {
    console.error("Error building confidence:", err.message);
    return 0;
  }
}

export async function askKB(query, userId, k = 5, userProfile = {}) {
  try {
    const validatedQuery = (query ?? "").trim();
    if (!validatedQuery) {
      throw new Error("Query is empty");
    }
    if (!userId) {
      throw new Error("userId is required to query expense assistant");
    }

    let chunks = [];
    let scores = [];

    try {
      await syncUserTransactionsToVectorDB(userId);
      const embeddingsInstance = getEmbeddings();
      const embedQuery = await embeddingsInstance.embedQuery(validatedQuery);
      const pairs = await similaritySearchVectorWithScore(embedQuery, userId, k);

      chunks = pairs.map(([doc]) => ({
        text: doc.pageContent || "",
        meta: doc.metadata || {},
      }));
      scores = pairs.map(([_, score]) => Number(score) || 0);
    } catch (vErr) {
      console.warn("Vector search sync/query notice in askKB:", vErr.message);
    }

    const context = buildContext(chunks);
    const answer = await buildFinalAnswerFromLLM(validatedQuery, context, userProfile);

    const sources = chunks.map((c) => ({
      source: String(c.meta?.source ?? "expense-record"),
      chunkId: Number(c.meta?.chunkId ?? 0),
    }));

    const confidence = buildConfidence(scores);

    return {
      answer,
      sources,
      confidence,
    };
  } catch (err) {
    console.error("Error in askKB:", err.message);
    throw err;
  }
}
