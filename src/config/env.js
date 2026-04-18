import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: resolve(currentDir, "../../.env")
});

function readEnv(...keys) {
  for (const key of keys) {
    const value = process.env[key];
    if (value && String(value).trim()) {
      return String(value).trim();
    }
  }

  return "";
}

export const env = {
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  upiId: readEnv("UPI_ID", "UPI_D", "upi_id", "upi_d"),
  upiName: readEnv("UPI_NAME", "upi_name") || "iScanner",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  port: Number(process.env.PORT || 4000)
};
