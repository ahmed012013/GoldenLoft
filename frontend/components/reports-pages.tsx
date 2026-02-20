"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { OnboardingGuard } from "@/components/onboarding-guard";

// Components
import { PigeonAnalysis } from "./reports/PigeonAnalysis";
import { BreedingAnalysis } from "./reports/BreedingAnalysis";
import { FinancialAnalysis } from "./reports/FinancialAnalysis";

export interface ReportsPagesProps {
  currentPage: "pigeons" | "financial" | "breeding";
  onBack: () => void;
}

export function ReportsPages({ currentPage, onBack }: ReportsPagesProps) {
  const { t, dir } = useLanguage();
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  const renderContent = () => {
    switch (currentPage) {
      case "pigeons":
        return <PigeonAnalysis />;
      case "financial":
        return <FinancialAnalysis />;
      case "breeding":
        return <BreedingAnalysis />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (currentPage) {
      case "pigeons":
        return t("pigeonReports" as any);
      case "financial":
        return t("financialReports" as any);
      case "breeding":
        return t("breedingReports" as any);
      default:
        return t("reports" as any);
    }
  };

  const getDescription = () => {
    switch (currentPage) {
      case "pigeons":
        return t("viewPigeonAnalysis" as any);
      case "financial":
        return t("viewFinancialAnalysis" as any);
      case "breeding":
        return t("viewBreedingAnalysis" as any);
      default:
        return "";
    }
  }

  return (
    <OnboardingGuard>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <BackIcon className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{getTitle()}</h1>
              <p className="text-muted-foreground">{getDescription() || getTitle()}</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </OnboardingGuard>
  );
}
