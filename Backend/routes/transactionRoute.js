import express from "express";
import { getAllTransaction , addTransaction, editTransaction , deleteTransaction , recentTransaction} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();


router.get("/get",authMiddleware , getAllTransaction);
router.post("/add",authMiddleware , addTransaction);
router.put("/edit/:id", authMiddleware ,editTransaction);
router.delete("/delete/:id",authMiddleware , deleteTransaction );
router.get("/recent", authMiddleware ,recentTransaction );







export default router ;