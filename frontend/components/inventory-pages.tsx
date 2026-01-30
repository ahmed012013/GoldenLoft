"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingDown,
  Calendar,
  DollarSign,
  Pill,
  Wheat,
  Wrench,
  ShoppingCart,
  BarChart3,
  Filter,
} from "lucide-react";

interface InventoryPagesProps {
  currentPage: "feed" | "medications" | "equipment";
  onBack: () => void;
}

// Sample data
const feedItems = [
  {
    id: 1,
    name: "Premium Seed Mix",
    type: "mix",
    quantity: 25,
    unit: "kg",
    minStock: 10,
    price: 45,
    expiryDate: "2026-06-15",
    supplier: "Golden Seeds Co.",
    status: "inStock",
  },
  {
    id: 2,
    name: "Racing Pellets",
    type: "pellet",
    quantity: 8,
    unit: "kg",
    minStock: 15,
    price: 60,
    expiryDate: "2026-04-20",
    supplier: "Pro Pigeon Feed",
    status: "lowStock",
  },
  {
    id: 3,
    name: "Breeding Mix",
    type: "mix",
    quantity: 30,
    unit: "kg",
    minStock: 20,
    price: 55,
    expiryDate: "2026-08-10",
    supplier: "Golden Seeds Co.",
    status: "inStock",
  },
  {
    id: 4,
    name: "Mineral Grit",
    type: "grit",
    quantity: 5,
    unit: "kg",
    minStock: 8,
    price: 25,
    expiryDate: "2027-01-01",
    supplier: "Avian Minerals",
    status: "lowStock",
  },
  {
    id: 5,
    name: "Sunflower Seeds",
    type: "seed",
    quantity: 0,
    unit: "kg",
    minStock: 5,
    price: 35,
    expiryDate: "2026-05-01",
    supplier: "Organic Feeds",
    status: "outOfStock",
  },
];

const medicationItems = [
  {
    id: 1,
    name: "Paramyxovirus Vaccine",
    type: "vaccine",
    quantity: 50,
    unit: "doses",
    minStock: 20,
    price: 120,
    expiryDate: "2026-03-15",
    supplier: "VetPharm",
    status: "inStock",
  },
  {
    id: 2,
    name: "Respiratory Antibiotic",
    type: "antibiotic",
    quantity: 3,
    unit: "bottles",
    minStock: 5,
    price: 85,
    expiryDate: "2026-02-28",
    supplier: "Avian Health",
    status: "expiringSoon",
  },
  {
    id: 3,
    name: "Multivitamin Drops",
    type: "vitamin",
    quantity: 8,
    unit: "bottles",
    minStock: 4,
    price: 45,
    expiryDate: "2026-09-01",
    supplier: "VetPharm",
    status: "inStock",
  },
  {
    id: 4,
    name: "Dewormer Solution",
    type: "antiparasitic",
    quantity: 2,
    unit: "bottles",
    minStock: 3,
    price: 55,
    expiryDate: "2026-07-20",
    supplier: "ParaStop",
    status: "lowStock",
  },
  {
    id: 5,
    name: "Probiotic Powder",
    type: "probiotic",
    quantity: 6,
    unit: "bags",
    minStock: 3,
    price: 40,
    expiryDate: "2026-12-01",
    supplier: "BioAvian",
    status: "inStock",
  },
];

const equipmentItems = [
  {
    id: 1,
    name: "Auto Feeder Large",
    type: "feeder",
    quantity: 12,
    unit: "pcs",
    condition: "good",
    price: 150,
    purchaseDate: "2025-06-15",
    location: "Main Loft",
  },
  {
    id: 2,
    name: "Water Drinker 5L",
    type: "drinker",
    quantity: 20,
    unit: "pcs",
    condition: "good",
    price: 35,
    purchaseDate: "2025-08-20",
    location: "All Lofts",
  },
  {
    id: 3,
    name: "Nest Box Standard",
    type: "nestBox",
    quantity: 30,
    unit: "pcs",
    condition: "fair",
    price: 45,
    purchaseDate: "2024-03-10",
    location: "Breeding Loft",
  },
  {
    id: 4,
    name: "Training Basket",
    type: "training",
    quantity: 5,
    unit: "pcs",
    condition: "good",
    price: 200,
    purchaseDate: "2025-01-05",
    location: "Storage",
  },
  {
    id: 5,
    name: "Cleaning Brush Set",
    type: "cleaning",
    quantity: 3,
    unit: "sets",
    condition: "worn",
    price: 25,
    purchaseDate: "2024-09-01",
    location: "Storage",
  },
];

export function InventoryPages({ currentPage, onBack }: InventoryPagesProps) {
  const { t, dir, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "inStock":
        return (
          <Badge className="rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20">
            {t("inStock")}
          </Badge>
        );
      case "lowStock":
        return (
          <Badge className="rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
            {t("lowStock")}
          </Badge>
        );
      case "outOfStock":
        return (
          <Badge className="rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20">
            {t("outOfStock")}
          </Badge>
        );
      case "expiringSoon":
        return (
          <Badge className="rounded-xl bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">
            {t("expiringSoon")}
          </Badge>
        );
      default:
        return <Badge className="rounded-xl">{status}</Badge>;
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "good":
        return (
          <Badge className="rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20">
            {language === "ar" ? "جيدة" : "Good"}
          </Badge>
        );
      case "fair":
        return (
          <Badge className="rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
            {language === "ar" ? "مقبولة" : "Fair"}
          </Badge>
        );
      case "worn":
        return (
          <Badge className="rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20">
            {language === "ar" ? "مستهلكة" : "Worn"}
          </Badge>
        );
      default:
        return <Badge className="rounded-xl">{condition}</Badge>;
    }
  };

  const renderFeedPage = () => {
    const stats = {
      total: feedItems.length,
      lowStock: feedItems.filter((i) => i.status === "lowStock").length,
      outOfStock: feedItems.filter((i) => i.status === "outOfStock").length,
      totalValue: feedItems.reduce((acc, i) => acc + i.quantity * i.price, 0),
    };

    const feedTypes = [
      { value: "seed", label: t("feedTypeSeed") },
      { value: "grain", label: t("feedTypeGrain") },
      { value: "pellet", label: t("feedTypePellet") },
      { value: "mix", label: t("feedTypeMix") },
      { value: "grit", label: t("feedTypeGrit") },
      { value: "supplement", label: t("feedTypeSupplement") },
    ];

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("totalItems")}
                  </p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                  <Package className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("lowStockItems")}
                  </p>
                  <p className="text-3xl font-bold text-amber-500">
                    {stats.lowStock}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                  <TrendingDown className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("outOfStock")}
                  </p>
                  <p className="text-3xl font-bold text-red-500">
                    {stats.outOfStock}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("totalInventoryValue")}
                  </p>
                  <p className="text-3xl font-bold text-green-500">
                    ${stats.totalValue}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search
                  className={cn(
                    "absolute top-3 h-4 w-4 text-muted-foreground",
                    dir === "rtl" ? "right-3" : "left-3",
                  )}
                />
                <Input
                  placeholder={
                    language === "ar" ? "بحث عن صنف..." : "Search items..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn("rounded-2xl", dir === "rtl" ? "pr-9" : "pl-9")}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px] rounded-2xl">
                    <SelectValue placeholder={t("itemType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === "ar" ? "الكل" : "All Types"}
                    </SelectItem>
                    {feedTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px] rounded-2xl">
                    <SelectValue placeholder={t("status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allStatuses")}</SelectItem>
                    <SelectItem value="inStock">{t("inStock")}</SelectItem>
                    <SelectItem value="lowStock">{t("lowStock")}</SelectItem>
                    <SelectItem value="outOfStock">
                      {t("outOfStock")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="rounded-2xl">
                      <Plus
                        className={cn(
                          "h-4 w-4",
                          dir === "rtl" ? "ml-2" : "mr-2",
                        )}
                      />
                      {t("addItem")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{t("addItem")}</DialogTitle>
                      <DialogDescription>
                        {language === "ar"
                          ? "أضف صنف علف جديد للمخزون"
                          : "Add a new feed item to inventory"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>{t("itemName")}</Label>
                        <Input
                          placeholder={
                            language === "ar"
                              ? "أدخل اسم الصنف"
                              : "Enter item name"
                          }
                          className="rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>{t("itemType")}</Label>
                          <Select>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue
                                placeholder={
                                  language === "ar"
                                    ? "اختر النوع"
                                    : "Select type"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {feedTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>{t("unit")}</Label>
                          <Select>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue
                                placeholder={
                                  language === "ar"
                                    ? "اختر الوحدة"
                                    : "Select unit"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">{t("unitKg")}</SelectItem>
                              <SelectItem value="g">{t("unitG")}</SelectItem>
                              <SelectItem value="bag">
                                {t("unitBag")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>{t("quantity")}</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>{t("minStock")}</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>{t("unitPrice")}</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>{t("expiryDate")}</Label>
                          <Input type="date" className="rounded-xl" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>{t("supplier")}</Label>
                        <Input
                          placeholder={
                            language === "ar" ? "اسم المورد" : "Supplier name"
                          }
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="rounded-xl bg-transparent"
                      >
                        {t("cancel")}
                      </Button>
                      <Button
                        onClick={() => setIsAddDialogOpen(false)}
                        className="rounded-xl"
                      >
                        {t("saveItem")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card className="rounded-3xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("itemName")}</TableHead>
                <TableHead>{t("itemType")}</TableHead>
                <TableHead>{t("quantity")}</TableHead>
                <TableHead>{t("minStock")}</TableHead>
                <TableHead>{t("unitPrice")}</TableHead>
                <TableHead>{t("expiryDate")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-center">
                  {language === "ar" ? "إجراءات" : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    {feedTypes.find((t) => t.value === item.type)?.label ||
                      item.type}
                  </TableCell>
                  <TableCell>
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell>
                    {item.minStock} {item.unit}
                  </TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  };

  const renderMedicationsPage = () => {
    const stats = {
      total: medicationItems.length,
      lowStock: medicationItems.filter((i) => i.status === "lowStock").length,
      expiringSoon: medicationItems.filter((i) => i.status === "expiringSoon")
        .length,
      totalValue: medicationItems.reduce(
        (acc, i) => acc + i.quantity * i.price,
        0,
      ),
    };

    const medTypes = [
      { value: "vaccine", label: t("medTypeVaccine") },
      { value: "antibiotic", label: t("medTypeAntibiotic") },
      { value: "vitamin", label: t("medTypeVitamin") },
      { value: "antiparasitic", label: t("medTypeAntiparasitic") },
      { value: "probiotic", label: t("medTypeProbiotic") },
      { value: "other", label: t("medTypeOther") },
    ];

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("totalItems")}
                  </p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                  <Pill className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("lowStockItems")}
                  </p>
                  <p className="text-3xl font-bold text-amber-500">
                    {stats.lowStock}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                  <TrendingDown className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("expiringItems")}
                  </p>
                  <p className="text-3xl font-bold text-orange-500">
                    {stats.expiringSoon}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10">
                  <Calendar className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("totalInventoryValue")}
                  </p>
                  <p className="text-3xl font-bold text-green-500">
                    ${stats.totalValue}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {stats.expiringSoon > 0 && (
          <Card className="rounded-3xl border-orange-500/50 bg-orange-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <p className="text-sm font-medium text-orange-500">
                  {language === "ar"
                    ? `تحذير: ${stats.expiringSoon} أدوية قريبة من انتهاء الصلاحية!`
                    : `Warning: ${stats.expiringSoon} medications expiring soon!`}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Add */}
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search
                  className={cn(
                    "absolute top-3 h-4 w-4 text-muted-foreground",
                    dir === "rtl" ? "right-3" : "left-3",
                  )}
                />
                <Input
                  placeholder={
                    language === "ar"
                      ? "بحث عن دواء..."
                      : "Search medications..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn("rounded-2xl", dir === "rtl" ? "pr-9" : "pl-9")}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px] rounded-2xl">
                    <SelectValue placeholder={t("itemType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === "ar" ? "الكل" : "All Types"}
                    </SelectItem>
                    {medTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="rounded-2xl">
                  <Plus
                    className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                  />
                  {t("addItem")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card className="rounded-3xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("itemName")}</TableHead>
                <TableHead>{t("itemType")}</TableHead>
                <TableHead>{t("quantity")}</TableHead>
                <TableHead>{t("minStock")}</TableHead>
                <TableHead>{t("unitPrice")}</TableHead>
                <TableHead>{t("expiryDate")}</TableHead>
                <TableHead>{t("supplier")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-center">
                  {language === "ar" ? "إجراءات" : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicationItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    {medTypes.find((t) => t.value === item.type)?.label ||
                      item.type}
                  </TableCell>
                  <TableCell>
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell>
                    {item.minStock} {item.unit}
                  </TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  };

  const renderEquipmentPage = () => {
    const stats = {
      total: equipmentItems.length,
      totalQuantity: equipmentItems.reduce((acc, i) => acc + i.quantity, 0),
      worn: equipmentItems.filter((i) => i.condition === "worn").length,
      totalValue: equipmentItems.reduce(
        (acc, i) => acc + i.quantity * i.price,
        0,
      ),
    };

    const equipTypes = [
      { value: "feeder", label: t("equipTypeFeeder") },
      { value: "drinker", label: t("equipTypeDrinker") },
      { value: "nestBox", label: t("equipTypeNestBox") },
      { value: "perch", label: t("equipTypePerch") },
      { value: "trap", label: t("equipTypeTrap") },
      { value: "cage", label: t("equipTypeCage") },
      { value: "cleaning", label: t("equipTypeCleaning") },
      { value: "training", label: t("equipTypeTraining") },
      { value: "other", label: t("equipTypeOther") },
    ];

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("totalItems")}
                  </p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                  <Wrench className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar" ? "إجمالي القطع" : "Total Pieces"}
                  </p>
                  <p className="text-3xl font-bold">{stats.totalQuantity}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10">
                  <Package className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar" ? "تحتاج استبدال" : "Needs Replacement"}
                  </p>
                  <p className="text-3xl font-bold text-amber-500">
                    {stats.worn}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("totalInventoryValue")}
                  </p>
                  <p className="text-3xl font-bold text-green-500">
                    ${stats.totalValue}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Add */}
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search
                  className={cn(
                    "absolute top-3 h-4 w-4 text-muted-foreground",
                    dir === "rtl" ? "right-3" : "left-3",
                  )}
                />
                <Input
                  placeholder={
                    language === "ar"
                      ? "بحث عن معدات..."
                      : "Search equipment..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn("rounded-2xl", dir === "rtl" ? "pr-9" : "pl-9")}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px] rounded-2xl">
                    <SelectValue placeholder={t("itemType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === "ar" ? "الكل" : "All Types"}
                    </SelectItem>
                    {equipTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="rounded-2xl">
                  <Plus
                    className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                  />
                  {t("addItem")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items as Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {equipmentItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="rounded-3xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                      <Wrench className="h-6 w-6 text-muted-foreground" />
                    </div>
                    {getConditionBadge(item.condition)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {equipTypes.find((t) => t.value === item.type)?.label ||
                        item.type}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        {t("quantity")}:
                      </span>
                      <span className="font-medium">
                        {" "}
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t("unitPrice")}:
                      </span>
                      <span className="font-medium"> ${item.price}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {language === "ar" ? "الموقع" : "Location"}:
                      </span>
                      <span className="font-medium"> {item.location}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t("purchaseDate")}:
                      </span>
                      <span className="font-medium"> {item.purchaseDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl bg-transparent"
                    >
                      <Edit
                        className={cn(
                          "h-4 w-4",
                          dir === "rtl" ? "ml-1" : "mr-1",
                        )}
                      />
                      {t("editItem")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case "feed":
        return t("feedManagement");
      case "medications":
        return t("medicationsManagement");
      case "equipment":
        return t("equipmentManagement");
    }
  };

  const getPageIcon = () => {
    switch (currentPage) {
      case "feed":
        return <Wheat className="h-6 w-6" />;
      case "medications":
        return <Pill className="h-6 w-6" />;
      case "equipment":
        return <Wrench className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-2xl"
          >
            {dir === "rtl" ? (
              <ArrowRight className="h-5 w-5" />
            ) : (
              <ArrowLeft className="h-5 w-5" />
            )}
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white">
              {getPageIcon()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
              <p className="text-sm text-muted-foreground">
                {t("inventoryManagement")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentPage === "feed" && renderFeedPage()}
          {currentPage === "medications" && renderMedicationsPage()}
          {currentPage === "equipment" && renderEquipmentPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
