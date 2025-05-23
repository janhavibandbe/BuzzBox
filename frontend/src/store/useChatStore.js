import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({isUsersLoading: true});

        try {
            const res = await axiosInstance.get('/message/users');
            set({users: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading: true});

        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            const sortedMessages = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            set({messages: sortedMessages});
            console.log(res.data);
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isMessagesLoading: false});
        }
    },

    sendMessages: async (messageData) => {
        const { selectedUser, messages } = get();

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data]});
            const result = await axiosInstance.get('/message/users');
            set({users: result.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    sendScheduledMessages: async (scheduledMessageData) => {
        const { selectedUser, messages } = get();

        try {
            const res = await axiosInstance.post(`/scheduledMessage/send/${selectedUser._id}`, scheduledMessageData);
            set({messages: [...messages, res.data]});
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;

            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));