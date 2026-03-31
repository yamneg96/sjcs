import express from "express";
import cors from "cors";
import { env } from "./config/env";

import authRoutes from "./modules/auth/auth.routes";
import ragRoutes from "./modules/rag/rag.routes";
import lisRoutes from "./modules/lis/lis.routes";
import materialsRoutes from "./modules/materials/materials.routes";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

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
 * 🏠 ROOT ROUTE (Simple UI)
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
          h1 {
            margin-bottom: 10px;
          }
          p {
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 SJCS Backend Running</h1>
          <p>Saint Joseph Catholic School API</p>
          <p>Status: <strong>Healthy</strong></p>
          <p>Visit <code>/api/health</code></p>
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

/**
 * ❌ ERROR HANDLER (ALWAYS LAST)
 */
app.use(errorHandler);

export default app;