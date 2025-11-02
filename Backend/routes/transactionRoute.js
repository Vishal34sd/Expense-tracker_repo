import express from "express";
import { getAllTransaction , addTransaction, editTransaction , deleteTransaction , recentTransaction} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { askChatBot } from "../controllers/chatBotController.js";
import {showChat } from "../controllers/showChat.js";
const router = express.Router();


router.get("/get",authMiddleware, getAllTransaction);
router.post("/add",authMiddleware , addTransaction);
router.put("/edit/:id", authMiddleware ,editTransaction);
router.delete("/delete/:id",authMiddleware , deleteTransaction );
router.get("/recent", authMiddleware ,recentTransaction );

//chatbot route

router.post("/ask-chatbot",authMiddleware , askChatBot);

//show chat
router.get("/chat-history", authMiddleware , showChat);







export default router ;