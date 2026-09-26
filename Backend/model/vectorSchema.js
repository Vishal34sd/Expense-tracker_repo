import mongoose from "mongoose";

const vectorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      index: true,
    },
    pageContent: {
      type: String,
      required: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

const VectorModel = mongoose.model("ExpenseVector", vectorSchema);
export default VectorModel;
