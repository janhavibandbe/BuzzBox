import cloudinary from "../lib/cloudinary.js";
import { generateToken, generateOTP, sendOTPEmail, sendForgotPasswordEmail } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async(req, res) => {
    const {fullName, email, password, gender} = req.body;
    try {

        if(!fullName || !email || !password || !gender){
            return res.status(400).json({message: "All fields are required"});
        }

        if(password.length<6){
            return res.status(400).json({message: "Password length must be greater than 6 characters"});
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message: "Email already exist"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = await generateOTP();
        await sendOTPEmail(email, otp);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            gender,
            otp,
        });

        if (newUser) {
            //generte jwt token
            generateToken(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                gender: newUser.gender,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({message: "Invalid user data"});
        }
    } 
    catch (error) {
        console.log("Error in signup controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const verifyOtp = async(req, res) => {
    const {otp, email} = req.body;
    console.log(otp, email);

    try{
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Optional: mark user as verified
        user.otp = ""; // Clear OTP
        user.status = "active"; // If you have a flag for this
        await user.save();

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            gender: user.gender,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        console.log("Error in login controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const login = async(req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(! user){
            return res.status(400).json({message: "Invalid Credential"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            res.status(400).json({message: "Invalid Credential"});
            return;
        }

        generateToken(user._id, res);


        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            gender: user.gender,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in login controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getProfile = async(req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        res.status(200).json(user);

    } catch (error) {
        console.log("Error in updateProfile controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const updateProfile = async(req, res) => {
    try {
        const {fullName, profilePic} = req.body;
        const userId = req.user._id;

        const updatedFields = {};
        if (fullName) updatedFields.fullName = fullName;
        console.log("first", updatedFields);
        if (profilePic) {
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            updatedFields.profilePic = uploadResponse.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in updateProfile controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "Email is not registered" });
      }
  
      const otp = await generateOTP();
      await sendForgotPasswordEmail(email, otp);
  
      const updatedOtp = await User.findOneAndUpdate(
        { email },
        { otp },
        { new: true }
      );
  
      res.status(200).json(updatedOtp);
    } catch (error) {
      console.log("Error in forgotPassword controller: " + error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const verifyOtpForPassword = async(req, res) => {
    const {otp, email} = req.body;
    try{
        const user = await User.findOne({ email });

        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        res.status(200).send("OTP verified successfully");
    }
    catch (error) {
        console.log("Error in verifyOtpForPassword controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
}; 

export const updatePassword = async(req, res) => {
    const { email, password } = req.body;
try {
    if(!password){
        return res.status(400).json({message: "No password provided"});
    }
    if(password.length<6){
        return res.status(400).json({message: "Password length must be greater than 6 characters"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedFields = {};
    updatedFields.password = hashedPassword;
    const updatedPassword = await User.findOneAndUpdate({email}, updatedFields, { new: true });
    res.status(200).json(updatedPassword);
} catch (error) {
    console.log("Error in updatePassword controller"+ error.message);
    res.status(500).json({message: "Internal server error"});
}
};

export const checkAuth = (req, res) => {
    try {
        console.log(User);
        res.status(200).json(req.user);
        console.log("User is authenticated");
    } catch (error) {
        console.log("Error in checkAuth controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
};