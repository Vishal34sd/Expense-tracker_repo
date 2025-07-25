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

const allowedOrigins = ['https://expense-tracker-repo-3p8w.vercel.app'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // If you're using cookies or auth headers
  })
);


app.use("/api/v1", transactionRoutes);
app.use("/api/v1", authRoutes);



app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
});