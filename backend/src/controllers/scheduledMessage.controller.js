import cloudinary from "../lib/cloudinary.js";
import cron from 'node-cron';
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import ScheduledMessage from "../models/scheduledMessage.model.js";

export const getScheduledMessages = async(req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await ScheduledMessage.find({
            $or:[
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getScheduledMessages controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const sendScheduledMessage = async(req, res) => {
    try {
        const { text, image, scheduledTime  } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imgurl;
        if(image) {
            //upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imgurl = uploadResponse.secure_url;
        }

        const newScheduledMessage = new ScheduledMessage({
            senderId,
            receiverId,
            text,
            image: imgurl,
            scheduledTime,
            status: "pending",
        });

        await newScheduledMessage.save();

        res.status(200).json(newScheduledMessage);
    } catch (error) {
        console.log("Error in sendMessage controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
};



cron.schedule('* * * * *', async () => {
    console.log("In cron function");
    const currentTime = new Date();
    console.log(currentTime);
    
    try {
        // Fetch scheduled messages that need to be sent
        const messagesToSend = await ScheduledMessage.find({
            scheduledTime: { $lte: currentTime }, // Messages scheduled up to the current time
            status: 'pending'
        });

        for (const message of messagesToSend) {
            // Create a new message in the Message collection
            const newMessage = new Message({
                senderId: message.senderId,
                receiverId: message.receiverId,
                text: message.text,
                image: message.image,
            });

            await newMessage.save();

            // Emit the message to the receiver via Socket.io if they are online
            const receiverSocketId = getReceiverSocketId(message.receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }

            // Mark the scheduled message as "sent" and delete it from the ScheduledMessage collection
            await ScheduledMessage.findByIdAndDelete(message._id);
        }

        console.log(`Checked and sent scheduled messages at ${currentTime}`);
    } catch (error) {
        console.error("Error in cron job:", error);
    }
});