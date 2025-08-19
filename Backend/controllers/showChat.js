import Question from "../model/questionSchema.js";


// const showChat = async(req, res)=>{
//     try{
//         const userId = req.userInfo._id;

//         const userExist = await mongoose.find({userId});
//         if(!userExist){
//             res.status(404).json({
//                 success : false ,
//                 message : 'user not found '
//             });
//         }
        

//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({
//             success : false ,
//             message : "Internal server error "
//         });
//     }
// }