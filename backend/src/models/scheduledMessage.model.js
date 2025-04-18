import mongoose from "mongoose";

const messageScheduleSchema = new mongoose.Schema(
    {
       senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
       },
       receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
       },
       text: {
        type: String,
       },
       image: {
        type: String,
       },
       imageName: {
        type: String,
       },
       scheduledTime: { 
        type: Date, 
        required: true 
        },
        status: { 
        type: String, 
        enum: ['pending', 'sent'], 
        default: 'pending' 
        },
    },
    {timestamps: true}
);

const ScheduledMessage = mongoose.model("ScheduledMessage", messageScheduleSchema);

export default ScheduledMessage;