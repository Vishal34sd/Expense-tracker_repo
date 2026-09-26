import express from "express";
import {
  userRegister,
  userLogin,
  googleStartAuthHandler,
  googleAuthCallbackHandler,
  userLogout,
  changePassword,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogout);
router.post("/changePassword", authMiddleware, changePassword);
router.get("/google", googleStartAuthHandler);
router.get("/google/callback", googleAuthCallbackHandler);

// Profile routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);



export default router ; 