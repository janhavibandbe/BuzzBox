import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async(req, res) => {
    try {
        const loggedInUserId = req.user.id;
        let users = await User.find().select("-password");

        users = users.sort((a, b) => {
            if (a._id.toString() === loggedInUserId) return -1;
            if (b._id.toString() === loggedInUserId) return 1;
            return 0;
        });
        const otherUsers = users.filter(user => user._id.toString() !== loggedInUserId);

        const usersWithLastMsg = await Promise.all(
            otherUsers.map(async (user) => {
                const lastMessage = await Message.findOne({
                    $or: [
                        { senderId: loggedInUserId, receiverId: user._id },
                        { senderId: user._id, receiverId: loggedInUserId }
                    ]
                }).sort({ createdAt: -1 }); // get latest message

                return {
                    user,
                    lastMessageTime: lastMessage ? lastMessage.createdAt : new Date(0), // earliest possible date if no messages
                };
            })
        );

        usersWithLastMsg.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        const finalUserList = [
            users.find(u => u._id.toString() === loggedInUserId),
            ...usersWithLastMsg.map(item => item.user)
        ];
        res.status(200).json(finalUserList);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getMessages = async(req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const sendMessage = async(req, res) => {
    try {
        const { text, image, imageName } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        console.log(imageName);

        // let imgurl;
        // if(image) {
        //     //upload base64 image to cloudinary
        //     const uploadResponse = await cloudinary.uploader.upload(image);
        //     imgurl = uploadResponse.secure_url;
        // }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image,
            imageName,
        });

        await newMessage.save();

        //todo: realtime fucnctionality using socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

    res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller"+ error.message);
        res.status(500).json({message: "Internal server error"});
    }
};