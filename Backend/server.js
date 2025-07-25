import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import dbConnection from "./database/db.js";
import transactionRoutes from "./routes/transactionRoute.js";
import authRoutes from "./routes/authRoute.js";

const app = express();
const PORT = process.env.PORT;

// Connect to DB
dbConnection();

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Allow only your frontend's HTTPS domain
const allowedOrigins = ['https://expense-tracker-repo-3p8w.vercel.app'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Handle preflight requests (important!)
app.options('*', cors());

// Routes
app.use("/api/v1", transactionRoutes);
app.use("/api/v1", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
