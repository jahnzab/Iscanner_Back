import mongoose from "mongoose";

const freeUsageSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    usedAt: { type: Date, default: Date.now },
    ip: { type: String, default: "" }
  },
  { timestamps: false }
);

export const FreeUsage = mongoose.model("FreeUsage", freeUsageSchema);
