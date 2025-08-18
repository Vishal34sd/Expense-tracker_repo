import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./database/db.js";
import transactionRoutes from "./routes/transactionRoute.js";
import authRoutes from "./routes/authRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// This is important for deployment on services like Render.
app.set('trust proxy', 1);

// Connect to the database
dbConnection();

// --- CORS Configuration ---
// List of frontend URLs that are allowed to access your backend.
const allowedOrigins = [
  'https://expense-tracker-repo-3p8w.vercel.app', // Your Vercel deployment
  'http://localhost:5173'                         // Your local development environment
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));


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
