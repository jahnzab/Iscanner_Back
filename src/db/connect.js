import mongoose from "mongoose";
import { env } from "../config/env.js";

export async function connectDb() {
  if (!env.mongoUri) {
    console.warn("MONGODB_URI is not set. Database-backed features will fail until configured.");
    return;
  }

  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
}
