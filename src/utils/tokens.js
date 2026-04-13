import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { getPlanConfig } from "../config/plans.js";

export function createAccessPayload(email, planId) {
  const plan = getPlanConfig(planId);
  const expiresAt = new Date();

  if (plan.durationDays > 0) {
    expiresAt.setDate(expiresAt.getDate() + plan.durationDays - 1);
  }

  expiresAt.setHours(23, 59, 59, 999);

  return {
    email,
    plan: plan.id,
    features: plan.features,
    expiry: expiresAt.toISOString()
  };
}

export function signAccessToken(payload) {
  const expirySeconds = Math.max(
    1,
    Math.floor((new Date(payload.expiry).getTime() - Date.now()) / 1000)
  );

  return jwt.sign(payload, env.jwtSecret, { expiresIn: expirySeconds });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function signAdminToken() {
  return jwt.sign({ role: "admin" }, env.jwtSecret, { expiresIn: "12h" });
}
