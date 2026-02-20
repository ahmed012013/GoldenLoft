"use client";

import { useLanguage } from "@/lib/language-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Users, TrendingUp, Heart, Zap } from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Default Data for fallback/storybook
const DEFAULT_STATUS_DATA = [
  { name: "Healthy", value: 30, color: "#22c55e" },
  { name: "Sick", value: 5, color: "#ef4444" },
  { name: "Observation", value: 8, color: "#f59e0b" },
  { name: "Deceased", value: 2, color: "#64748b" },
];

const DEFAULT_AGE_DATA = [
  { name: "< 1 Year", count: 12 },
  { name: "1-2 Years", count: 18 },
  { name: "2-4 Years", count: 10 },
  { name: "> 4 Years", count: 5 },
];

interface PigeonAnalysisProps {
  statusData?: { name: string; value: number; color: string }[];
  ageData?: { name: string; count: number }[];
}

export function PigeonAnalysis({
  statusData,
  ageData,
}: PigeonAnalysisProps) {
  const { t, language } = useLanguage();

  const currentStatusData = statusData ?? DEFAULT_STATUS_DATA;
  const currentAgeData = ageData ?? DEFAULT_AGE_DATA;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("totalPigeons")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">45</span>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "+5 الجدد هذا الشهر" : "+5 new this month"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("healthyPigeons")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">30</span>
              <Heart className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("sickPigeons")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-red-600">5</span>
              <TrendingUp className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("topFinishes")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-amber-500">12</span>
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "ar"
                ? "توزيع الحالة الصحية"
                : "Health Status Distribution"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {currentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === "ar" ? "توزيع الأعمار" : "Age Distribution"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentAgeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("generateReport")}</CardTitle>
              <CardDescription>
                {t("exportFinancialData")}
              </CardDescription>
            </div>
            <Button size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              {t("exportPDF")}
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
