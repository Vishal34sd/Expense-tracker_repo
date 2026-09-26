import { chunkText, formatTransactionToText } from "./chunk.js";
import { addChunks } from "./store.js";

export async function ingestText(input) {
  try {
    const raw = (input.text ?? "").trim();
    if (!raw) {
      throw new Error("No text content provided to ingest");
    }

    const userId = input.userId;
    if (!userId) {
      throw new Error("userId is required for text ingestion");
    }

    const source = input.source ?? "pasted-text";
    const transactionId = input.transactionId ?? null;
    const extraMeta = input.metadata ?? {};

    const docs = chunkText(raw, source, { ...extraMeta, transactionId });

    const chunkCount = await addChunks(docs, userId, transactionId);

    return {
      docCount: 1,
      chunkCount,
      source,
    };
  } catch (err) {
    console.error("Error in ingestText:", err.message);
    throw err;
  }
}

export async function ingestTransaction(transaction) {
  try {
    if (!transaction) return null;
    const userId = transaction.userId;
    if (!userId) return null;

    const formattedText = formatTransactionToText(transaction);
    if (!formattedText) return null;

    const source = `transaction-${transaction._id}`;
    const docs = chunkText(formattedText, source, {
      transactionId: transaction._id,
      category: transaction.category,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
    });

    const chunkCount = await addChunks(docs, userId, transaction._id);

    return {
      docCount: 1,
      chunkCount,
      source,
      transactionId: transaction._id,
    };
  } catch (err) {
    console.error("Error in ingestTransaction:", err.message);
    return null;
  }
}
