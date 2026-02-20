
"use client";

import { useLanguage } from "@/lib/language-context";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OnboardingGuard } from "@/components/onboarding-guard";
import { PairingsTab } from "@/components/breeding/PairingsTab";
import { EggsTab } from "@/components/breeding/EggsTab";
import { SquabsTab } from "@/components/breeding/SquabsTab";

export function BreedingPages({
  currentPage,
  onBack,
}: {
  currentPage: "pairings" | "eggs" | "squabs";
  onBack: () => void;
}) {
  const { t, dir } = useLanguage();

  return (
    <OnboardingGuard>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1
              className={cn(
                "text-2xl font-bold",
                dir === "rtl" && "text-right"
              )}
            >
              {currentPage === "pairings" && t("pairingsTitle")}
              {currentPage === "eggs" && t("eggsTitle")}
              {currentPage === "squabs" && t("youngPigeonsTitle")}
            </h1>
          </div>
        </div>

        {/* Content */}
        {currentPage === "pairings" && <PairingsTab />}
        {currentPage === "eggs" && <EggsTab />}
        {currentPage === "squabs" && <SquabsTab />}
      </div>
    </OnboardingGuard>
  );
}
