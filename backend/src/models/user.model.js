import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            require: true,
            unique: true,
        },
        fullName: {
            type: String,
            require: true,
        },
        password: {
            type: String,
            require: true,
            minlength: 6,
        },
        gender: {
            type: String,
            require: true,
        },
        profilePic: {
            type: String,
            default: "",
        },
        otp: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            default: "pending"
        }
    },
    {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;