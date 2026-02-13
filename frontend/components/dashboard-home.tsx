"use client";

import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";
import apiClient from "@/lib/api-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
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
import { useLanguage } from "@/lib/language-context";
import {
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Trophy,
  Heart,
  TrendingUp,
  Clock,
  Users,
  Download,
  Bird,
} from "lucide-react";
import { StatusIndicators } from "@/components/status-indicators";

const monthlyData = [
  { month: "Jan", income: 850, expenses: 450, profit: 400 },
  { month: "Feb", income: 720, expenses: 380, profit: 340 },
  { month: "Mar", income: 650, expenses: 360, profit: 290 },
  { month: "Apr", income: 920, expenses: 420, profit: 500 },
  { month: "May", income: 1050, expenses: 480, profit: 570 },
  { month: "Jun", income: 1200, expenses: 550, profit: 650 },
];

const pigeonStatusData = [
  { nameAr: "نشيط", nameEn: "Active", value: 85, color: "#10b981" },
  { nameAr: "متقاعد", nameEn: "Retired", value: 12, color: "#6b7280" },
  { nameAr: "مريض", nameEn: "Sick", value: 3, color: "#ef4444" },
];

const recentActivities = [
  {
    type: "race",
    titleAr: "سباق دمياط الكبرى",
    titleEn: "Damietta Grand Race",
    timeAr: "قبل ساعتين",
    timeEn: "2 hours ago",
    statusAr: "فاز المركز الأول",
    statusEn: "Won 1st Place",
  },
  {
    type: "breeding",
    titleAr: "فقس 3 بيضات لزوج الفينيكس",
    titleEn: "3 eggs hatched - Phoenix pair",
    timeAr: "قبل 4 ساعات",
    timeEn: "4 hours ago",
    statusAr: "ناجح",
    statusEn: "Success",
  },
  {
    type: "health",
    titleAr: "فحص صحي شامل",
    titleEn: "Complete health check",
    timeAr: "قبل يوم",
    timeEn: "1 day ago",
    statusAr: "جميع الحمام بصحة جيدة",
    statusEn: "All pigeons healthy",
  },
  {
    type: "task",
    titleAr: "إطعام الحمام الصباحي",
    titleEn: "Morning feeding completed",
    timeAr: "قبل يوم",
    timeEn: "1 day ago",
    statusAr: "مكتمل",
    statusEn: "Complete",
  },
];

const upcomingRaces = [
  {
    nameAr: "سباق القاهرة الدولي",
    nameEn: "Cairo International Race",
    dateAr: "15 فبراير",
    dateEn: "Feb 15",
    distanceAr: "200 كم",
    distanceEn: "200 km",
    registered: 8,
    totalSlots: 15,
    status: "open",
    prize: "5000",
    daysLeft: 5,
  },
  {
    nameAr: "سباق الإسكندرية",
    nameEn: "Alexandria Race",
    dateAr: "22 فبراير",
    dateEn: "Feb 22",
    distanceAr: "150 كم",
    distanceEn: "150 km",
    registered: 5,
    totalSlots: 20,
    status: "open",
    prize: "3000",
    daysLeft: 12,
  },
  {
    nameAr: "سباق الفيوم",
    nameEn: "Fayoum Race",
    dateAr: "1 مارس",
    dateEn: "Mar 1",
    distanceAr: "100 كم",
    distanceEn: "100 km",
    registered: 12,
    totalSlots: 12,
    status: "full",
    prize: "2000",
    daysLeft: 19,
  },
];

export function DashboardHome({ userName }: { userName?: string }) {
  const { t, language } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState<
    "revenue" | "profit" | "races"
  >("revenue");
  const [stats, setStats] = useState({
    total: 0,
    healthy: 0,
    sick: 0,
    males: 0,
    females: 0,
  });

  // Fetch Stats from Backend
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await apiClient.get("/birds/stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            {language === "ar" ? "لوحة التحكم" : "Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === "ar"
              ? `مرحباً بك${userName ? `، ${userName}` : ""}، إليك ملخص أداء لوفتك اليوم`
              : `Welcome${userName ? `, ${userName}` : ""}, here's your loft summary today`}
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 w-full md:w-auto bg-transparent"
        >
          <Download className="h-4 w-4" />
          {language === "ar" ? "تصدير التقرير" : "Export Report"}
        </Button>
      </div>

      {/* Quick Status Overview */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {language === "ar" ? "نظرة سريعة" : "Quick Overview"}
        </h2>
        <StatusIndicators
          items={[
            {
              icon: Bird,
              label: language === "ar" ? "إجمالي الحمام" : "Total Pigeons",
              count: stats.total,
              color: "blue",
            },
            {
              icon: Trophy,
              label: language === "ar" ? "السباقات القادمة" : "Upcoming Races",
              count: 3, // Static for now until races API is ready
              color: "amber",
            },
            {
              icon: Heart,
              label: language === "ar" ? "حمام صحي" : "Healthy Pigeons",
              count: stats.healthy,
              color: "green",
            },
            {
              icon: AlertCircle,
              label: language === "ar" ? "تنبيهات صحية" : "Health Alerts",
              count: stats.sick,
              color: "red",
            },
            {
              icon: TrendingUp,
              label: language === "ar" ? "الأرباح الشهرية" : "Monthly Profit",
              count: 1250, // Static for now
              color: "green",
            },
          ]}
        />
      </div>

      {/* Charts Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {language === "ar" ? "التحليلات" : "Analytics"}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">
                {language === "ar" ? "نظرة عامة مالية" : "Financial Overview"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "الدخل مقابل المصروفات"
                  : "Income vs Expenses"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorExpenses"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    fill="url(#colorIncome)"
                    name={language === "ar" ? "الدخل" : "Income"}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    fill="url(#colorExpenses)"
                    name={language === "ar" ? "المصروفات" : "Expenses"}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {language === "ar" ? "حالة الحمام" : "Pigeon Status"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pigeonStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pigeonStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {pigeonStatusData.map((item) => (
                  <div
                    key={item.nameEn}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>
                        {language === "ar" ? item.nameAr : item.nameEn}
                      </span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activities Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {language === "ar" ? "الأنشطة والسباقات" : "Activities & Racing"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {language === "ar" ? "النشاطات الأخيرة" : "Recent Activity"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={cn(
                      "mt-0.5 p-1.5 rounded-lg",
                      activity.type === "race" && "bg-yellow-100",
                      activity.type === "breeding" && "bg-blue-100",
                      activity.type === "health" && "bg-red-100",
                      activity.type === "task" && "bg-green-100",
                    )}
                  >
                    {activity.type === "race" && (
                      <Trophy className="h-3.5 w-3.5 text-yellow-600" />
                    )}
                    {activity.type === "breeding" && (
                      <Users className="h-3.5 w-3.5 text-blue-600" />
                    )}
                    {activity.type === "health" && (
                      <Heart className="h-3.5 w-3.5 text-red-600" />
                    )}
                    {activity.type === "task" && (
                      <Clock className="h-3.5 w-3.5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {language === "ar" ? activity.titleAr : activity.titleEn}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "ar" ? activity.timeAr : activity.timeEn}
                    </p>
                    <Badge
                      variant="secondary"
                      className="mt-1 text-[10px] px-1.5 py-0"
                    >
                      {language === "ar"
                        ? activity.statusAr
                        : activity.statusEn}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {language === "ar" ? "السباقات القادمة" : "Upcoming Races"}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {upcomingRaces.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingRaces.map((race, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {language === "ar" ? race.nameAr : race.nameEn}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {language === "ar" ? race.dateAr : race.dateEn}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {language === "ar"
                            ? race.distanceAr
                            : race.distanceEn}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant={
                          race.status === "full" ? "secondary" : "default"
                        }
                        className={cn(
                          "text-xs",
                          race.status === "full"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700",
                        )}
                      >
                        {race.status === "full"
                          ? language === "ar"
                            ? "مكتمل"
                            : "Full"
                          : language === "ar"
                            ? "مفتوح"
                            : "Open"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {race.daysLeft} {language === "ar" ? "يوم" : "days"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">
                        {race.registered}/{race.totalSlots}
                      </span>
                      <span className="text-muted-foreground">
                        {language === "ar" ? "مسجل" : "registered"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                      <Trophy className="h-3 w-3" />
                      {race.prize} {language === "ar" ? "ج.م" : "EGP"}
                    </div>
                  </div>
                  {race.status !== "full" && (
                    <Button
                      size="sm"
                      className="w-full mt-2 h-8 text-xs rounded-lg"
                    >
                      {language === "ar" ? "سجل الآن" : "Register Now"}
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
