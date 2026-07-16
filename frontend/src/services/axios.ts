import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ── Request Interceptor: Attach JWT ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sjcs_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Normalize errors ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Unauthorized → clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("sjcs_token");
      localStorage.removeItem("sjcs_user");
      // Only redirect if not already on an auth page
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    // Extract a human-readable error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    // Attach extracted message for easy access in catch blocks
    error.extractedMessage = message;

    return Promise.reject(error);
  }
);

export default api;
