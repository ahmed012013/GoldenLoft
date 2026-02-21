"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateSupplementData } from "@/hooks/useNutrition";

interface SupplementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateSupplementData) => Promise<void>;
}

export function SupplementDialog({
  open,
  onOpenChange,
  onSave,
}: SupplementDialogProps) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [type, setType] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [purpose, setPurpose] = useState("");
  const [purposeAr, setPurposeAr] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setName("");
    setNameAr("");
    setType("");
    setDosage("");
    setFrequency("");
    setPurpose("");
    setPurposeAr("");
  };

  const handleSave = async () => {
    if (!name || !type || !dosage || !frequency) return;

    setIsSaving(true);
    try {
      await onSave({
        name,
        nameAr: nameAr || undefined,
        type,
        dosage,
        frequency,
        purpose: purpose || undefined,
        purposeAr: purposeAr || undefined,
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
          <DialogTitle>{t("addSupplement")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("supplementName")} (EN)</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vitamin B Complex"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("supplementName")} (AR)</Label>
              <Input
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="فيتامين ب المركب"
                className="rounded-xl"
                dir="rtl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("supplementType")}</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vitamin">
                  {t("vitaminSupplement")}
                </SelectItem>
                <SelectItem value="mineral">
                  {t("mineralSupplement")}
                </SelectItem>
                <SelectItem value="probiotic">
                  {t("probioticSupplement")}
                </SelectItem>
                <SelectItem value="electrolyte">
                  {t("electrolytesSupplement")}
                </SelectItem>
                <SelectItem value="amino">
                  {t("aminoAcidSupplement")}
                </SelectItem>
                <SelectItem value="energy">
                  {t("energySupplement")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("supplementDosage")}</Label>
              <Input
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="5ml/L"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("supplementFrequency")}</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t("daily")}</SelectItem>
                  <SelectItem value="weekly">{t("weekly")}</SelectItem>
                  <SelectItem value="twice_weekly">
                    {t("twiceWeekly") || "Twice Weekly"}
                  </SelectItem>
                  <SelectItem value="monthly">
                    {t("monthly")}
                  </SelectItem>
                  <SelectItem value="after_race">
                    {t("afterRace") || "After Race"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("supplementPurpose")} (EN)</Label>
              <Textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Energy & metabolism"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("supplementPurpose")} (AR)</Label>
              <Textarea
                value={purposeAr}
                onChange={(e) => setPurposeAr(e.target.value)}
                placeholder="الطاقة والتمثيل الغذائي"
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
            {t("saveSupplement")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
