import { Document } from "@langchain/core/documents";

export const CHUNK_SIZE = 1000;
export const CHUNK_OVERLAP = 150;

export function chunkText(text, source = "pasted-text", extraMeta = {}) {
  try {
    const clean = (text ?? "").replace(/\r\n/g, "\n");
    const docs = [];

    if (!clean.trim()) return docs;

    const step = Math.max(1, CHUNK_SIZE - CHUNK_OVERLAP);
    let start = 0;
    let chunkId = 0;

    while (start < clean.length) {
      const end = Math.min(clean.length, start + CHUNK_SIZE);
      const slice = clean.slice(start, end).trim();

      if (slice.length > 0) {
        docs.push(
          new Document({
            pageContent: slice,
            metadata: {
              source,
              chunkId,
              ...extraMeta,
            },
          })
        );
        chunkId++;
      }
      start += step;
    }

    return docs;
  } catch (err) {
    console.error("Error chunking text:", err.message);
    return [];
  }
}

export function formatTransactionToText(tx) {
  try {
    if (!tx) return "";
    const typeStr = tx.type ? String(tx.type).toUpperCase() : "EXPENSE";
    const amountStr = tx.amount != null ? `₹${tx.amount}` : "₹0";
    const categoryStr = tx.category || "General";
    const noteStr = tx.note && tx.note.trim() ? `Note: ${tx.note.trim()}` : "No note";
    const dateStr = tx.date ? new Date(tx.date).toDateString() : new Date().toDateString();

    return `Transaction Record [${typeStr}]: Amount ${amountStr} for category "${categoryStr}" on ${dateStr}. ${noteStr}. (Category: ${categoryStr}, Type: ${typeStr}, Amount: ${amountStr}, Date: ${dateStr})`;
  } catch (err) {
    console.error("Error formatting transaction to text:", err.message);
    return "";
  }
}
