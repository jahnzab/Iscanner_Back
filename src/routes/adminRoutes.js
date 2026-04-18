import { Router } from "express";
import { env } from "../config/env.js";
import { requireAdmin } from "../middleware/auth.js";
import { AccessToken } from "../models/AccessToken.js";
import { Payment } from "../models/Payment.js";
import { RevokedUTR } from "../models/RevokedUTR.js";
import { issueAccessToken, signAdminToken } from "../utils/tokens.js";

const router = Router();

router.post("/login", (req, res) => {
  const password = String(req.body.password || "").trim();

  if (password !== String(env.adminPassword || "").trim()) {
    return res.status(401).json({ message: "Invalid password" });
  }

  return res.json({ token: signAdminToken() });
});

router.get("/payments", requireAdmin, async (_req, res) => {
  const payments = await Payment.find().sort({ createdAt: -1 }).lean();
  return res.json({ payments });
});

router.post("/payments/:id/approve", requireAdmin, async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  const { payload, jwtToken } = issueAccessToken(payment.email, payment.plan);

  await AccessToken.deleteMany({ utr: payment.utr });
  await AccessToken.create({
    email: payment.email,
    plan: payment.plan,
    jwtToken,
    utr: payment.utr,
    expiresAt: payload.expiry,
    isActive: true
  });

  payment.status = "approved";
  await payment.save();

  return res.json({ payment: payment.toObject(), access: payload });
});

router.post("/payments/:id/reject", requireAdmin, async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  payment.status = "rejected";
  await payment.save();

  await AccessToken.updateMany({ utr: payment.utr }, { isActive: false });

  await RevokedUTR.updateOne(
    { utr: payment.utr },
    {
      utr: payment.utr,
      reason: req.body.reason || "Rejected by admin",
      revokedAt: new Date()
    },
    { upsert: true }
  );

  return res.json({ payment });
});

export default router;
