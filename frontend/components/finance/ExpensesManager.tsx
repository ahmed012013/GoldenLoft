"use client";

import { useLanguage } from "@/lib/language-context";
import { ExpenseItem } from "@/hooks/useFinance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, DollarSign, Edit, Trash2 } from "lucide-react";
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
import { ExpenseDialog } from "./ExpenseDialog";

interface ExpensesManagerProps {
    expenses: ExpenseItem[];
    totalExpenses: number;
    onAdd: (item: any) => void;
    onDelete: (id: number) => void;
}

export function ExpensesManager({
    expenses,
    totalExpenses,
    onAdd,
    onDelete,
}: ExpensesManagerProps) {
    const { t, language } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
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
                            {t("remainingBudget" as any)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-blue-600">
                                {1000 - totalExpenses} {t("currency" as any)}
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
                            <CardTitle>{t("expensesDetails" as any)}</CardTitle>
                            <CardDescription>{t("trackAllExpenses" as any)}</CardDescription>
                        </div>
                        <ExpenseDialog onSave={onAdd} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("category" as any)}</TableHead>
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
                                {expenses.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    item.category === "feed"
                                                        ? "bg-yellow-50"
                                                        : item.category === "medicine"
                                                            ? "bg-red-50"
                                                            : item.category === "equipment"
                                                                ? "bg-blue-50"
                                                                : "bg-purple-50"
                                                }
                                            >
                                                {item.category === "feed"
                                                    ? t("feed" as any)
                                                    : item.category === "medicine"
                                                        ? t("medicine" as any)
                                                        : item.category === "equipment"
                                                            ? t("equipment" as any)
                                                            : t("transport" as any)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell className="text-right font-semibold text-red-600">
                                            -{item.amount} {t("currency" as any)}
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

            <div className="grid gap-4 md:grid-cols-3">
                {/* Placeholder Categories */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                            {t("feed" as any)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">120 {t("currency" as any)}</p>
                        <p className="text-xs text-muted-foreground">
                            {language === "ar" ? "من إجمالي المصروفات" : "of total expenses"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                            {t("medicine" as any)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">85 {t("currency" as any)}</p>
                        <p className="text-xs text-muted-foreground">
                            {language === "ar" ? "من إجمالي المصروفات" : "of total expenses"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                            {t("equipment" as any)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">300 {t("currency" as any)}</p>
                        <p className="text-xs text-muted-foreground">
                            {language === "ar" ? "من إجمالي المصروفات" : "of total expenses"}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
