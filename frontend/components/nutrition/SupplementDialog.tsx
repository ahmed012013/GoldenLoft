"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SupplementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function SupplementDialog({
  open,
  onOpenChange,
  onSave,
}: SupplementDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  <SelectItem value="weekly">{t("weekly" as any)}</SelectItem>
                  <SelectItem value="monthly">{t("monthly" as any)}</SelectItem>
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
            onClick={() => onOpenChange(false)}
            className="rounded-xl bg-transparent"
          >
            {t("cancel" as any)}
          </Button>
          <Button onClick={onSave} className="rounded-xl">
            {t("saveSupplement" as any)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
