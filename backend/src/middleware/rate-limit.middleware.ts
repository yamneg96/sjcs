import rateLimit from "express-rate-limit";
import { env } from "../config/env";
import { sendError } from "../shared/utils/api-response";

// Rate limit helper for public endpoints
export const publicRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, 
  max: env.RATE_LIMIT_MAX, 
  standardHeaders: true, 
  legacyHeaders: false, 
  handler: (req, res) => {
    sendError(res, "Too many requests from this IP, please try again later.", 429);
  },
});

// Stricter rate limit for authentication routes to prevent brute force
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, "Too many auth attempts from this IP, please try again in 15 minutes.", 429);
  },
});
