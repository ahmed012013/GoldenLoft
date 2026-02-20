"use client";

import { useLanguage } from "@/lib/language-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample Data
const financialData = [
  { name: "Jan", income: 1200, expense: 800 },
  { name: "Feb", income: 1500, expense: 900 },
  { name: "Mar", income: 1800, expense: 1000 },
  { name: "Apr", income: 2000, expense: 1100 },
  { name: "May", income: 2200, expense: 1200 },
  { name: "Jun", income: 2500, expense: 1300 },
];

export function FinancialAnalysis() {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("totalIncome" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                12,500 {t("currency" as any)}
              </span>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("totalExpenses" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-red-600">
                6,300 {t("currency" as any)}
              </span>
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("profit" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">
                6,200 {t("currency" as any)}
              </span>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("remainingBudget" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-purple-600">
                3,700 {t("currency" as any)}
              </span>
              <Wallet className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === "ar"
              ? "تحليل الدخل والمصروفات"
              : "Income vs Expense Analysis"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="income"
                  name={language === "ar" ? "الدخل" : "Income"}
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  name={language === "ar" ? "المصروف" : "Expense"}
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("generateReport" as any)}</CardTitle>
              <CardDescription>
                {t("exportFinancialData" as any)}
              </CardDescription>
            </div>
            <Button size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              {t("exportPDF" as any)}
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
