import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGO_URI: process.env.MONGO_URI || "",
  DB_NAME: process.env.DB_NAME || "lumora",
  JWT_SECRET: process.env.JWT_SECRET || "fallback_secret",
  // Access-token lifetime. Once web + mobile clients use the refresh flow this
  // should drop to ~15m (§13.2); kept longer by default so current clients
  // (which don't yet refresh) are not logged out mid-session.
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  // Rotating refresh-token lifetime, in days.
  JWT_REFRESH_EXPIRES_DAYS: parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS || "30", 10),
  
  // AI Keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  // Ethio-ASR: Amharic/English speech-to-text behind the AI Gateway (§24.2).
  // When unset, the gateway falls back to a Whisper-class provider, then to a
  // sandbox stub — the voice pipeline degrades honestly rather than crashing.
  ETHIO_ASR_URL: process.env.ETHIO_ASR_URL || "",
  ETHIO_ASR_API_KEY: process.env.ETHIO_ASR_API_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  
  // Cloudflare R2 Storage (S3-compatible)
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID || "",
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || "",
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || "",
  R2_BUCKET_PUBLIC: process.env.R2_BUCKET_PUBLIC || "lumora-public",
  R2_BUCKET_PRIVATE: process.env.R2_BUCKET_PRIVATE || "lumora-private",
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL || "", // Custom domain or R2 public URL

  // Cloudinary (Legacy fallback — optional)
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  
  // SMTP Config (Brevo SMTP relay primary)
  SMTP_HOST: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || "no-reply@lumora.edu",

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),

  // Platform properties
  BONSAI_CDN_URL: process.env.BONSAI_CDN_URL || "https://models.lumora-cdn.net",
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;
