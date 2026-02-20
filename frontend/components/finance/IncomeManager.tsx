"use client";

import { useLanguage } from "@/lib/language-context";
import { IncomeItem } from "@/hooks/useFinance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Edit, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IncomeDialog } from "./IncomeDialog";

interface IncomeManagerProps {
    income: IncomeItem[];
    totalIncome: number;
    totalExpenses: number; // passed mainly for summary cards which show both?
    profit: number; // passed mainly for summary cards which show both?
    onAdd: (item: any) => void;
    onDelete: (id: number) => void;
}

export function IncomeManager({
    income,
    totalIncome,
    totalExpenses,
    profit,
    onAdd,
    onDelete,
}: IncomeManagerProps) {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                            {t("totalIncome" as any)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-green-600">
                                {totalIncome} {t("currency" as any)}
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
                                {totalExpenses} {t("currency" as any)}
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
                            <span
                                className={`text-2xl font-bold ${profit >= 0 ? "text-blue-600" : "text-red-600"}`}
                            >
                                {profit} {t("currency" as any)}
                            </span>
                            <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>{t("incomeDetails" as any)}</CardTitle>
                            <CardDescription>{t("trackRaceEarnings" as any)}</CardDescription>
                        </div>
                        <IncomeDialog onSave={onAdd} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("type" as any)}</TableHead>
                                    <TableHead>{t("description" as any)}</TableHead>
                                    <TableHead>{t("date" as any)}</TableHead>
                                    <TableHead className="text-right">
                                        {t("amount" as any)}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t("actions" as any)}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {income.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {item.type === "race"
                                                    ? t("race" as any)
                                                    : t("sale" as any)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell className="text-right font-semibold text-green-600">
                                            +{item.amount} {t("currency" as any)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
