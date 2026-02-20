"use client";

import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Users, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";
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
    LineChart,
    Line,
} from "recharts";

// Sample Data
const breedingMonthlyData = [
    { name: "Jan", eggs: 12, hatched: 10 },
    { name: "Feb", eggs: 15, hatched: 12 },
    { name: "Mar", eggs: 18, hatched: 15 },
    { name: "Apr", eggs: 20, hatched: 18 },
    { name: "May", eggs: 22, hatched: 20 },
    { name: "Jun", eggs: 25, hatched: 22 },
];

export function BreedingAnalysis() {
    const { t, language } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                            {t("totalPairings" as any)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">12</span>
                            <Users className="h-5 w-5 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                            {t("totalEggs" as any)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-amber-500">22</span>
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                            {t("hatchRate" as any)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-green-600">85%</span>
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                            {t("totalSquabs" as any)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-purple-600">18</span>
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {language === "ar" ? "نشاط الإنتاج الشهري" : "Monthly Breeding Activity"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={breedingMonthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="eggs"
                                        name={language === "ar" ? "البيض" : "Eggs"}
                                        fill="#fbbf24"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="hatched"
                                        name={language === "ar" ? "الفقس" : "Hatched"}
                                        fill="#22c55e"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {language === "ar" ? "معدل الخصوبة" : "Fertility Rate"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={breedingMonthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="hatched"
                                        name={language === "ar" ? "الخصوبة" : "Fertility"}
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                    />
                                </LineChart>
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
