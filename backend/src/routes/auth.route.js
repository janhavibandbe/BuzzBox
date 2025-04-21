import express from "express";
import { login, logout, signup, verifyOtp, getProfile, updateProfile, updatePassword, forgotPassword, verifyOtpForPassword, checkAuth } from "../controllers/auth.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js"

const router = express.Router();

router.post("/signup" , signup);
router.post("/verifyOtp", verifyOtp);
router.post("/login" , login);
router.post("/logout" , logout);

router.get("/get-profile", protectRoute, getProfile);
router.put("/update-profile" , protectRoute, updateProfile);

router.put("/forgot-password", forgotPassword);
router.post("/verifyOtpForPassword", verifyOtpForPassword);
router.put("/update-password", updatePassword);

router.get("/check" , protectRoute, checkAuth);

export default router;