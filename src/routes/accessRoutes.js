import { Router } from "express";
import { AccessToken } from "../models/AccessToken.js";
import { Payment } from "../models/Payment.js";
import { RevokedUTR } from "../models/RevokedUTR.js";
import { verifyAccessToken } from "../utils/tokens.js";

const router = Router();

router.post("/validate", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ valid: false, message: "Token required" });
  }

  try {
    const decoded = verifyAccessToken(token);
    const saved = await AccessToken.findOne({ jwtToken: token, isActive: true }).lean();

    if (!saved) {
      return res.status(401).json({ valid: false, message: "Token revoked or missing" });
    }

    const revoked = await RevokedUTR.findOne({ utr: saved.utr }).lean();

    if (revoked) {
      return res.status(401).json({ valid: false, message: "UTR revoked" });
    }

    return res.json({ valid: true, payload: decoded });
  } catch {
    return res.status(401).json({ valid: false, message: "Token invalid or expired" });
  }
});

router.post("/recover", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const access = await AccessToken.findOne({
    email,
    isActive: true,
    expiresAt: { $gt: new Date() }
  })
    .sort({ expiresAt: -1 })
    .lean();

  if (!access) {
    const payment = await Payment.findOne({ email: String(email).trim().toLowerCase() })
      .sort({ createdAt: -1 })
      .lean();

    if (!payment) {
      return res.status(404).json({ message: "No payment found for that email" });
    }

    return res.json({
      paymentStatus: payment.status,
      payment
    });
  }

  const payload = verifyAccessToken(access.jwtToken);

  return res.json({
    token: access.jwtToken,
    plan: access.plan,
    expiresAt: access.expiresAt,
    access: payload
  });
});

export default router;
