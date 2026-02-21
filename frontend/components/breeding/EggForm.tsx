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
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { calculateAge } from "@/lib/utils";
import { BackendEgg, BackendPairing } from "./types";
import { EggStatus } from "@/lib/breeding-api";

interface EggFormProps {
  editingEgg: BackendEgg | null;
  activePairings: BackendPairing[];
  onSubmit: (data: {
    pairingId: string;
    layDate: string;
    candlingDate?: string;
    candlingResult?: string;
    status: EggStatus;
    hatchDate?: string;
  }) => Promise<void>;
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
  const [formStatus, setFormStatus] = useState<EggStatus>(EggStatus.LAID);
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
      setFormStatus(EggStatus.LAID);
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
      if (!editingEgg && formStatus === EggStatus.HATCHED && !formHatchDate) {
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
      hatchDate: formStatus === EggStatus.HATCHED ? formHatchDate : undefined,
    });
  };

  return (
    <div className="pt-2">
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

                const nestLabel = p.nestBox ? ` [${t("nestBox")}: ${p.nestBox}]` : "";
                return (
                  <SelectItem key={p.id} value={p.id}>
                    {maleLabel} × {femaleLabel}{nestLabel}
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
          <Select value={formStatus} onValueChange={(v) => setFormStatus(v as EggStatus)}>
            <SelectTrigger className="rounded-2xl">
              <SelectValue placeholder={t("eggStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EggStatus.LAID}>{t("eggLaid")}</SelectItem>
              <SelectItem value={EggStatus.HATCHED}>{t("hatched")}</SelectItem>
              <SelectItem value={EggStatus.INFERTILE}>{t("infertile")}</SelectItem>
              <SelectItem value={EggStatus.BROKEN}>{t("broken")}</SelectItem>
              <SelectItem value={EggStatus.DEAD_IN_SHELL}>{t("eggDeadInShell")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formStatus === EggStatus.HATCHED && (
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
      <div className="flex justify-end gap-2 mt-6">
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
    </div>
  );
}
