import express from "express" ;
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import dbConnection from "./database/db.js";
const PORT = process.env.PORT ;
import transactionRoutes from "./routes/transactionRoute.js"
import authRoutes from "./routes/authRoute.js"

dbConnection();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({
  origin: ["expense-tracker-repo-3p8w.vercel.app"
],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use("/api/v1", transactionRoutes);
app.use("/api/v1", authRoutes);



app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
});