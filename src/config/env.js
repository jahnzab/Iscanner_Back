import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: resolve(currentDir, "../../.env")
});

export const env = {
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  upiId: process.env.UPI_ID || "",
  upiName: process.env.UPI_NAME || "iScanner",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  port: Number(process.env.PORT || 4000)
};
