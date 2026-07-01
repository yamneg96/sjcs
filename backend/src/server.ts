import app from "./app";
import { env } from "./config/env";

const HOST = '0.0.0.0'
const server = app.listen(env.PORT, HOST, () => {
  console.log(`🚀 Lumora Platform Backend running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
  console.error("❌ UNHANDLED REJECTION! Shutting down...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle graceful shutdown signals
const gracefulShutdown = () => {
  console.log("👋 Shutting down gracefully...");
  server.close(() => {
    console.log("💥 Process terminated.");
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);