"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useLanguage } from "@/lib/language-context";
import {
  Stethoscope,
  Syringe,
  Activity,
  Pill,
  AlertTriangle,
  Calendar,
  User,
  FileText,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ViewHealthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: any;
}

export function ViewHealthRecordDialog({
  open,
  onOpenChange,
  record,
}: ViewHealthRecordDialogProps) {
  const { language, dir } = useLanguage();

  if (!record) return null;

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string; icon: any }> = {
      checkup: { ar: "فحص", en: "Checkup", icon: Stethoscope },
      vaccination: { ar: "تطعيم", en: "Vaccination", icon: Syringe },
      treatment: { ar: "علاج", en: "Treatment", icon: Pill },
      illness: { ar: "مرض", en: "Illness", icon: Activity },
      injury: { ar: "إصابة", en: "Injury", icon: AlertTriangle },
    };
    return labels[type] || { ar: type, en: type, icon: Activity };
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "recovered":
        return "bg-green-100 text-green-700";
      case "sick":
      case "critical":
        return "bg-red-100 text-red-700";
      case "under_observation":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const typeInfo = getTypeLabel(record.type);
  const TypeIcon = typeInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl" dir={dir}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <TypeIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {language === "ar"
                  ? "تفاصيل السجل الصحي"
                  : "Health Record Details"}
              </DialogTitle>
              <DialogDescription>
                {format(new Date(record.date), "PPP")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Status & Type Row */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                {language === "ar" ? "النوع" : "Type"}
              </span>
              <span className="font-medium flex items-center gap-1">
                {language === "ar" ? typeInfo.ar : typeInfo.en}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-border mx-2" />
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                {language === "ar" ? "الحالة" : "Status"}
              </span>
              <Badge
                variant="outline"
                className={`${getStatusColor(record.status)} rounded-2xl`}
              >
                {record.status.replace("_", " ")}
              </Badge>
            </div>
          </div>

          {/* Vet Name */}
          {record.vetName && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  {language === "ar" ? "الطبيب المعالج" : "Veterinarian"}
                </span>
              </div>
              <p className="text-sm font-medium pr-6 rtl:pr-6 rtl:pl-0 ltr:pl-6">
                {record.vetName}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{language === "ar" ? "الوصف" : "Description"}</span>
            </div>
            <div className="rounded-md bg-muted p-3 text-sm">
              {record.description}
            </div>
          </div>

          {/* Notes */}
          {record.notes && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>
                  {language === "ar" ? "ملاحظات إضافية" : "Additional Notes"}
                </span>
              </div>
              <div className="rounded-md border p-3 text-sm text-muted-foreground">
                {record.notes}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
