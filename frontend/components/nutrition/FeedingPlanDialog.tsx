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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeedingPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void; // Simple save for now
}

export function FeedingPlanDialog({
  open,
  onOpenChange,
  onSave,
}: FeedingPlanDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t("addFeedingPlan" as any)}</DialogTitle>
          <DialogDescription>{t("planDescription" as any)}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("planName" as any)}</Label>
            <Input placeholder={t("planName" as any)} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>{t("targetGroup" as any)}</Label>
            <Select>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("selectCategory" as any)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("allPigeonsGroup" as any)}
                </SelectItem>
                <SelectItem value="racing">
                  {t("racingPigeonsGroup" as any)}
                </SelectItem>
                <SelectItem value="breeding">
                  {t("breedingPigeonsGroup" as any)}
                </SelectItem>
                <SelectItem value="young">
                  {t("youngPigeonsGroup" as any)}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("morningFeed" as any)}</Label>
              <Input placeholder="30g" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>{t("eveningFeed" as any)}</Label>
              <Input placeholder="25g" className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("feedType" as any)}</Label>
            <Select>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("selectCategory" as any)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seed">{t("feedTypeSeed" as any)}</SelectItem>
                <SelectItem value="grain">
                  {t("feedTypeGrain" as any)}
                </SelectItem>
                <SelectItem value="pellet">
                  {t("feedTypePellet" as any)}
                </SelectItem>
                <SelectItem value="mix">{t("feedTypeMix" as any)}</SelectItem>
              </SelectContent>
            </Select>
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
            {t("saveFeedingPlan" as any)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
