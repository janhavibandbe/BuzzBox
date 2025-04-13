import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            console.log("Token not found in request");
            return res.status(401).json({message: "Unathorized-No Token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);   // returens decoded object stored in token
        if(!decoded){
            console.log("Token verification failed");
            return res.status(401).json({message: "Unathorized-Invalid Token"});
        }

        req.user = await User.findById(decoded.userId).select("-password");
        if(!req.user){
            return res.status(404).json({message: "User Not Found"});
        }

        next();

    } catch (error) {
        console.log("Error in protectRoute controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
};