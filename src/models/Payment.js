import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    utr: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    ip: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export const Payment = mongoose.model("Payment", paymentSchema);
