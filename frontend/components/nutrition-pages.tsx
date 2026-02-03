"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Search,
  Edit,
  Trash2,
  Utensils,
  Droplets,
  Pill,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Filter,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

interface NutritionPagesProps {
  currentPage: "feeding" | "supplements" | "water";
  onBack: () => void;
}

// Sample Data
const feedingPlans = [
  {
    id: 1,
    name: "Racing Season Plan",
    nameAr: "خطة موسم السباق",
    targetGroup: "racing",
    feedType: "mix",
    morningAmount: "30g",
    eveningAmount: "25g",
    isActive: true,
    pigeonCount: 24,
  },
  {
    id: 2,
    name: "Breeding Plan",
    nameAr: "خطة التفريخ",
    targetGroup: "breeding",
    feedType: "pellet",
    morningAmount: "35g",
    eveningAmount: "30g",
    isActive: true,
    pigeonCount: 12,
  },
  {
    id: 3,
    name: "Young Birds Plan",
    nameAr: "خطة الزغاليل",
    targetGroup: "young",
    feedType: "seed",
    morningAmount: "20g",
    eveningAmount: "20g",
    isActive: false,
    pigeonCount: 8,
  },
];

const supplements = [
  {
    id: 1,
    name: "Vitamin B Complex",
    nameAr: "فيتامين ب المركب",
    type: "vitamin",
    dosage: "5ml/L",
    frequency: "weekly",
    purpose: "Energy & metabolism",
    purposeAr: "الطاقة والتمثيل الغذائي",
    inStock: true,
  },
  {
    id: 2,
    name: "Calcium Plus",
    nameAr: "كالسيوم بلس",
    type: "mineral",
    dosage: "10ml/L",
    frequency: "daily",
    purpose: "Bone health & egg quality",
    purposeAr: "صحة العظام وجودة البيض",
    inStock: true,
  },
  {
    id: 3,
    name: "Probiotics",
    nameAr: "بروبيوتيك",
    type: "probiotic",
    dosage: "3g/L",
    frequency: "twice_weekly",
    purpose: "Digestive health",
    purposeAr: "صحة الجهاز الهضمي",
    inStock: false,
  },
  {
    id: 4,
    name: "Electrolytes",
    nameAr: "إلكتروليتات",
    type: "electrolyte",
    dosage: "15ml/L",
    frequency: "after_race",
    purpose: "Recovery after racing",
    purposeAr: "التعافي بعد السباق",
    inStock: true,
  },
];

const waterSchedule = [
  {
    id: 1,
    loft: "Main Loft",
    loftAr: "اللوفت الرئيسي",
    lastChange: "2024-01-15 08:00",
    nextChange: "2024-01-15 18:00",
    quality: "good",
    additive: "Vitamin C",
    additiveAr: "فيتامين سي",
  },
  {
    id: 2,
    loft: "Breeding Loft",
    loftAr: "لوفت التفريخ",
    lastChange: "2024-01-15 07:30",
    nextChange: "2024-01-15 17:30",
    quality: "good",
    additive: "None",
    additiveAr: "بدون",
  },
  {
    id: 3,
    loft: "Young Birds Loft",
    loftAr: "لوفت الزغاليل",
    lastChange: "2024-01-14 18:00",
    nextChange: "2024-01-15 08:00",
    quality: "fair",
    additive: "Probiotics",
    additiveAr: "بروبيوتيك",
  },
];

export function NutritionPages({ currentPage, onBack }: NutritionPagesProps) {
  const { t, dir, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  const getPageTitle = () => {
    switch (currentPage) {
      case "feeding":
        return t("feedingPlansTitle" as any);
      case "supplements":
        return t("supplementsTitle" as any);
      case "water":
        return t("waterManagementTitle" as any);
      default:
        return t("nutritionManagement" as any);
    }
  };

  const getTargetGroupLabel = (group: string) => {
    const groups: Record<string, string> = {
      all: t("allPigeonsGroup" as any),
      racing: t("racingPigeonsGroup" as any),
      breeding: t("breedingPigeonsGroup" as any),
      young: t("youngPigeonsGroup" as any),
      sick: t("sickPigeonsGroup" as any),
      molting: t("moltingPigeonsGroup" as any),
    };
    return groups[group] || group;
  };

  const getSupplementTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      vitamin: t("vitaminSupplement" as any),
      mineral: t("mineralSupplement" as any),
      probiotic: t("probioticSupplement" as any),
      electrolyte: t("electrolytesSupplement" as any),
      amino: t("aminoAcidSupplement" as any),
      energy: t("energySupplement" as any),
    };
    return types[type] || type;
  };

  const getQualityLabel = (quality: string) => {
    const qualities: Record<string, string> = {
      good: t("goodQuality" as any),
      fair: t("fairQuality" as any),
      poor: t("poorQuality" as any),
    };
    return qualities[quality] || quality;
  };

  // Feeding Plans Page
  const FeedingPlansPage = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <Utensils className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{feedingPlans.length}</p>
                <p className="text-xs text-muted-foreground">
                  {t("totalFeedingPlans" as any)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {feedingPlans.filter((p) => p.isActive).length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("activePlans" as any)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <Users className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {feedingPlans.reduce((sum, p) => sum + p.pigeonCount, 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("pigeons" as any)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">
                  {t("feedingFrequency" as any)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className={cn(
              "absolute top-3 h-4 w-4 text-muted-foreground",
              dir === "rtl" ? "right-3" : "left-3",
            )}
          />
          <Input
            type="search"
            placeholder={t("search" as any)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn("rounded-xl", dir === "rtl" ? "pr-9" : "pl-9")}
          />
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus
                className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
              />
              {t("addFeedingPlan" as any)}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>{t("addFeedingPlan" as any)}</DialogTitle>
              <DialogDescription>
                {t("planDescription" as any)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t("planName" as any)}</Label>
                <Input
                  placeholder={t("planName" as any)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("targetGroup" as any)}</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={t("selectCategory" as any)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("allPigeonsGroup" as any)}
                    </SelectItem>
                    <SelectItem value="racing">
                      {t("racingPigeonsGroup" as any)}
                    </SelectItem>
                    <SelectItem value="breeding">
                      {t("breedingPigeonsGroup" as any)}
                    </SelectItem>
                    <SelectItem value="young">
                      {t("youngPigeonsGroup" as any)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("morningFeed" as any)}</Label>
                  <Input placeholder="30g" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{t("eveningFeed" as any)}</Label>
                  <Input placeholder="25g" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("feedType" as any)}</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={t("selectCategory" as any)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seed">
                      {t("feedTypeSeed" as any)}
                    </SelectItem>
                    <SelectItem value="grain">
                      {t("feedTypeGrain" as any)}
                    </SelectItem>
                    <SelectItem value="pellet">
                      {t("feedTypePellet" as any)}
                    </SelectItem>
                    <SelectItem value="mix">
                      {t("feedTypeMix" as any)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="rounded-xl bg-transparent"
              >
                {t("cancel" as any)}
              </Button>
              <Button
                onClick={() => setShowAddDialog(false)}
                className="rounded-xl"
              >
                {t("saveFeedingPlan" as any)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Feeding Plans List */}
      <div className="grid gap-4">
        {feedingPlans.map((plan) => (
          <Card key={plan.id} className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      plan.isActive ? "bg-green-500/10" : "bg-muted",
                    )}
                  >
                    <Utensils
                      className={cn(
                        "h-6 w-6",
                        plan.isActive
                          ? "text-green-500"
                          : "text-muted-foreground",
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {language === "ar" ? plan.nameAr : plan.name}
                      </h3>
                      <Badge
                        variant={plan.isActive ? "default" : "secondary"}
                        className="rounded-full"
                      >
                        {plan.isActive
                          ? t("activePlan" as any)
                          : t("inactivePlan" as any)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getTargetGroupLabel(plan.targetGroup)} -{" "}
                      {plan.pigeonCount} {t("pigeons" as any)}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {t("morningFeed" as any)}: {plan.morningAmount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {t("eveningFeed" as any)}: {plan.eveningAmount}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl bg-transparent"
                  >
                    {plan.isActive ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl bg-transparent"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align={dir === "rtl" ? "start" : "end"}
                    >
                      <DropdownMenuItem>
                        <Edit
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("editFeedingPlan" as any)}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        <Trash2
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("deleteFeedingPlan" as any)}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Supplements Page
  const SupplementsPage = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <Pill className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{supplements.length}</p>
                <p className="text-xs text-muted-foreground">
                  {t("totalSupplements" as any)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {supplements.filter((s) => s.inStock).length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("inStock" as any)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {supplements.filter((s) => !s.inStock).length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("outOfStock" as any)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <Calendar className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">
                  {t("daily" as any)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search
              className={cn(
                "absolute top-3 h-4 w-4 text-muted-foreground",
                dir === "rtl" ? "right-3" : "left-3",
              )}
            />
            <Input
              type="search"
              placeholder={t("search" as any)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn("rounded-xl", dir === "rtl" ? "pr-9" : "pl-9")}
            />
          </div>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[150px] rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses" as any)}</SelectItem>
              <SelectItem value="vitamin">
                {t("vitaminSupplement" as any)}
              </SelectItem>
              <SelectItem value="mineral">
                {t("mineralSupplement" as any)}
              </SelectItem>
              <SelectItem value="probiotic">
                {t("probioticSupplement" as any)}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus
                className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
              />
              {t("addSupplement" as any)}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>{t("addSupplement" as any)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t("supplementName" as any)}</Label>
                <Input
                  placeholder={t("supplementName" as any)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("supplementType" as any)}</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={t("selectCategory" as any)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vitamin">
                      {t("vitaminSupplement" as any)}
                    </SelectItem>
                    <SelectItem value="mineral">
                      {t("mineralSupplement" as any)}
                    </SelectItem>
                    <SelectItem value="probiotic">
                      {t("probioticSupplement" as any)}
                    </SelectItem>
                    <SelectItem value="electrolyte">
                      {t("electrolytesSupplement" as any)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("supplementDosage" as any)}</Label>
                  <Input placeholder="5ml/L" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{t("supplementFrequency" as any)}</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">{t("daily" as any)}</SelectItem>
                      <SelectItem value="weekly">
                        {t("weekly" as any)}
                      </SelectItem>
                      <SelectItem value="monthly">
                        {t("monthly" as any)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("supplementPurpose" as any)}</Label>
                <Textarea
                  placeholder={t("supplementPurpose" as any)}
                  className="rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="rounded-xl bg-transparent"
              >
                {t("cancel" as any)}
              </Button>
              <Button
                onClick={() => setShowAddDialog(false)}
                className="rounded-xl"
              >
                {t("saveSupplement" as any)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Supplements Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {supplements.map((supplement) => (
          <Card key={supplement.id} className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      supplement.inStock ? "bg-green-500/10" : "bg-red-500/10",
                    )}
                  >
                    <Pill
                      className={cn(
                        "h-5 w-5",
                        supplement.inStock ? "text-green-500" : "text-red-500",
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {language === "ar"
                          ? supplement.nameAr
                          : supplement.name}
                      </h3>
                      <Badge variant="outline" className="rounded-full text-xs">
                        {getSupplementTypeLabel(supplement.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar"
                        ? supplement.purposeAr
                        : supplement.purpose}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {t("supplementDosage" as any)}: {supplement.dosage}
                      </span>
                      <span>
                        {t("supplementFrequency" as any)}:{" "}
                        {supplement.frequency}
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
                    <DropdownMenuItem>
                      <Edit
                        className={cn(
                          "h-4 w-4",
                          dir === "rtl" ? "ml-2" : "mr-2",
                        )}
                      />
                      {t("editSupplement" as any)}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">
                      <Trash2
                        className={cn(
                          "h-4 w-4",
                          dir === "rtl" ? "ml-2" : "mr-2",
                        )}
                      />
                      {t("deleteSupplement" as any)}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge
                  variant={supplement.inStock ? "default" : "destructive"}
                  className="rounded-full"
                >
                  {supplement.inStock
                    ? t("inStock" as any)
                    : t("outOfStock" as any)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Water Management Page
  const WaterManagementPage = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <Droplets className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{waterSchedule.length}</p>
                <p className="text-xs text-muted-foreground">
                  {t("loftManagement" as any)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {waterSchedule.filter((w) => w.quality === "good").length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("goodQuality" as any)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {waterSchedule.filter((w) => w.quality !== "good").length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("fairQuality" as any)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-xs text-muted-foreground">
                  {t("waterChangesToday" as any)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Water Schedule */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("waterManagementTitle" as any)}</CardTitle>
            <Button className="rounded-xl">
              <Plus
                className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
              />
              {t("scheduleWaterChange" as any)}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {waterSchedule.map((schedule) => (
              <div
                key={schedule.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-muted/50 gap-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      schedule.quality === "good"
                        ? "bg-green-500/10"
                        : schedule.quality === "fair"
                          ? "bg-amber-500/10"
                          : "bg-red-500/10",
                    )}
                  >
                    <Droplets
                      className={cn(
                        "h-6 w-6",
                        schedule.quality === "good"
                          ? "text-green-500"
                          : schedule.quality === "fair"
                            ? "text-amber-500"
                            : "text-red-500",
                      )}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {language === "ar" ? schedule.loftAr : schedule.loft}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("waterAdditive" as any)}:{" "}
                      {language === "ar"
                        ? schedule.additiveAr
                        : schedule.additive}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      {t("lastWaterChange" as any)}
                    </p>
                    <p className="font-medium">{schedule.lastChange}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      {t("nextWaterChange" as any)}
                    </p>
                    <p className="font-medium">{schedule.nextChange}</p>
                  </div>
                  <Badge
                    variant={
                      schedule.quality === "good"
                        ? "default"
                        : schedule.quality === "fair"
                          ? "secondary"
                          : "destructive"
                    }
                    className="rounded-full"
                  >
                    {getQualityLabel(schedule.quality)}
                  </Badge>
                  <Button className="rounded-xl" size="sm">
                    <Droplets
                      className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                    />
                    {t("changeWater" as any)}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Water Change History */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>{t("waterChangeHistory" as any)}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                      <Droplets className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {language === "ar" ? "اللوفت الرئيسي" : "Main Loft"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2024-01-{15 - i} 08:00
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {t("completed" as any)}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case "feeding":
        return <FeedingPlansPage />;
      case "supplements":
        return <SupplementsPage />;
      case "water":
        return <WaterManagementPage />;
      default:
        return <FeedingPlansPage />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-xl"
        >
          <BackIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          <p className="text-sm text-muted-foreground">
            {t("nutritionManagement" as any)}
          </p>
        </div>
      </div>

      {/* Page Content */}
      {renderPage()}
    </motion.div>
  );
}
