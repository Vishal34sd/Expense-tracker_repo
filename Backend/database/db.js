import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnection =  async ()=>{
    try{
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("Database connected succesfully ");
    }
    catch(err){
        console.log(err);
    }
}

export default dbConnection ;