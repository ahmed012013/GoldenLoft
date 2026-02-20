"use client";

import { useLanguage } from "@/lib/language-context";
import { WaterSchedule } from "@/hooks/useNutrition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Droplets, Clock, AlertCircle, RefreshCw, MoreHorizontal, Edit, Plus, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WaterManagerProps {
    schedule: WaterSchedule[];
    getQualityLabel: (quality: string) => string;
    onRefresh: (id: number) => void;
    onEdit: (id: number) => void;
    onAdd: () => void;
}

export function WaterManager({
    schedule,
    getQualityLabel,
    onRefresh,
    onEdit,
    onAdd,
}: WaterManagerProps) {
    const { t, dir, language } = useLanguage();

    return (
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
                                <p className="text-2xl font-bold">{schedule.length}</p>
                                <p className="text-xs text-muted-foreground">{t("loftManagement" as any)}</p>
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
                                <p className="text-2xl font-bold">{schedule.filter((w) => w.quality === "good").length}</p>
                                <p className="text-xs text-muted-foreground">{t("goodQuality" as any)}</p>
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
                                <p className="text-2xl font-bold">{schedule.filter((w) => w.quality !== "good").length}</p>
                                <p className="text-xs text-muted-foreground">{t("fairQuality" as any)}</p>
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
                                <p className="text-xs text-muted-foreground">{t("waterChangesToday" as any)}</p>
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
                        <Button onClick={onAdd} className="rounded-xl">
                            <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                            {t("scheduleWaterChange" as any)}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {schedule.map((scheduleItem) => (
                            <div
                                key={scheduleItem.id}
                                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-muted/50 gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={cn(
                                            "flex h-12 w-12 items-center justify-center rounded-xl",
                                            scheduleItem.quality === "good"
                                                ? "bg-green-500/10"
                                                : scheduleItem.quality === "fair"
                                                    ? "bg-amber-500/10"
                                                    : "bg-red-500/10",
                                        )}
                                    >
                                        <Droplets
                                            className={cn(
                                                "h-6 w-6",
                                                scheduleItem.quality === "good"
                                                    ? "text-green-500"
                                                    : scheduleItem.quality === "fair"
                                                        ? "text-amber-500"
                                                        : "text-red-500",
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">
                                            {language === "ar" ? scheduleItem.loftAr : scheduleItem.loft}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {t("waterAdditive" as any)}:{" "}
                                            {language === "ar" ? scheduleItem.additiveAr : scheduleItem.additive}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                    <div className="text-sm">
                                        <p className="text-muted-foreground">{t("lastWaterChange" as any)}</p>
                                        <p className="font-medium">{scheduleItem.lastChange}</p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-muted-foreground">{t("nextWaterChange" as any)}</p>
                                        <p className="font-medium">{scheduleItem.nextChange}</p>
                                    </div>
                                    <Badge
                                        variant={
                                            scheduleItem.quality === "good"
                                                ? "default"
                                                : scheduleItem.quality === "fair"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                        className="rounded-full"
                                    >
                                        {getQualityLabel(scheduleItem.quality)}
                                    </Badge>
                                    <Button className="rounded-xl" size="sm" onClick={() => onRefresh(scheduleItem.id)}>
                                        <Droplets className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
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
}
