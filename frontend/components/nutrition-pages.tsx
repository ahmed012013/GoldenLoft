"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { OnboardingGuard } from "@/components/onboarding-guard";

// Hooks
import { useNutrition } from "@/hooks/useNutrition";

// Components
import { FeedingPlansManager } from "./nutrition/FeedingPlansManager";
import { SupplementsManager } from "./nutrition/SupplementsManager";
import { WaterManager } from "./nutrition/WaterManager";
import { FeedingPlanDialog } from "./nutrition/FeedingPlanDialog";
import { SupplementDialog } from "./nutrition/SupplementDialog";

interface NutritionPagesProps {
  currentPage: "feeding" | "supplements" | "water";
  onBack: () => void;
}

export function NutritionPages({ currentPage, onBack }: NutritionPagesProps) {
  const { t, dir } = useLanguage();
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  // Use the hook
  const {
    feedingPlans,
    supplements,
    waterSchedule,
    addFeedingPlan,
    deleteFeedingPlan,
    toggleFeedingPlanStatus,
    getTargetGroupLabel,
    getSupplementTypeLabel,
    getQualityLabel,
  } = useNutrition();

  // Dialog states (local UI state)
  const [showAddFeedingPlan, setShowAddFeedingPlan] = useState(false);
  const [showAddSupplement, setShowAddSupplement] = useState(false);

  const getPageTitle = () => {
    switch (currentPage) {
      case "feeding":
        return t("feedingPlansTitle" as any);
      case "supplements":
        return t("supplementsTitle" as any);
      case "water":
        return t("waterManagementTitle" as any);
      default:
        return t("nutritionManagement" as any);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "feeding":
        return (
          <>
            <FeedingPlansManager
              plans={feedingPlans}
              getTargetGroupLabel={getTargetGroupLabel}
              onAdd={() => setShowAddFeedingPlan(true)}
              onEdit={(id) => console.log("Edit plan", id)}
              onDelete={deleteFeedingPlan}
              onToggleStatus={toggleFeedingPlanStatus}
            />
            <FeedingPlanDialog
              open={showAddFeedingPlan}
              onOpenChange={setShowAddFeedingPlan}
              onSave={() => {
                // Placeholder save logic
                setShowAddFeedingPlan(false);
              }}
            />
          </>
        );
      case "supplements":
        return (
          <>
            <SupplementsManager
              supplements={supplements}
              getSupplementTypeLabel={getSupplementTypeLabel}
              onAdd={() => setShowAddSupplement(true)}
              onEdit={(id) => console.log("Edit supplement", id)}
              onDelete={(id) => console.log("Delete supplement", id)}
            />
            <SupplementDialog
              open={showAddSupplement}
              onOpenChange={setShowAddSupplement}
              onSave={() => setShowAddSupplement(false)}
            />
          </>
        );
      case "water":
        return (
          <WaterManager
            schedule={waterSchedule}
            getQualityLabel={getQualityLabel}
            onRefresh={(id) => console.log("Refresh water", id)}
            onEdit={(id) => console.log("Edit water", id)}
            onAdd={() => console.log("Add water schedule")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingGuard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-xl"
          >
            <BackIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
            <p className="text-sm text-muted-foreground">
              {t("nutritionManagement" as any)}
            </p>
          </div>
        </div>

        {/* Page Content */}
        {renderPage()}
      </motion.div>
    </OnboardingGuard>
  );
}
