import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User",
        
        
       
    },
    type : {
        type : String ,
        enum : ["income", "expense"],
        required : true ,
        trim : true
    },
    amount : {
        type : Number ,
        required : true ,
    },
    category : {
        type : String ,
        required : true
    },
    note : {
        type: String ,
        default : " "
    },
    date : {
        type : Date,
        default : Date.now
    }
},{timestamps : true})

const transactionModel = mongoose.model("Transaction", transactionSchema);
export default transactionModel ;