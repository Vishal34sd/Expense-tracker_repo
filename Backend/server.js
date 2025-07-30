import express from "express";
// We no longer need the 'cors' package, so you can remove the import if you like.
import cors from "cors"; 
import dotenv from "dotenv";
import dbConnection from "./database/db.js";
import transactionRoutes from "./routes/transactionRoute.js";
import authRoutes from "./routes/authRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// This is still CRITICAL. It ensures Express trusts the 'https' protocol
// information coming from Render's proxy.
app.set('trust proxy', 1);

// Connect to the database
dbConnection();

// List of origins that are allowed to access your backend
const allowedOrigins = [
  'https://expense-tracker-repo-3p8w.vercel.app',
  'http://localhost:5173' // For local development
];

// --- Custom CORS Middleware: A Direct Approach ---
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // If the request's origin is in our allowed list, set the header.
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Set other necessary CORS headers.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // The browser sends an OPTIONS request first to check permissions (a "preflight" request).
  // We must handle it by sending a success status.
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // If it's not a preflight request, move on to the next middleware/route handler.
  next();
});

// JSON and URL-encoded parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/v1", transactionRoutes);
app.use("/api/v1", authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
