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
