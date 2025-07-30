import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./database/db.js";
import transactionRoutes from "./routes/transactionRoute.js";
import authRoutes from "./routes/authRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// IMPORTANT: This tells Express to trust the headers sent by Render's proxy.
// It must be placed before any routes or other middleware.
app.set('trust proxy', 1);

// Connect to database
dbConnection();

// Define the origins that are allowed to make requests to your backend.
const allowedOrigins = [
  'https://expense-tracker-repo-3p8w.vercel.app',
  'http://localhost:5173' // For your local development environment
];

const corsOptions = {
  // Use the array of allowed origins directly.
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

// Use CORS for all routes
app.use(cors(corsOptions));

// This is still useful for debugging preflight requests.
app.options('*', cors(corsOptions));

// Middleware to log preflight requests (optional but helpful)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('CORS Preflight from:', req.headers.origin);
  }
  next();
});

// JSON and URL-encoded parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/v1", transactionRoutes);
app.use("/api/v1", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
