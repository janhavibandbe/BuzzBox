import express from "express";
import { login, logout, signup, verifyOtp, getProfile, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js"

const router = express.Router();

router.post("/signup" , signup);
router.post("/verifyOtp", verifyOtp);
router.post("/login" , login);
router.post("/logout" , logout);

router.get("/get-profile", protectRoute, getProfile);
router.put("/update-profile" , protectRoute, updateProfile);
router.get("/check" , protectRoute, checkAuth);

export default router;