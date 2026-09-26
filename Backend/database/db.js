import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

export default dbConnection;
