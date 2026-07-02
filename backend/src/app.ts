import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/error.middleware";
import { publicRateLimiter } from "./middleware/rate-limit.middleware";
import { sendSuccess } from "./shared/utils/api-response";

import authRoutes from "./modules/auth/auth.routes";
import organizationRoutes from "./modules/organizations/organization.routes";
import memberRoutes from "./modules/members/member.routes";
import subjectRoutes from "./modules/subjects/subject.routes";
import materialRoutes from "./modules/materials/material.routes";
import chatRoutes from "./modules/chat/chat.routes";
import quizRoutes from "./modules/quiz/quiz.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import recommendationRoutes from "./modules/recommendations/recommendation.routes";
import lisRoutes from "./modules/lis/lis.routes";
import billingRoutes from "./modules/billing/billing.routes";
import supportRoutes from "./modules/support/support.routes";
import searchRoutes from "./modules/search/search.routes";
import admissionRoutes from "./modules/admissions/admission.routes";
import storageRoutes from "./modules/storage/storage.routes";

const app = express();
// ... (omitting lines for spacing alignment, let's keep exact matches)

// --- ADD THIS LINE ---
app.set('trust proxy', 1);

/**
 * 🗄️ DATABASE CONNECTION
 */
connectDB();

/**
 * 🛡️ SECURITY MIDDLEWARS
 */
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://stjoseph-beryl.vercel.app" // maintaining compatibility
    ],
    credentials: true,
  })
);

/**
 * 📈 LOGGING & RATING
 */
if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
}
app.use(publicRateLimiter);

/**
 * 📦 PARSING
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/**
 * 🏠 ROOT & HEALTH CHECK ROUTES
 */
app.get("/", (_req, res) => {
  res.send(`
    <html>
      <head>
        <title>Lumora Platform API</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 40px;
            border-radius: 24px;
            text-align: center;
            backdrop-filter: blur(20px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            max-width: 400px;
            width: 100%;
          }
          h1 {
            margin: 0 0 10px 0;
            font-size: 2.2rem;
            background: linear-gradient(to right, #38bdf8, #818cf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p {
            color: #94a3b8;
            font-size: 1.1rem;
            margin: 0 0 24px 0;
          }
          .status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.1);
            color: #34d399;
            padding: 8px 16px;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 0.9rem;
          }
          .dot {
            width: 8px;
            height: 8px;
            background-color: #10b981;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 10px #10b981;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Lumora Platform API</h1>
          <p>Multi-tenant AI Education Platform</p>
          <div class="status">
            <span class="dot"></span>
            Operational
          </div>
        </div>
      </body>
    </html>
  `);
});

app.get("/api/health", (_req, res) => {
  sendSuccess(res, {
    status: "ok",
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV
  }, "Lumora service is healthy");
});

/**
 * 🔌 API ROUTES
 */
app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/lis", lisRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/storage", storageRoutes);

/**
 * ❌ GLOBAL ERROR HANDLER (ALWAYS LAST)
 */
app.use(errorHandler);

export default app;