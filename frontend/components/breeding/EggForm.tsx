import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { calculateAge } from "@/lib/utils";
import { BackendEgg, BackendPairing } from "./types";

interface EggFormProps {
  editingEgg: BackendEgg | null;
  activePairings: BackendPairing[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function EggForm({
  editingEgg,
  activePairings,
  onSubmit,
  onCancel,
  isSubmitting,
}: EggFormProps) {
  const { t, language } = useLanguage();

  const [formPairingId, setFormPairingId] = useState("");
  const [formLayDate, setFormLayDate] = useState("");
  const [formCandlingDate, setFormCandlingDate] = useState("");
  const [formCandlingResult, setFormCandlingResult] = useState("");
  const [formStatus, setFormStatus] = useState("LAID");
  const [formHatchDate, setFormHatchDate] = useState("");
  const [expectedHatchDate, setExpectedHatchDate] = useState("");

  useEffect(() => {
    if (editingEgg) {
      setFormPairingId(editingEgg.pairingId);
      setFormLayDate(editingEgg.layDate.split("T")[0]);
      setFormCandlingDate(
        editingEgg.candlingDate ? editingEgg.candlingDate.split("T")[0] : "",
      );
      setFormCandlingResult(editingEgg.candlingResult || "");
      setFormStatus(editingEgg.status);
      setFormHatchDate(
        editingEgg.hatchDateActual ? editingEgg.hatchDateActual.split("T")[0] : "",
      );
    } else {
      setFormStatus("LAID");
      setFormHatchDate("");
      setFormLayDate(new Date().toISOString().split("T")[0]);
    }
  }, [editingEgg]);

  useEffect(() => {
    if (formLayDate) {
      const layDate = new Date(formLayDate);
      const expected = new Date(layDate);
      expected.setDate(layDate.getDate() + 18);
      const formatted = expected.toISOString().split("T")[0];
      setExpectedHatchDate(formatted);
      if (!editingEgg && formStatus === "HATCHED" && !formHatchDate) {
        setFormHatchDate(formatted);
      }
    }
  }, [formLayDate, formStatus, editingEgg, formHatchDate]);

  const handleSubmit = async () => {
    await onSubmit({
      pairingId: formPairingId,
      layDate: formLayDate,
      candlingDate: formCandlingDate || undefined,
      candlingResult: formCandlingResult || undefined,
      status: formStatus,
      hatchDate: formStatus === "HATCHED" ? formHatchDate : undefined,
    });
  };

  return (
    <Card className="rounded-3xl">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {editingEgg ? t("editEgg") : t("addEgg")}
          </h3>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t("selectPairing")}</Label>
            <Select
              value={formPairingId}
              onValueChange={setFormPairingId}
              disabled={!!editingEgg}
            >
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder={t("selectPairing")} />
              </SelectTrigger>
              <SelectContent>
                {activePairings.map((p) => {
                  const maleLabel = p.male?.name
                    ? `${p.male.name} (${p.male.ringNumber})`
                    : p.male?.ringNumber || "Unknown";
                  const femaleLabel = p.female?.name
                    ? `${p.female.name} (${p.female.ringNumber})`
                    : p.female?.ringNumber || "Unknown";

                  return (
                    <SelectItem key={p.id} value={p.id}>
                      {maleLabel} × {femaleLabel}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("layingDate")}</Label>
            <Input
              type="date"
              value={formLayDate}
              onChange={(e) => setFormLayDate(e.target.value)}
              disabled={!!editingEgg}
              className="rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("candlingDate")}</Label>
            <Input
              type="date"
              value={formCandlingDate}
              onChange={(e) => setFormCandlingDate(e.target.value)}
              className="rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("candlingResult")}</Label>
            <Select
              value={formCandlingResult}
              onValueChange={setFormCandlingResult}
            >
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder={t("selectResult")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fertile">{t("fertile")}</SelectItem>
                <SelectItem value="infertile">{t("infertile")}</SelectItem>
                <SelectItem value="unclear">{t("unclear")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("eggStatus")}</Label>
            <Select value={formStatus} onValueChange={setFormStatus}>
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder={t("eggStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LAID">{t("eggLaid")}</SelectItem>
                <SelectItem value="HATCHED">{t("hatched")}</SelectItem>
                <SelectItem value="INFERTILE">{t("infertile")}</SelectItem>
                <SelectItem value="BROKEN">{t("broken")}</SelectItem>
                <SelectItem value="DEAD_IN_SHELL">{t("eggDeadInShell")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formStatus === "HATCHED" && (
            <div className="space-y-2">
              <Label>{t("hatchDateLabel")}</Label>
              <Input
                type="date"
                value={formHatchDate}
                onChange={(e) => setFormHatchDate(e.target.value)}
                className="rounded-2xl"
              />
              {expectedHatchDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t("hatchDefaultNote")}: {expectedHatchDate}
                </p>
              )}
              {formHatchDate && (
                <p className="mt-1 text-sm text-primary/80 font-medium">
                  {language === "ar" ? "العمر: " : "Age: "}
                  {calculateAge(formHatchDate, t, language)}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCancel} className="rounded-2xl">
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-2xl"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {editingEgg ? t("saveEgg") : t("addEgg")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
