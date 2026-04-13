import mongoose from "mongoose";

const accessTokenSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    plan: { type: String, required: true },
    jwtToken: { type: String, required: true },
    utr: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

accessTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AccessToken = mongoose.model("AccessToken", accessTokenSchema);
