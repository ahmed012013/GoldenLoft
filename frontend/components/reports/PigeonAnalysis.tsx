"use client";

import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

// Sample Data (moved from reports-pages.tsx or props)
const pigeonStatusData = [
    { name: "Healthy", value: 30, color: "#22c55e" },
    { name: "Sick", value: 5, color: "#ef4444" },
    { name: "Observation", value: 8, color: "#f59e0b" },
    { name: "Deceased", value: 2, color: "#64748b" },
];

const pigeonAgeData = [
    { name: "< 1 Year", count: 12 },
    { name: "1-2 Years", count: 18 },
    { name: "2-4 Years", count: 10 },
    { name: "> 4 Years", count: 5 },
];

export function PigeonAnalysis() {
    const { t, language } = useLanguage();

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                            {t("totalPigeons" as any)}
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
                            {t("healthyPigeons" as any)}
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
                            {t("sickPigeons" as any)}
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
                            {t("topFinishes" as any)}
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
                            {language === "ar" ? "توزيع الحالة الصحية" : "Health Status Distribution"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pigeonStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pigeonStatusData.map((entry, index) => (
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
                                <BarChart data={pigeonAgeData}>
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
