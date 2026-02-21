"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { CreateWaterScheduleData } from "@/hooks/useNutrition";

interface WaterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: CreateWaterScheduleData) => Promise<void>;
}

export function WaterDialog({
    open,
    onOpenChange,
    onSave,
}: WaterDialogProps) {
    const { t } = useLanguage();
    const [loft, setLoft] = useState("");
    const [loftAr, setLoftAr] = useState("");
    const [quality, setQuality] = useState("good");
    const [additive, setAdditive] = useState("");
    const [additiveAr, setAdditiveAr] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const resetForm = () => {
        setLoft("");
        setLoftAr("");
        setQuality("good");
        setAdditive("");
        setAdditiveAr("");
    };

    const handleSave = async () => {
        if (!loft) return;

        setIsSaving(true);
        try {
            const now = new Date();
            const next = new Date(now.getTime() + 10 * 60 * 60 * 1000); // Default 10 hours later

            await onSave({
                loft,
                loftAr: loftAr || undefined,
                lastChange: now.toISOString(),
                nextChange: next.toISOString(),
                quality,
                additive: additive || undefined,
                additiveAr: additiveAr || undefined,
            });
            resetForm();
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                if (!v) resetForm();
                onOpenChange(v);
            }}
        >
            <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle>{t("scheduleWaterChange")}</DialogTitle>
                    <DialogDescription>{t("waterDescription") || "Manage water schedules for your lofts."}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t("loftName")} (EN)</Label>
                            <Input
                                value={loft}
                                onChange={(e) => setLoft(e.target.value)}
                                placeholder="Main Breeding Loft"
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("loftName")} (AR)</Label>
                            <Input
                                value={loftAr}
                                onChange={(e) => setLoftAr(e.target.value)}
                                placeholder="لوفت الإنتاج الرئيسي"
                                className="rounded-xl"
                                dir="rtl"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>{t("waterQuality") || "Water Quality"}</Label>
                        <Select value={quality} onValueChange={setQuality}>
                            <SelectTrigger className="rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="good">{t("goodQuality")}</SelectItem>
                                <SelectItem value="fair">{t("fairQuality")}</SelectItem>
                                <SelectItem value="poor">{t("poorQuality")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t("waterAdditive")} (EN)</Label>
                            <Input
                                value={additive}
                                onChange={(e) => setAdditive(e.target.value)}
                                placeholder="Apple Cider Vinegar"
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("waterAdditive")} (AR)</Label>
                            <Input
                                value={additiveAr}
                                onChange={(e) => setAdditiveAr(e.target.value)}
                                placeholder="خل التفاح"
                                className="rounded-xl"
                                dir="rtl"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            resetForm();
                            onOpenChange(false);
                        }}
                        className="rounded-xl bg-transparent"
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="rounded-xl"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {t("save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
