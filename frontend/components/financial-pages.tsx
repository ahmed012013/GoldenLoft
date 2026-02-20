"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { OnboardingGuard } from "@/components/onboarding-guard";

// Hooks
import { useFinance } from "@/hooks/useFinance";

// Components
import { IncomeManager } from "./finance/IncomeManager";
import { ExpensesManager } from "./finance/ExpensesManager";
import { FinancialReports } from "./finance/FinancialReports";

export interface FinancialPagesProps {
  currentPage: "income" | "expenses" | "reports";
  onBack: () => void;
}

export function FinancialPages({ currentPage, onBack }: FinancialPagesProps) {
  const { t, dir } = useLanguage();
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  // Use the hook
  const {
    income,
    expenses,
    totalIncome,
    totalExpenses,
    profit,
    addIncome,
    addExpense,
    deleteIncome,
    deleteExpense,
  } = useFinance();

  const renderIncomeTable = () => (
    <IncomeManager
      income={income}
      totalIncome={totalIncome}
      totalExpenses={totalExpenses}
      profit={profit}
      onAdd={addIncome}
      onDelete={deleteIncome}
    />
  );

  const renderExpensesTable = () => (
    <ExpensesManager
      expenses={expenses}
      totalExpenses={totalExpenses}
      onAdd={addExpense}
      onDelete={deleteExpense}
    />
  );

  const renderFinancialReports = () => (
    <FinancialReports totalIncome={totalIncome} totalExpenses={totalExpenses} />
  );

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
              <h1 className="text-3xl font-bold">
                {currentPage === "income"
                  ? t("income" as any)
                  : currentPage === "expenses"
                    ? t("expenses" as any)
                    : t("financialReports" as any)}
              </h1>
              <p className="text-muted-foreground">
                {currentPage === "income"
                  ? t("trackRaceEarnings" as any)
                  : currentPage === "expenses"
                    ? t("trackAllExpenses" as any)
                    : t("viewFinancialAnalysis" as any)}
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentPage === "income" && renderIncomeTable()}
          {currentPage === "expenses" && renderExpensesTable()}
          {currentPage === "reports" && renderFinancialReports()}
        </AnimatePresence>
      </motion.div>
    </OnboardingGuard>
  );
}
