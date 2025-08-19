import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnection =  async ()=>{
    try{
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("Database connected succesfully ");
    }
    catch(err){
        console.error("MongoDB connection error:", err.message);
  console.error("Error code:", err.code);
  console.error("Topology info:", err.reason);
    }
}

export default dbConnection ;