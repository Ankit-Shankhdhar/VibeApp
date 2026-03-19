import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
    // baseURL: "/api",
    // withCredentials: true, // You can comment this out or leave it, it won't hurt
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    
    // 👇 ADDED THESE LOGS TO CATCH THE BUG
    console.log("🕵️‍♂️ Token found in LocalStorage:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Sending Header:", config.headers.Authorization);
    } else {
        console.log("🚨 NO TOKEN FOUND IN LOCAL STORAGE!");
    }
    
    return config;
});

API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default API;