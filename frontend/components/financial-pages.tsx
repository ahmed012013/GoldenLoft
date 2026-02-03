"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  ChevronDown,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/lib/language-context";

export interface FinancialPagesProps {
  currentPage: "income" | "expenses" | "reports";
  onBack: () => void;
}

export function FinancialPages({ currentPage, onBack }: FinancialPagesProps) {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: "race",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T" as any)[0],
    category: "",
  });

  // Sample data
  const incomeData = [
    {
      id: 1,
      type: "race",
      amount: 250,
      description: "جائزة الفائز - السباق الأول",
      date: "2024-01-15",
      pigeon: "فارس البياض",
    },
    {
      id: 2,
      type: "race",
      amount: 150,
      description: "جائزة المركز الثاني - السباق الثاني",
      date: "2024-01-10",
      pigeon: "الريح السريعة",
    },
    {
      id: 3,
      type: "sale",
      amount: 500,
      description: "بيع زوج حمام ",
      date: "2024-01-05",
      pigeon: "زوج مشهور",
    },
  ];

  const expensesData = [
    {
      id: 1,
      category: "feed",
      amount: 120,
      description: "علف حبوب عالي الجودة",
      date: "2024-01-20",
      quantity: "25 كغ",
    },
    {
      id: 2,
      category: "medicine",
      amount: 85,
      description: "أدوية وفيتامينات",
      date: "2024-01-18",
      quantity: "مجموعة",
    },
    {
      id: 3,
      category: "equipment",
      amount: 300,
      description: "شبك وقفص جديد",
      date: "2024-01-12",
      quantity: "قطعة",
    },
    {
      id: 4,
      category: "transport",
      amount: 60,
      description: "نقل الحمام للسباق",
      date: "2024-01-10",
      quantity: "رحلة",
    },
  ];

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expensesData.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const profit = totalIncome - totalExpenses;

  const renderIncomeTable = () => (
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
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("addNew" as any)}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("addIncomeEntry" as any)}</DialogTitle>
                  <DialogDescription>
                    {t("enterIncomeDetails" as any)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>{t("type" as any)}</Label>
                    <Select
                      value={newEntry.type}
                      onValueChange={(value) =>
                        setNewEntry({ ...newEntry, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="race">
                          {t("raceWinnings" as any)}
                        </SelectItem>
                        <SelectItem value="sale">
                          {t("pigeonSale" as any)}
                        </SelectItem>
                        <SelectItem value="other">
                          {t("other" as any)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("amount" as any)}</Label>
                    <Input
                      type="number"
                      value={newEntry.amount}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, amount: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>{t("description" as any)}</Label>
                    <Input
                      value={newEntry.description}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          description: e.target.value,
                        })
                      }
                      placeholder={t("enterDescription" as any)}
                    />
                  </div>
                  <div>
                    <Label>{t("date" as any)}</Label>
                    <Input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, date: e.target.value })
                      }
                    />
                  </div>
                  <Button className="w-full">{t("save" as any)}</Button>
                </div>
              </DialogContent>
            </Dialog>
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
                {incomeData.map((item) => (
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
                        <Button variant="ghost" size="sm">
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

  const renderExpensesTable = () => (
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
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("addNew" as any)}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("addExpense" as any)}</DialogTitle>
                  <DialogDescription>
                    {t("enterExpenseDetails" as any)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>{t("category" as any)}</Label>
                    <Select
                      value={newEntry.category}
                      onValueChange={(value) =>
                        setNewEntry({ ...newEntry, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feed">{t("feed" as any)}</SelectItem>
                        <SelectItem value="medicine">
                          {t("medicine" as any)}
                        </SelectItem>
                        <SelectItem value="equipment">
                          {t("equipment" as any)}
                        </SelectItem>
                        <SelectItem value="transport">
                          {t("transport" as any)}
                        </SelectItem>
                        <SelectItem value="other">
                          {t("other" as any)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("amount" as any)}</Label>
                    <Input
                      type="number"
                      value={newEntry.amount}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, amount: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>{t("description" as any)}</Label>
                    <Input
                      value={newEntry.description}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          description: e.target.value,
                        })
                      }
                      placeholder={t("enterDescription" as any)}
                    />
                  </div>
                  <div>
                    <Label>{t("date" as any)}</Label>
                    <Input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, date: e.target.value })
                      }
                    />
                  </div>
                  <Button className="w-full">{t("save" as any)}</Button>
                </div>
              </DialogContent>
            </Dialog>
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
                {expensesData.map((item) => (
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
                        <Button variant="ghost" size="sm">
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

  const renderFinancialReports = () => (
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
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "↑ 5% هذا الشهر" : "↑ 5% this month"}
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
            <p
              className={`text-2xl font-bold ${profit >= 0 ? "text-blue-600" : "text-red-600"}`}
            >
              {profit} {t("currency" as any)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "↑ 20% هذا الشهر" : "↑ 20% this month"}
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
            <p className="text-2xl font-bold text-purple-600">
              {totalIncome > 0 ? Math.round((profit / totalIncome) * 100) : 0}%
            </p>
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
              ? "تقرير السنة المالية"
              : "Annual Financial Report"}
          </CardTitle>
          <CardDescription>
            {language === "ar"
              ? "مقارنة شاملة بين الأشهر"
              : "Comprehensive monthly comparison"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  {language === "ar"
                    ? "أعلى دخل شهري"
                    : "Highest monthly income"}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  850 {t("currency" as any)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {language === "ar" ? "في شهر يناير" : "in January"}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  {language === "ar"
                    ? "أعلى مصروف شهري"
                    : "Highest monthly expense"}
                </p>
                <p className="text-2xl font-bold text-red-600">
                  565 {t("currency" as any)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {language === "ar" ? "في شهر ديسمبر" : "in December"}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  {language === "ar" ? "متوسط الأرباح" : "Average profit"}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  285 {t("currency" as any)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {language === "ar" ? "شهرياً" : "monthly"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("monthlyOverview" as any)}</CardTitle>
          <CardDescription>
            {t("incomeVsExpensesComparison" as any)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {t("totalIncome" as any)}
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {totalIncome} {t("currency" as any)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {t("totalExpenses" as any)}
                </span>
                <span className="text-sm font-semibold text-red-600">
                  {totalExpenses} {t("currency" as any)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(totalExpenses / totalIncome) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("topIncomeSource" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("raceWinnings" as any)}</span>
                <span className="font-semibold">
                  400 {t("currency" as any)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("pigeonSale" as any)}</span>
                <span className="font-semibold">
                  500 {t("currency" as any)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("topExpenseCategory" as any)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("equipment" as any)}</span>
                <span className="font-semibold">
                  300 {t("currency" as any)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("feed" as any)}</span>
                <span className="font-semibold">
                  120 {t("currency" as any)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("medicine" as any)}</span>
                <span className="font-semibold">85 {t("currency" as any)}</span>
              </div>
            </div>
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {currentPage === "income"
                ? t("income" as any)
                : currentPage === "expenses"
                  ? t("expenses" as any)
                  : t("financialReports" as any)}
            </h1>
            <p className="text-muted-foreground">
              {currentPage === "income"
                ? t("trackRaceEarnings" as any)
                : currentPage === "expenses"
                  ? t("trackAllExpenses" as any)
                  : t("viewFinancialAnalysis" as any)}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentPage === "income" && renderIncomeTable()}
        {currentPage === "expenses" && renderExpensesTable()}
        {currentPage === "reports" && renderFinancialReports()}
      </AnimatePresence>
    </motion.div>
  );
}
