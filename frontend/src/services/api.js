import axios from "axios";

const DEFAULT_API_URL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://agrolink-project.onrender.com/api";

const apiBaseURL = import.meta.env.DEV
  ? DEFAULT_API_URL
  : import.meta.env.VITE_API_URL || DEFAULT_API_URL;

const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

if (import.meta.env.DEV && import.meta.env.VITE_API_URL) {
  console.warn('VITE_API_URL is set in development but local API will be used:', apiBaseURL);
}

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
