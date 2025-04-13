import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://buzzbox-hhiy.onrender.com/api",
    withCredentials: true,
})