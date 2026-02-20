"use client";

import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface FinancialReportsProps {
    totalIncome: number;
    totalExpenses: number;
}

export function FinancialReports({ totalIncome, totalExpenses }: FinancialReportsProps) {
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
                        <p className="text-2xl font-bold text-green-600">
                            {totalIncome} {t("currency" as any)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {language === "ar" ? "↑ 15% هذا الشهر" : "↑ 15% this month"}
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
                            {totalExpenses} {t("currency" as any)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {language === "ar"
                            ? "تقرير النشاط الشهري"
                            : "Monthly Activity Report"}
                    </CardTitle>
                    <CardDescription>
                        {language === "ar"
                            ? "أداء الحمام والعائدات"
                            : "Pigeon performance and returns"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{language === "ar" ? "الشهر" : "Month"}</TableHead>
                                <TableHead className="text-right">
                                    {language === "ar" ? "الدخل" : "Income"}
                                </TableHead>
                                <TableHead className="text-right">
                                    {language === "ar" ? "المصروف" : "Expense"}
                                </TableHead>
                                <TableHead className="text-right">
                                    {language === "ar" ? "الربح" : "Profit"}
                                </TableHead>
                                <TableHead className="text-right">
                                    {language === "ar" ? "السباقات" : "Races"}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>{language === "ar" ? "يناير" : "January"}</TableCell>
                                <TableCell className="text-right text-green-600 font-semibold">
                                    850
                                </TableCell>
                                <TableCell className="text-right text-red-600 font-semibold">
                                    450
                                </TableCell>
                                <TableCell className="text-right text-blue-600 font-semibold">
                                    400
                                </TableCell>
                                <TableCell className="text-right">5</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {language === "ar" ? "فبراير" : "February"}
                                </TableCell>
                                <TableCell className="text-right text-green-600 font-semibold">
                                    720
                                </TableCell>
                                <TableCell className="text-right text-red-600 font-semibold">
                                    380
                                </TableCell>
                                <TableCell className="text-right text-blue-600 font-semibold">
                                    340
                                </TableCell>
                                <TableCell className="text-right">4</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{language === "ar" ? "مارس" : "March"}</TableCell>
                                <TableCell className="text-right text-green-600 font-semibold">
                                    650
                                </TableCell>
                                <TableCell className="text-right text-red-600 font-semibold">
                                    360
                                </TableCell>
                                <TableCell className="text-right text-blue-600 font-semibold">
                                    290
                                </TableCell>
                                <TableCell className="text-right">3</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
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
