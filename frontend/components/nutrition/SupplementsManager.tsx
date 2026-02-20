"use client";

import { useLanguage } from "@/lib/language-context";
import { Supplement } from "@/hooks/useNutrition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Pill,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface SupplementsManagerProps {
  supplements: Supplement[];
  getSupplementTypeLabel: (type: string) => string;
  onAdd: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function SupplementsManager({
  supplements,
  getSupplementTypeLabel,
  onAdd,
  onEdit,
  onDelete,
}: SupplementsManagerProps) {
  const { t, dir, language } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState("all");

  return (
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
        <Button onClick={onAdd} className="rounded-xl">
          <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
          {t("addSupplement" as any)}
        </Button>
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
                    <DropdownMenuItem onClick={() => onEdit(supplement.id)}>
                      <Edit
                        className={cn(
                          "h-4 w-4",
                          dir === "rtl" ? "ml-2" : "mr-2",
                        )}
                      />
                      {t("editSupplement" as any)}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(supplement.id)}
                      className="text-red-500"
                    >
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
