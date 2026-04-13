import mongoose from "mongoose";

const revokedUtrSchema = new mongoose.Schema(
  {
    utr: { type: String, required: true, unique: true, index: true },
    reason: { type: String, required: true },
    revokedAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export const RevokedUTR = mongoose.model("RevokedUTR", revokedUtrSchema);
