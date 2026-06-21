import axios from "axios";

const DEFAULT_API_URL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://agrolink-project.onrender.com/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || DEFAULT_API_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    if (userInfo?.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
