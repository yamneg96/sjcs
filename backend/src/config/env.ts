import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGO_URI: process.env.MONGO_URI || "",
  DB_NAME: process.env.DB_NAME || "lumora",
  JWT_SECRET: process.env.JWT_SECRET || "fallback_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  
  // AI Keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  
  // Storage (Cloudinary)
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  
  // SMTP Config (Stubs allowed)
  SMTP_HOST: process.env.SMTP_HOST || "smtp.mailtrap.io",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "2525", 10),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || "no-reply@lumora.edu",

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 mins
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),

  // Platform properties
  BONSAI_CDN_URL: process.env.BONSAI_CDN_URL || "https://models.lumora-cdn.net",
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;
