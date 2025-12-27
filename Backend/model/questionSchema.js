import mongoose from "mongoose";

const questionSchema =  new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User"
    },
    question : {
        type : String ,
        required : true
    },
    reply : {
        type : String,
    },
    answers : {
        type : String ,
        
    },
    date : {
        type : Date ,
        default : Date.now
    }
});

const questionModel = mongoose.model("Question", questionSchema);
export default questionModel ;