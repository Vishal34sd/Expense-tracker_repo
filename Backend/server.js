import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./database/db.js";
import transactionRoutes from "./routes/transactionRoute.js";
import authRoutes from "./routes/authRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


dbConnection();


const allowedOrigins = ['https://expense-tracker-repo-3p8w.vercel.app'];


app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log(' CORS Preflight from:', req.headers.origin);
  }
  next();
});


app.options('*', cors());


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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1", transactionRoutes);
app.use("/api/v1", authRoutes);


app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
