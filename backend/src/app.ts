import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectDB } from "./config/db";

// Routes
import authRoutes from "./modules/auth/auth.routes";
import ragRoutes from "./modules/rag/rag.routes";
import lisRoutes from "./modules/lis/lis.routes";
import materialsRoutes from "./modules/materials/materials.routes";
import quizRoutes from "./modules/quiz/quiz.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import recommendationsRoutes from "./modules/recommendations/recommendation.routes";
import supportRoutes from "./modules/support-ai/support.routes";
import { initAdmin } from "./modules/auth/seed-admin";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

/**
 * 🗄️ DATABASE CONNECTION
 */
connectDB();

/**
 * 🌐 MIDDLEWARE
 */
app.use(
  cors({
    origin: env.NODE_ENV === "development" ? "*" : undefined,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

/**
 * 🏠 ROOT ROUTE
 */
app.get("/", (_req, res) => {
  res.send(`
    <html>
      <head>
        <title>SJCS Backend</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: linear-gradient(to right, #D32F2F, #1976D2);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            backdrop-filter: blur(10px);
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 SJCS Backend Running</h1>
          <p>Saint Joseph Catholic School API</p>
          <p>Status: <strong>Healthy</strong></p>
        </div>
      </body>
    </html>
  `);
});

/**
 * ❤️ HEALTH CHECK
 */
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/**
 * 🔌 API ROUTES
 */
app.use("/api/auth", authRoutes);
app.use("/api/ai", ragRoutes);
app.use("/api/lis", lisRoutes);
app.use("/api/materials", materialsRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/support", supportRoutes);

/**
 * ❌ ERROR HANDLER (ALWAYS LAST)
 */
app.use(errorHandler);

// Start background services
initAdmin();

export default app;