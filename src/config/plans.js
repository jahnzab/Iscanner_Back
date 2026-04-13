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
    name: "1 Day Pass",
    amount: 15,
    durationDays: 1,
    features: {
      unlimitedScans: true,
      ocr: true,
      multiPagePdf: true,
      cleanExport: true
    }
  },
  fiveDay: {
    id: "fiveDay",
    name: "5 Day Pass",
    amount: 40,
    durationDays: 5,
    features: {
      unlimitedScans: true,
      ocr: true,
      multiPagePdf: true,
      cleanExport: true
    }
  },
  weekly: {
    id: "weekly",
    name: "Weekly Pass",
    amount: 79,
    durationDays: 7,
    features: {
      unlimitedScans: true,
      ocr: true,
      multiPagePdf: true,
      cleanExport: true
    }
  },
  monthly: {
    id: "monthly",
    name: "Monthly Pass",
    amount: 199,
    durationDays: 30,
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
