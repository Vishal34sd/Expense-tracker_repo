import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./database/db.js";
import transactionRoutes from "./routes/transactionRoute.js";
import authRoutes from "./routes/authRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

dbConnection();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://expense-tracker-repo-3p8w.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", transactionRoutes);
app.use("/api/v1", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});