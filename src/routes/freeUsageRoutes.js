import { Router } from "express";
import { FreeUsage } from "../models/FreeUsage.js";
import { getClientIp } from "../utils/ip.js";

const router = Router();

router.post("/check", async (req, res) => {
  const { deviceId } = req.body;

  if (!deviceId) {
    return res.status(400).json({ message: "deviceId is required" });
  }

  const usage = await FreeUsage.findOne({ deviceId }).lean();
  return res.json({ used: Boolean(usage), usage });
});

router.post("/claim", async (req, res) => {
  const { deviceId } = req.body;

  if (!deviceId) {
    return res.status(400).json({ message: "deviceId is required" });
  }

  const existing = await FreeUsage.findOne({ deviceId }).lean();

  if (existing) {
    return res.json({ used: true, alreadyClaimed: true });
  }

  await FreeUsage.create({
    deviceId,
    ip: getClientIp(req)
  });

  return res.json({ used: true });
});

export default router;
