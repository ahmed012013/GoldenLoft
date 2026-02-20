import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/language-context";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

// Interfaces matching the backend models
export interface FeedingPlan {
  id: string;
  name: string;
  nameAr: string | null;
  targetGroup: string;
  feedType: string;
  morningAmount: string;
  eveningAmount: string;
  isActive: boolean;
  pigeonCount: number;
}

export interface Supplement {
  id: string;
  name: string;
  nameAr: string | null;
  type: string;
  dosage: string;
  frequency: string;
  purpose: string | null;
  purposeAr: string | null;
  inStock: boolean;
}

export interface WaterSchedule {
  id: string;
  loft: string;
  loftAr: string | null;
  lastChange: string;
  nextChange: string;
  quality: string;
  additive: string | null;
  additiveAr: string | null;
}

export interface CreateFeedingPlanData {
  name: string;
  nameAr?: string;
  targetGroup: string;
  feedType: string;
  morningAmount: string;
  eveningAmount: string;
  isActive?: boolean;
  pigeonCount?: number;
}

export interface CreateSupplementData {
  name: string;
  nameAr?: string;
  type: string;
  dosage: string;
  frequency: string;
  purpose?: string;
  purposeAr?: string;
  inStock?: boolean;
}

export interface CreateWaterScheduleData {
  loft: string;
  loftAr?: string;
  lastChange: string;
  nextChange: string;
  quality: string;
  additive?: string;
  additiveAr?: string;
}

export function useNutrition() {
  const { t } = useLanguage();
  const [feedingPlans, setFeedingPlans] = useState<FeedingPlan[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [waterSchedule, setWaterSchedule] = useState<WaterSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── Fetch Data ──────────────────────────────────────────

  const fetchFeedingPlans = useCallback(async () => {
    try {
      const { data } = await apiClient.get("/nutrition/feeding-plans");
      setFeedingPlans(data);
    } catch {
      console.error("Failed to fetch feeding plans");
    }
  }, []);

  const fetchSupplements = useCallback(async () => {
    try {
      const { data } = await apiClient.get("/nutrition/supplements");
      setSupplements(data);
    } catch {
      console.error("Failed to fetch supplements");
    }
  }, []);

  const fetchWaterSchedules = useCallback(async () => {
    try {
      const { data } = await apiClient.get("/nutrition/water-schedules");
      setWaterSchedule(data);
    } catch {
      console.error("Failed to fetch water schedules");
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchFeedingPlans(),
        fetchSupplements(),
        fetchWaterSchedules(),
      ]);
      setLoading(false);
    };
    loadAll();
  }, [fetchFeedingPlans, fetchSupplements, fetchWaterSchedules]);

  // ─── Label Helpers ───────────────────────────────────────

  const getTargetGroupLabel = (group: string) => {
    const groups: Record<string, string> = {
      all: t("allPigeonsGroup"),
      racing: t("racingPigeonsGroup"),
      breeding: t("breedingPigeonsGroup"),
      young: t("youngPigeonsGroup"),
      sick: t("sickPigeonsGroup"),
      molting: t("moltingPigeonsGroup"),
    };
    return groups[group] || group;
  };

  const getSupplementTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      vitamin: t("vitaminSupplement"),
      mineral: t("mineralSupplement"),
      probiotic: t("probioticSupplement"),
      electrolyte: t("electrolytesSupplement"),
      amino: t("aminoAcidSupplement"),
      energy: t("energySupplement"),
    };
    return types[type] || type;
  };

  const getQualityLabel = (quality: string) => {
    const qualities: Record<string, string> = {
      good: t("goodQuality"),
      fair: t("fairQuality"),
      poor: t("poorQuality"),
    };
    return qualities[quality] || quality;
  };

  // ─── Feeding Plan Actions ────────────────────────────────

  const addFeedingPlan = async (planData: CreateFeedingPlanData) => {
    try {
      const { data } = await apiClient.post("/nutrition/feeding-plans", planData);
      setFeedingPlans((prev) => [data, ...prev]);
      toast.success(t("saveFeedingPlan"));
      return data;
    } catch {
      toast.error(t("error" as any));
    }
  };

  const deleteFeedingPlan = async (id: string) => {
    try {
      await apiClient.delete(`/nutrition/feeding-plans/${id}`);
      setFeedingPlans((prev) => prev.filter((p) => p.id !== id));
      toast.success(t("deleteFeedingPlan"));
    } catch {
      toast.error(t("error" as any));
    }
  };

  const toggleFeedingPlanStatus = async (id: string) => {
    const plan = feedingPlans.find((p) => p.id === id);
    if (!plan) return;
    try {
      const { data } = await apiClient.patch(`/nutrition/feeding-plans/${id}`, {
        isActive: !plan.isActive,
      });
      setFeedingPlans((prev) => prev.map((p) => (p.id === id ? data : p)));
    } catch {
      toast.error(t("error" as any));
    }
  };

  // ─── Supplement Actions ──────────────────────────────────

  const addSupplement = async (supplementData: CreateSupplementData) => {
    try {
      const { data } = await apiClient.post("/nutrition/supplements", supplementData);
      setSupplements((prev) => [data, ...prev]);
      toast.success(t("saveSupplement"));
      return data;
    } catch {
      toast.error(t("error" as any));
    }
  };

  const deleteSupplement = async (id: string) => {
    try {
      await apiClient.delete(`/nutrition/supplements/${id}`);
      setSupplements((prev) => prev.filter((s) => s.id !== id));
      toast.success(t("deleteSupplement"));
    } catch {
      toast.error(t("error" as any));
    }
  };

  // ─── Water Schedule Actions ──────────────────────────────

  const addWaterSchedule = async (scheduleData: CreateWaterScheduleData) => {
    try {
      const { data } = await apiClient.post("/nutrition/water-schedules", scheduleData);
      setWaterSchedule((prev) => [data, ...prev]);
      toast.success(t("scheduleWaterChange"));
      return data;
    } catch {
      toast.error(t("error" as any));
    }
  };

  const deleteWaterSchedule = async (id: string) => {
    try {
      await apiClient.delete(`/nutrition/water-schedules/${id}`);
      setWaterSchedule((prev) => prev.filter((w) => w.id !== id));
      toast.success(t("completed"));
    } catch {
      toast.error(t("error" as any));
    }
  };

  const refreshWater = async (id: string) => {
    // "Refresh" = update lastChange to now, nextChange to +10hrs
    const now = new Date();
    const next = new Date(now.getTime() + 10 * 60 * 60 * 1000);
    try {
      const { data } = await apiClient.patch(`/nutrition/water-schedules/${id}`, {
        lastChange: now.toISOString(),
        nextChange: next.toISOString(),
        quality: "good",
      });
      setWaterSchedule((prev) => prev.map((w) => (w.id === id ? data : w)));
      toast.success(t("changeWater"));
    } catch {
      toast.error(t("error" as any));
    }
  };

  return {
    feedingPlans,
    supplements,
    waterSchedule,
    loading,
    addFeedingPlan,
    deleteFeedingPlan,
    toggleFeedingPlanStatus,
    addSupplement,
    deleteSupplement,
    addWaterSchedule,
    deleteWaterSchedule,
    refreshWater,
    getTargetGroupLabel,
    getSupplementTypeLabel,
    getQualityLabel,
  };
}
