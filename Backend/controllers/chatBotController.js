import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

const askChatBot = async(req, res)=>{
    try{
        const {userQuestion } = req.body;
        
        const prompt = `You are a expense tracker helping assistant. Answer in 2-3 lines.
        Question : ${userQuestion}. Answer each question clearly` ;

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",
            {
                model: "tngtech/deepseek-r1t-chimera:free",
                messages : [{role : "user", content : prompt}],
                max_tokens :250
            },
            {
                headers : {
                    Authorization : `Bearer ${process.env.CHATBOT_API}`,
                    "Content-Type" : "application/json"
                }
            }
        );
        res.status(200).json({
            answer : response.data.choices[0].message.content});
    }
    catch(err){
        return res.status(500).json({
            success : false ,
            message : "AI Request failed "
        });
    }
}

export {askChatBot};