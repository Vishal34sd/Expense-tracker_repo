import express from "express"
import { userRegister , userLogin } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { verifyOTP, changePassword } from "../controllers/authController.js";

const router = express.Router();


router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/verify-otp", authMiddleware , verifyOTP);
router.post("/changePassword", authMiddleware , changePassword);



export default router ; 