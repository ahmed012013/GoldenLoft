"use client";

import { useLanguage } from "@/lib/language-context";
import { FeedingPlan } from "@/hooks/useNutrition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Utensils,
  Clock,
  CheckCircle2,
  Users,
  Search,
  Plus,
  Play,
  Pause,
  MoreHorizontal,
  Filter,
  Edit,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FeedingPlansManagerProps {
  plans: FeedingPlan[];
  getTargetGroupLabel: (group: string) => string;
  onAdd: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export function FeedingPlansManager({
  plans,
  getTargetGroupLabel,
  onAdd,
  onEdit,
  onDelete,
  onToggleStatus,
}: FeedingPlansManagerProps) {
  const { t, dir, language } = useLanguage();

  return (
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
                <p className="text-2xl font-bold">{plans.length}</p>
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
                  {plans.filter((p) => p.isActive).length}
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
                  {plans.reduce((sum, p) => sum + p.pigeonCount, 0)}
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
            className={cn("rounded-xl", dir === "rtl" ? "pr-9" : "pl-9")}
          />
        </div>
        <Button onClick={onAdd} className="rounded-xl">
          <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
          {t("addFeedingPlan" as any)}
        </Button>
      </div>

      {/* Feeding Plans List */}
      <div className="grid gap-4">
        {plans.map((plan) => (
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
                    onClick={() => onToggleStatus(plan.id)}
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
                      <DropdownMenuItem onClick={() => onEdit(plan.id)}>
                        <Edit
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("editFeedingPlan" as any)}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(plan.id)}
                        className="text-red-500"
                      >
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
}
