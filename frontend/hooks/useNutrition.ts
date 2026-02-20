import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

// Interfaces (extracted from original file or defined here if missing)
export interface FeedingPlan {
  id: number;
  name: string;
  nameAr: string;
  targetGroup: string;
  feedType: string;
  morningAmount: string;
  eveningAmount: string;
  isActive: boolean;
  pigeonCount: number;
}

export interface Supplement {
  id: number;
  name: string;
  nameAr: string;
  type: string;
  dosage: string;
  frequency: string; // updated to match usage in nutrition-pages.tsx "twice_weekly", "after_race", etc.
  purpose: string;
  purposeAr: string;
  inStock: boolean;
}

export interface WaterSchedule {
  id: number;
  loft: string;
  loftAr: string;
  lastChange: string;
  nextChange: string;
  quality: string;
  additive: string;
  additiveAr: string;
}

// Sample Data (moved from nutrition-pages.tsx)
const initialFeedingPlans: FeedingPlan[] = [
  {
    id: 1,
    name: "Racing Season Plan",
    nameAr: "خطة موسم السباق",
    targetGroup: "racing",
    feedType: "mix",
    morningAmount: "30g",
    eveningAmount: "25g",
    isActive: true,
    pigeonCount: 24,
  },
  {
    id: 2,
    name: "Breeding Plan",
    nameAr: "خطة التفريخ",
    targetGroup: "breeding",
    feedType: "pellet",
    morningAmount: "35g",
    eveningAmount: "30g",
    isActive: true,
    pigeonCount: 12,
  },
  {
    id: 3,
    name: "Young Birds Plan",
    nameAr: "خطة الزغاليل",
    targetGroup: "young",
    feedType: "seed",
    morningAmount: "20g",
    eveningAmount: "20g",
    isActive: false,
    pigeonCount: 8,
  },
];

const initialSupplements: Supplement[] = [
  {
    id: 1,
    name: "Vitamin B Complex",
    nameAr: "فيتامين ب المركب",
    type: "vitamin",
    dosage: "5ml/L",
    frequency: "weekly",
    purpose: "Energy & metabolism",
    purposeAr: "الطاقة والتمثيل الغذائي",
    inStock: true,
  },
  {
    id: 2,
    name: "Calcium Plus",
    nameAr: "كالسيوم بلس",
    type: "mineral",
    dosage: "10ml/L",
    frequency: "daily",
    purpose: "Bone health & egg quality",
    purposeAr: "صحة العظام وجودة البيض",
    inStock: true,
  },
  {
    id: 3,
    name: "Probiotics",
    nameAr: "بروبيوتيك",
    type: "probiotic",
    dosage: "3g/L",
    frequency: "twice_weekly",
    purpose: "Digestive health",
    purposeAr: "صحة الجهاز الهضمي",
    inStock: false,
  },
  {
    id: 4,
    name: "Electrolytes",
    nameAr: "إلكتروليتات",
    type: "electrolyte",
    dosage: "15ml/L",
    frequency: "after_race",
    purpose: "Recovery after racing",
    purposeAr: "التعافي بعد السباق",
    inStock: true,
  },
];

const initialWaterSchedule: WaterSchedule[] = [
  {
    id: 1,
    loft: "Main Loft",
    loftAr: "اللوفت الرئيسي",
    lastChange: "2024-01-15 08:00",
    nextChange: "2024-01-15 18:00",
    quality: "good",
    additive: "Vitamin C",
    additiveAr: "فيتامين سي",
  },
  {
    id: 2,
    loft: "Breeding Loft",
    loftAr: "لوفت التفريخ",
    lastChange: "2024-01-15 07:30",
    nextChange: "2024-01-15 17:30",
    quality: "good",
    additive: "None",
    additiveAr: "بدون",
  },
  {
    id: 3,
    loft: "Young Birds Loft",
    loftAr: "لوفت الزغاليل",
    lastChange: "2024-01-14 18:00",
    nextChange: "2024-01-15 08:00",
    quality: "fair",
    additive: "Probiotics",
    additiveAr: "بروبيوتيك",
  },
];

export function useNutrition() {
  const { t } = useLanguage();
  const [feedingPlans, setFeedingPlans] =
    useState<FeedingPlan[]>(initialFeedingPlans);
  const [supplements, setSupplements] =
    useState<Supplement[]>(initialSupplements);
  const [waterSchedule, setWaterSchedule] =
    useState<WaterSchedule[]>(initialWaterSchedule);

  // Helper functions for labels
  const getTargetGroupLabel = (group: string) => {
    const groups: Record<string, string> = {
      all: t("allPigeonsGroup" as any),
      racing: t("racingPigeonsGroup" as any),
      breeding: t("breedingPigeonsGroup" as any),
      young: t("youngPigeonsGroup" as any),
      sick: t("sickPigeonsGroup" as any),
      molting: t("moltingPigeonsGroup" as any),
    };
    return groups[group] || group;
  };

  const getSupplementTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      vitamin: t("vitaminSupplement" as any),
      mineral: t("mineralSupplement" as any),
      probiotic: t("probioticSupplement" as any),
      electrolyte: t("electrolytesSupplement" as any),
      amino: t("aminoAcidSupplement" as any),
      energy: t("energySupplement" as any),
    };
    return types[type] || type;
  };

  const getQualityLabel = (quality: string) => {
    const qualities: Record<string, string> = {
      good: t("goodQuality" as any),
      fair: t("fairQuality" as any),
      poor: t("poorQuality" as any),
    };
    return qualities[quality] || quality;
  };

  // Actions (placeholders for API calls)
  const addFeedingPlan = (plan: FeedingPlan) => {
    setFeedingPlans([...feedingPlans, plan]);
  };

  const deleteFeedingPlan = (id: number) => {
    setFeedingPlans(feedingPlans.filter((p) => p.id !== id));
  };

  const toggleFeedingPlanStatus = (id: number) => {
    setFeedingPlans(
      feedingPlans.map((p) =>
        p.id === id ? { ...p, isActive: !p.isActive } : p,
      ),
    );
  };

  return {
    feedingPlans,
    supplements,
    waterSchedule,
    addFeedingPlan,
    deleteFeedingPlan,
    toggleFeedingPlanStatus,
    getTargetGroupLabel,
    getSupplementTypeLabel,
    getQualityLabel,
  };
}
