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
import { CreateFeedingPlanData } from "@/hooks/useNutrition";

interface FeedingPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateFeedingPlanData) => void;
}

export function FeedingPlanDialog({
  open,
  onOpenChange,
  onSave,
}: FeedingPlanDialogProps) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [targetGroup, setTargetGroup] = useState("");
  const [feedType, setFeedType] = useState("");
  const [morningAmount, setMorningAmount] = useState("");
  const [eveningAmount, setEveningAmount] = useState("");

  const resetForm = () => {
    setName("");
    setNameAr("");
    setTargetGroup("");
    setFeedType("");
    setMorningAmount("");
    setEveningAmount("");
  };

  const handleSave = () => {
    if (!name || !targetGroup || !feedType || !morningAmount || !eveningAmount)
      return;
    onSave({
      name,
      nameAr: nameAr || undefined,
      targetGroup,
      feedType,
      morningAmount,
      eveningAmount,
    });
    resetForm();
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
          <DialogTitle>{t("addFeedingPlan")}</DialogTitle>
          <DialogDescription>{t("planDescription")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("planName")} (EN)</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Racing Season Plan"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("planName")} (AR)</Label>
              <Input
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="خطة موسم السباق"
                className="rounded-xl"
                dir="rtl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("targetGroup")}</Label>
            <Select value={targetGroup} onValueChange={setTargetGroup}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("allPigeonsGroup")}
                </SelectItem>
                <SelectItem value="racing">
                  {t("racingPigeonsGroup")}
                </SelectItem>
                <SelectItem value="breeding">
                  {t("breedingPigeonsGroup")}
                </SelectItem>
                <SelectItem value="young">
                  {t("youngPigeonsGroup")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("morningFeed")}</Label>
              <Input
                value={morningAmount}
                onChange={(e) => setMorningAmount(e.target.value)}
                placeholder="30g"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("eveningFeed")}</Label>
              <Input
                value={eveningAmount}
                onChange={(e) => setEveningAmount(e.target.value)}
                placeholder="25g"
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("feedType")}</Label>
            <Select value={feedType} onValueChange={setFeedType}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seed">
                  {t("feedTypeSeed")}
                </SelectItem>
                <SelectItem value="grain">
                  {t("feedTypeGrain")}
                </SelectItem>
                <SelectItem value="pellet">
                  {t("feedTypePellet")}
                </SelectItem>
                <SelectItem value="mix">{t("feedTypeMix")}</SelectItem>
              </SelectContent>
            </Select>
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
          <Button onClick={handleSave} className="rounded-xl">
            {t("saveFeedingPlan")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
