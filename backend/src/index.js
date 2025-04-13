import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import cors from "cors";

import path from "path";

import authRoutes from "../src/routes/auth.route.js";
import messageRoutes from "../src/routes/message.route.js";
import scheduledMessageRoutes from "../src/routes/scheduledMessage.route.js"
import { app, server } from "./lib/socket.js";
import "../src/controllers/scheduledMessage.controller.js";


dotenv.config();    // Ensure .env file is loaded

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/scheduledMessage", scheduledMessageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) =>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(PORT, ()=>{
    console.log("Server started at port: "+PORT);
    connectDB();
    
});