import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./database/db.js";
import transactionRoutes from "./routes/transactionRoute.js";
import authRoutes from "./routes/authRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to database
dbConnection();


const allowedOrigins = ['https://expense-tracker-repo-3p8w.vercel.app', 'http://localhost:5173'];


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

// ✅ Use CORS for all routes
app.use(cors(corsOptions));


app.options('*', cors(corsOptions));

// Middleware to log preflight requests (optional)
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
