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
    answers : {
        type : String ,
        required : true
    },
    date : {
        type : Date ,
        drfault : Date.now
    }
});

const questionModel = mongoose.model("Question", questionSchema);
export default questionModel ;