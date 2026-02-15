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
  ClipboardList,
  Award,
  Bell,
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





export function DashboardHome({ userName }: { userName?: string }) {
  const { t, language } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState<
    "revenue" | "profit" | "races"
  >("revenue");
  const [stats, setStats] = useState<{
    total: number;
    healthy: number;
    sick: number;
    males: number;
    females: number;
    statusBreakdown?: { status: string; count: number }[];
  }>({
    total: 0,
    healthy: 0,
    sick: 0,
    males: 0,
    females: 0,
  });

  const [dashboardData, setDashboardData] = useState<{
    financial: { income: number; expenses: number };
    recentActivity: any[];
  }>({
    financial: { income: 0, expenses: 0 },
    recentActivity: [],
  });

  // Fetch Stats from Backend
  const [loading, setLoading] = useState(true);

  const [todaysTasks, setTodaysTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Stats
        const statsRes = await apiClient.get("/birds/stats");
        setStats(statsRes.data);

        // 2. Fetch Dashboard Data (Financials & Activity)
        const dashboardRes = await apiClient.get("/dashboard");
        setDashboardData(dashboardRes.data);

        // 3. Fetch Tasks
        const tasksRes = await apiClient.get("/tasks");
        const allTasks = tasksRes.data || [];
        const today = new Date().toISOString().split('T')[0];
        const todayTasks = allTasks.filter((t: any) => t.dueDate?.startsWith(today) || t.status === 'pending').slice(0, 5);
        setTodaysTasks(todayTasks);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare Chart Data
  const pigeonStatusData = stats.statusBreakdown
    ? stats.statusBreakdown.map((item) => {
      let nameAr = item.status, nameEn = item.status, color = "#6b7280";
      if (item.status === 'HEALTHY') { nameAr = "صحي"; nameEn = "Healthy"; color = "#10b981"; }
      else if (item.status === 'SICK') { nameAr = "مريض"; nameEn = "Sick"; color = "#ef4444"; }
      else if (item.status === 'UNDER_OBSERVATION') { nameAr = "تحت الملاحظة"; nameEn = "Observation"; color = "#f59e0b"; }
      else if (item.status === 'SOLD') { nameAr = "مباع"; nameEn = "Sold"; color = "#6366f1"; }
      else if (item.status === 'DECEASED') { nameAr = "متوفى"; nameEn = "Deceased"; color = "#1f2937"; }
      else if (item.status === 'SQUAB') { nameAr = "زغلول"; nameEn = "Squab"; color = "#ec4899"; }

      return { nameAr, nameEn, value: item.count, color };
    })
    : [];

  const activityIconMap: any = {
    race: Trophy,
    breeding: Users,
    health: Heart,
    task: Clock,
    event: ClipboardList
  };

  const activityColorMap: any = {
    race: "text-yellow-600 bg-yellow-100",
    breeding: "text-blue-600 bg-blue-100",
    health: "text-red-600 bg-red-100",
    task: "text-green-600 bg-green-100",
    event: "text-purple-600 bg-purple-100"
  };

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
              label: language === "ar" ? "قيمة المخزون" : "Inventory Value",
              count: dashboardData.financial.expenses, // Using Expenses as Inventory Value
              color: "amber",
              prefix: "$"
            },
          ]}
        />
      </div>

      {/* Restored Sections with Real Data */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {language === "ar" ? "التحليلات" : "Analytics"}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Financial Overview - Using Static Monthly Data for now as backend history is missing, but Value is Real */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">
                {language === "ar" ? "نظرة عامة مالية (تجريبي)" : "Financial Overview (Demo)"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "الدخل مقابل المصروفات (بيانات شهرية تجريبية)"
                  : "Income vs Expenses (Mock Monthly Data)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#colorIncome)" name={language === "ar" ? "الدخل" : "Income"} />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#colorExpenses)" name={language === "ar" ? "المصروفات" : "Expenses"} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pigeon Status Chart - REAL DATA */}
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
                {pigeonStatusData.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    {language === "ar" ? "لا توجد بيانات كافية" : "No sufficient data"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activities Section - REAL DATA */}
      <div className="space-y-3 mt-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {language === "ar" ? "الأنشطة والسباقات" : "Activities & Racing"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {language === "ar" ? "النشاطات الأخيرة" : "Recent Activity"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity, index) => {
                  const Icon = activityIconMap[activity.type] || ClipboardList;
                  const colorClass = activityColorMap[activity.type] || "text-gray-600 bg-gray-100";

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={cn(
                          "mt-0.5 p-1.5 rounded-lg",
                          colorClass
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {activity.title} <span className="text-xs text-muted-foreground">({activity.entityName})</span>
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(activity.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {language === "ar"
                    ? "لا توجد نشاطات حديثة"
                    : "No recent activities"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Daily Tasks and Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-8">
        {/* Daily Tasks Card */}
        <section>
          <Card className="overflow-hidden rounded-3xl h-full">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10">
                    <ClipboardList className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardTitle>{t("dailyTasksTitle")}</CardTitle>
                </div>
                <Badge variant="outline" className="rounded-xl">
                  {todaysTasks.length} {t("taskPending")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {todaysTasks.length > 0 ? (
                  todaysTasks.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full border-2",
                            item.completed
                              ? "border-green-500 bg-green-500/10"
                              : "border-muted-foreground/30",
                          )}
                        >
                          {item.completed && (
                            <Award className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div>
                          <p
                            className={cn(
                              "font-medium",
                              item.completed &&
                              "line-through text-muted-foreground",
                            )}
                          >
                            {item.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.dueDate || "Today"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    {language === "ar"
                      ? "لا توجد مهام اليوم"
                      : "No tasks for today"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Alerts Card */}
        <section>
          <Card className="overflow-hidden rounded-3xl h-full">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10">
                    <Bell className="h-5 w-5 text-red-500" />
                  </div>
                  <CardTitle>{t("alertsTitle")}</CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-xl bg-red-500/10 text-red-500 border-red-500/30"
                >
                  {stats.sick} {t("alertHigh")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {stats.sick > 0 ? (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 m-4 rounded">
                  <p className="text-red-700 font-medium">
                    {language === "ar" ? `يوجد ${stats.sick} حمام مريض يحتاج انتباهك` : `There are ${stats.sick} sick pigeons needing attention`}
                  </p>
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  {language === "ar" ? "لا توجد تنبيهات خطيرة" : "No critical alerts"}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Mobile Bottom Navigation - Placeholder if needed, but likely handled by Layout */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
