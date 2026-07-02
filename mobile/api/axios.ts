import axios from "axios";
import { useAuthStore } from "../store/auth.store";

// Use local host machine IP dynamically set by get-ip.js or fallback to standard ports
const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically inject the authentication token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to format errors and handle token expiration/unauthorized states
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "An unexpected error occurred. Please try again.";
    
    if (error.response) {
      // Server returned a response outside of 2xx range
      message = error.response.data?.message || message;
      
      // Auto-logout on unauthorized status code (unauthorized access / expired token)
      if (error.response.status === 401) {
        useAuthStore.getState().logout();
      }
    } else if (error.request) {
      // Request was made but no response received
      message = "Network error. Please check your internet connection.";
    }

    return Promise.reject(new Error(message));
  }
);
