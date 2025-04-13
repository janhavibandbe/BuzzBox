import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getScheduledMessages, sendScheduledMessage} from "../controllers/scheduledMessage.controller.js";

const router = express.Router();

router.get("/:id", protectRoute, getScheduledMessages);

router.post("/send/:id", protectRoute, sendScheduledMessage);


export default router;