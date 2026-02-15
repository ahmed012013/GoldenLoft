import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/language-context";

interface ViewLoftDialogProps {
  loft: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewLoftDialog({
  loft,
  open,
  onOpenChange,
}: ViewLoftDialogProps) {
  const { t, language } = useLanguage();

  if (!loft) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {t("loftDetails") ||
              (language === "ar" ? "تفاصيل اللوفت" : "Loft Details")}
          </DialogTitle>
          <DialogDescription>
            {t("viewLoftDetailsDesc") ||
              (language === "ar"
                ? "عرض التفاصيل الكاملة للوفت"
                : "View complete details of the loft")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">{t("loftName")}</Label>
              <p className="text-lg font-semibold">{loft.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                {t("loftLocation")}
              </Label>
              <p className="text-lg font-semibold">{loft.location || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                {t("capacity") || (language === "ar" ? "السعة" : "Capacity")}
              </Label>
              <p className="text-lg font-semibold">{loft.capacity || 50}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                {t("currentOccupancy")}
              </Label>
              <p className="text-lg font-semibold">{loft._count?.birds || 0}</p>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">
              {t("loftDescription")}
            </Label>
            <p className="mt-1 text-base">{loft.description || "-"}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="rounded-2xl">
            {t("close") || (language === "ar" ? "إغلاق" : "Close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
