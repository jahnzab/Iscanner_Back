import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { connectDb } from "./db/connect.js";
import accessRoutes from "./routes/accessRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import freeUsageRoutes from "./routes/freeUsageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    name: "iScanner backend",
    status: "ok",
    docs: "/docs",
    health: "/api/health"
  });
});

app.get("/api", (_req, res) => {
  res.json({
    name: "iScanner API",
    routes: [
      "/api/health",
      "/api/public/config",
      "/api/free-usage/*",
      "/api/payments/*",
      "/api/access/*",
      "/api/admin/*"
    ]
  });
});

app.get("/docs", (_req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>iScanner API Docs</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #111827; }
          code, pre { background: #f3f4f6; padding: 2px 6px; border-radius: 6px; }
          .card { max-width: 760px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>iScanner API Docs</h1>
          <p>Backend is running. Use these routes:</p>
          <ul>
            <li><code>GET /api/health</code></li>
            <li><code>GET /api/public/config</code></li>
            <li><code>POST /api/admin/login</code></li>
            <li><code>POST /api/access/validate</code></li>
            <li><code>POST /api/access/recover</code></li>
            <li><code>POST /api/free-usage/check</code></li>
            <li><code>POST /api/free-usage/claim</code></li>
            <li><code>POST /api/payments/initiate</code></li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/public/config", (_req, res) => {
  res.json({
    upiId: env.upiId,
    upiName: env.upiName
  });
});

app.use("/api/free-usage", freeUsageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

connectDb()
  .catch((error) => {
    console.error("MongoDB connection failed", error.message);
  })
  .finally(() => {
    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  });
