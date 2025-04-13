import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });


    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
}

export const generateOTP = async () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Verification OTP',
        html: `<p>Hello,</p>
               <p>Your OTP for registration is: <strong>${otp}</strong></p>
               <p>This OTP is valid for 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
};