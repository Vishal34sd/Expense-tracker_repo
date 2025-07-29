
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username : {
        type : String ,
        required : true ,
        trim : true ,
    },
    email : {
            type : String ,
            required : true ,
            trim : true ,
            unique : true
        },
    password : {
        type : String ,
        required : true ,
        trim : true ,
    },
    otp : {
        type : String ,
    },
    expiresIn : {
        type : Date
    },
    isVerified : {
        type : Boolean ,
        default : false
    }
},{ timeStamps : true}) ;

const userModel = mongoose.model("User", userSchema);
export default userModel ;