export const PLAN_CONFIG = {
  free: {
    id: "free",
    name: "Free Scan",
    amount: 0,
    durationDays: 0,
    features: {
      unlimitedScans: false,
      ocr: false,
      multiPagePdf: true,
      cleanExport: false
    }
  },
  day: {
    id: "day",
    name: "3 Day Pass",
    amount: 10,
    durationDays: 3,
    features: {
      unlimitedScans: true,
      ocr: true,
      multiPagePdf: true,
      cleanExport: true
    }
  },
  fiveDay: {
    id: "fiveDay",
    name: "7 Day Pass",
    amount: 20,
    durationDays: 7,
    features: {
      unlimitedScans: true,
      ocr: true,
      multiPagePdf: true,
      cleanExport: true
    }
  },
  weekly: {
    id: "weekly",
    name: "1 Month Pass",
    amount: 79,
    durationDays: 30,
    features: {
      unlimitedScans: true,
      ocr: true,
      multiPagePdf: true,
      cleanExport: true
    }
  },
  monthly: {
    id: "monthly",
    name: "3 Month Pass",
    amount: 199,
    durationDays: 90,
    features: {
      unlimitedScans: true,
      ocr: true,
      multiPagePdf: true,
      cleanExport: true
    }
  }
};

export function getPlanConfig(planId) {
  return PLAN_CONFIG[planId];
}
