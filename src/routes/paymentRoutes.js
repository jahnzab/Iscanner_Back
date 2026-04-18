import { Router } from "express";
import { getPlanConfig, PLAN_CONFIG } from "../config/plans.js";
import { Payment } from "../models/Payment.js";
import { RevokedUTR } from "../models/RevokedUTR.js";
import { getClientIp } from "../utils/ip.js";

const router = Router();

router.get("/plans", (_req, res) => {
  return res.json({
    plans: Object.values(PLAN_CONFIG).filter((plan) => plan.id !== "free")
  });
});

router.post("/initiate", async (req, res) => {
  const { utr, email, plan: planId } = req.body;

  if (!utr || !email || !planId) {
    return res.status(400).json({ message: "utr, email and plan are required" });
  }

  const cleanUtr = String(utr).trim();
  const cleanEmail = String(email).trim().toLowerCase();
  const plan = getPlanConfig(planId);

  if (!plan || plan.id === "free") {
    return res.status(400).json({ message: "Invalid plan" });
  }

  const revoked = await RevokedUTR.findOne({ utr: cleanUtr }).lean();

  if (revoked) {
    return res.status(403).json({ message: "This UTR has been blacklisted" });
  }

  const existingPayment = await Payment.findOne({ utr: cleanUtr }).lean();

  if (existingPayment) {
    return res.status(409).json({ message: "This UTR already exists" });
  }

  await Payment.create({
    utr: cleanUtr,
    email: cleanEmail,
    plan: plan.id,
    amount: plan.amount,
    status: "pending",
    ip: getClientIp(req)
  });

  return res.status(201).json({
    message: "Payment saved as pending. Admin approval is required before access is unlocked.",
    status: "pending",
    payment: {
      email: cleanEmail,
      utr: cleanUtr,
      plan: plan.id,
      amount: plan.amount
    }
  });
});

export default router;
