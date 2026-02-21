import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BackendPairing } from "./types";

interface PairingFormProps {
  editingPairing: BackendPairing | null;
  birds: any[];
  activeBirdIds: Set<string>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function PairingForm({
  editingPairing,
  birds,
  activeBirdIds,
  onSubmit,
  onCancel,
  isSubmitting,
}: PairingFormProps) {
  const { t } = useLanguage();

  const [formMaleId, setFormMaleId] = useState("");
  const [formFemaleId, setFormFemaleId] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formNestBox, setFormNestBox] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const isBirdAvailable = (bird: any) => {
    if (editingPairing) {
      if (bird.id === editingPairing.maleId || bird.id === editingPairing.femaleId) {
        return true;
      }
    }
    return !activeBirdIds.has(bird.id);
  };

  const maleBirds = birds.filter((b: any) => b.gender === "male" && isBirdAvailable(b));
  const femaleBirds = birds.filter((b: any) => b.gender === "female" && isBirdAvailable(b));

  useEffect(() => {
    if (editingPairing) {
      setFormMaleId(editingPairing.maleId);
      setFormFemaleId(editingPairing.femaleId);
      setFormStartDate(editingPairing.startDate.split("T")[0]);
      setFormNestBox(editingPairing.nestBox || "");
      setFormNotes(editingPairing.notes || "");
    }
  }, [editingPairing]);

  const handleSubmit = async () => {
    await onSubmit({
      maleId: formMaleId,
      femaleId: formFemaleId,
      startDate: formStartDate,
      nestBox: formNestBox,
      notes: formNotes,
    });
  };

  return (
    <div className="pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("malePigeon")}</Label>
          <Select
            value={formMaleId}
            onValueChange={setFormMaleId}
            disabled={!!editingPairing}
          >
            <SelectTrigger className="rounded-2xl">
              <SelectValue placeholder={t("selectMale")} />
            </SelectTrigger>
            <SelectContent>
              {maleBirds.map((bird: any) => (
                <SelectItem key={bird.id} value={bird.id}>
                  {bird.name} ({bird.ringNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("femalePigeon")}</Label>
          <Select
            value={formFemaleId}
            onValueChange={setFormFemaleId}
            disabled={!!editingPairing}
          >
            <SelectTrigger className="rounded-2xl">
              <SelectValue placeholder={t("selectFemale")} />
            </SelectTrigger>
            <SelectContent>
              {femaleBirds.map((bird: any) => (
                <SelectItem key={bird.id} value={bird.id}>
                  {bird.name} ({bird.ringNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("pairingDate")}</Label>
          <Input
            type="date"
            value={formStartDate}
            onChange={(e) => setFormStartDate(e.target.value)}
            disabled={!!editingPairing}
            className="rounded-2xl"
          />
        </div>
        <div className="space-y-2">
          <Label>{t("nestBox")}</Label>
          <Input
            value={formNestBox}
            onChange={(e) => setFormNestBox(e.target.value)}
            placeholder={t("nestBox") || "رقم العش"}
            className="rounded-2xl"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>{t("breedingNotes")}</Label>
          <Textarea
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            placeholder={t("breedingNotes") || "ملاحظات"}
            rows={2}
            className="rounded-2xl"
          />
        </div>
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
          {editingPairing ? t("savePairing") : t("addPairing")}
        </Button>
      </div>
    </div>
  );
}
