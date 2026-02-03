"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Filter,
  TrendingUp,
  Users,
  Heart,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface ReportsPageProps {
  currentPage: "pigeons" | "financial" | "breeding";
  onBack: () => void;
}

export function ReportsPages({ currentPage, onBack }: ReportsPageProps) {
  const { t, language } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const renderPigeonReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("pigeonReports" as any)}</h2>
          <p className="text-gray-500">{t("completePigeonAnalysis" as any)}</p>
        </div>
        <Button size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          {t("export" as any)}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("totalPigeons" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">156</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar"
                ? "↑ 12 جديد هذا الشهر"
                : "↑ 12 new this month"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("healthyPigeons" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">148</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "94.9% صحية" : "94.9% healthy"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("activeRacers" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">87</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar"
                ? "مشاركة في السباقات"
                : "participating in races"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("breedingPair" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">34</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "زوج تربية نشط" : "active breeding pairs"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("pigeonPerformance" as any)}</CardTitle>
          <CardDescription>{t("topPerformingPigeons" as any)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("pigeonName" as any)}</TableHead>
                <TableHead>{t("racePosition" as any)}</TableHead>
                <TableHead className="text-right">
                  {t("speed" as any)}
                </TableHead>
                <TableHead className="text-right">{t("wins" as any)}</TableHead>
                <TableHead>{t("status" as any)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">أحمد 2023</TableCell>
                <TableCell>1st</TableCell>
                <TableCell className="text-right">92 km/h</TableCell>
                <TableCell className="text-right">8</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">
                    {t("active" as any)}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">فاطمة الذهبية</TableCell>
                <TableCell>2nd</TableCell>
                <TableCell className="text-right">89 km/h</TableCell>
                <TableCell className="text-right">7</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">
                    {t("active" as any)}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">محمود الأبيض</TableCell>
                <TableCell>3rd</TableCell>
                <TableCell className="text-right">87 km/h</TableCell>
                <TableCell className="text-right">6</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">
                    {t("active" as any)}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("pigeonsByAge" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">
                    {language === "ar" ? "أقل من سنة" : "Under 1 year"}
                  </span>
                  <span className="font-semibold">34 (21.8%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "21.8%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">
                    {language === "ar" ? "1-3 سنوات" : "1-3 years"}
                  </span>
                  <span className="font-semibold">78 (50%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "50%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">
                    {language === "ar" ? "فوق 3 سنوات" : "Over 3 years"}
                  </span>
                  <span className="font-semibold">44 (28.2%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: "28.2%" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("healthStatus" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {language === "ar" ? "صحية تماماً" : "Fully healthy"}
                </span>
                <span className="font-semibold text-green-600">148</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {language === "ar" ? "تحت الملاحظة" : "Under observation"}
                </span>
                <span className="font-semibold text-yellow-600">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {language === "ar" ? "بحاجة علاج" : "Needs treatment"}
                </span>
                <span className="font-semibold text-red-600">2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderFinancialReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("financialReports" as any)}</h2>
          <p className="text-muted-foreground">
            {language === "ar"
              ? "تحليل مالي شامل للعام"
              : "Comprehensive annual financial analysis"}
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          {t("exportPDF" as any)}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t("totalIncome" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              4,850 {language === "ar" ? "ج.م" : "EGP"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar"
                ? "↑ 25% مقارنة بالسنة السابقة"
                : "↑ 25% vs last year"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("totalExpenses" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              2,340 {language === "ar" ? "ج.م" : "EGP"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar"
                ? "↑ 5% مقارنة بالسنة السابقة"
                : "↑ 5% vs last year"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("profit" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              2,510 {language === "ar" ? "ج.م" : "EGP"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "الربح الصافي" : "Net profit"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("profitMargin" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">51.8%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "معدل الربح" : "Profit rate"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === "ar"
              ? "تقرير الإيرادات الشهرية"
              : "Monthly Revenue Report"}
          </CardTitle>
          <CardDescription>
            {language === "ar"
              ? "مقارنة الدخل عبر الأشهر"
              : "Income comparison across months"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("month" as any)}</TableHead>
                <TableHead className="text-right">
                  {t("raceWinnings" as any)}
                </TableHead>
                <TableHead className="text-right">
                  {t("pigeonSale" as any)}
                </TableHead>
                <TableHead className="text-right">
                  {t("other" as any)}
                </TableHead>
                <TableHead className="text-right">
                  {t("total" as any)}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{language === "ar" ? "يناير" : "January"}</TableCell>
                <TableCell className="text-right">450</TableCell>
                <TableCell className="text-right">280</TableCell>
                <TableCell className="text-right">120</TableCell>
                <TableCell className="text-right font-semibold">850</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {language === "ar" ? "فبراير" : "February"}
                </TableCell>
                <TableCell className="text-right">380</TableCell>
                <TableCell className="text-right">220</TableCell>
                <TableCell className="text-right">120</TableCell>
                <TableCell className="text-right font-semibold">720</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{language === "ar" ? "مارس" : "March"}</TableCell>
                <TableCell className="text-right">420</TableCell>
                <TableCell className="text-right">180</TableCell>
                <TableCell className="text-right">50</TableCell>
                <TableCell className="text-right font-semibold">650</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("incomeSource" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{t("raceWinnings" as any)}</span>
                  <span className="font-semibold">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{t("pigeonSale" as any)}</span>
                  <span className="font-semibold">40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{t("other" as any)}</span>
                  <span className="font-semibold">15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: "15%" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("expenseCategories" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("feed" as any)}</span>
                <span className="font-semibold">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("medicine" as any)}</span>
                <span className="font-semibold">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("equipment" as any)}</span>
                <span className="font-semibold">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("transportation" as any)}</span>
                <span className="font-semibold">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBreedingReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("breedingReports" as any)}</h2>
          <p className="text-muted-foreground">
            {language === "ar"
              ? "تحليل نتائج التربية والخصوبة"
              : "Breeding and fertility analysis"}
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          {t("export" as any)}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("activePairs" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">34</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "زوج تربية نشط" : "active breeding pairs"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("eggs" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">87</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "بيضة في الحضانة" : "eggs in incubation"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("hatchRate" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">89%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "معدل الفقس" : "hatch rate"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("youngPigeons" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">156</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "حمام صغير" : "young pigeons"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === "ar" ? "أفضل أزواج التربية" : "Top Breeding Pairs"}
          </CardTitle>
          <CardDescription>
            {language === "ar"
              ? "الأزواج الأكثر إنتاجية"
              : "Most productive pairs"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("pair" as any)}</TableHead>
                <TableHead className="text-right">{t("eggs" as any)}</TableHead>
                <TableHead className="text-right">
                  {t("hatched" as any)}
                </TableHead>
                <TableHead className="text-right">
                  {t("hatchRate" as any)}
                </TableHead>
                <TableHead>{t("status" as any)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">أحمد x فاطمة</TableCell>
                <TableCell className="text-right">24</TableCell>
                <TableCell className="text-right">22</TableCell>
                <TableCell className="text-right">91.7%</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">
                    {t("active" as any)}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">محمود x ليلى</TableCell>
                <TableCell className="text-right">20</TableCell>
                <TableCell className="text-right">18</TableCell>
                <TableCell className="text-right">90%</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">
                    {t("active" as any)}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">علي x نورا</TableCell>
                <TableCell className="text-right">18</TableCell>
                <TableCell className="text-right">15</TableCell>
                <TableCell className="text-right">83.3%</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {t("resting" as any)}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === "ar" ? "إنتاجية الأزواج" : "Pair Productivity"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">
                    {language === "ar"
                      ? "أزواج عالية الإنتاج"
                      : "High production pairs"}
                  </span>
                  <span className="font-semibold">12 (35%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "35%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">
                    {language === "ar"
                      ? "أزواج متوسطة الإنتاج"
                      : "Medium production pairs"}
                  </span>
                  <span className="font-semibold">18 (53%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "53%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">
                    {language === "ar"
                      ? "أزواج منخفضة الإنتاج"
                      : "Low production pairs"}
                  </span>
                  <span className="font-semibold">4 (12%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: "12%" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === "ar" ? "توزيع الأعمار" : "Age Distribution"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {language === "ar" ? "دوري 2024" : "Season 2024"}
                </span>
                <span className="font-semibold">45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {language === "ar" ? "دوري 2023" : "Season 2023"}
                </span>
                <span className="font-semibold">56</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {language === "ar" ? "دوري 2022" : "Season 2022"}
                </span>
                <span className="font-semibold">38</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {language === "ar" ? "أقدم من 2022" : "Before 2022"}
                </span>
                <span className="font-semibold">17</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t("reports" as any)}</h1>
          <p className="text-muted-foreground">
            {language === "ar"
              ? "تحليلات شاملة ومفصلة لجميع جوانب المشروع"
              : "Comprehensive and detailed analysis for all project aspects"}
          </p>
        </div>
      </div>

      {currentPage === "pigeons" && renderPigeonReports()}
      {currentPage === "financial" && renderFinancialReports()}
      {currentPage === "breeding" && renderBreedingReports()}
    </div>
  );
}
