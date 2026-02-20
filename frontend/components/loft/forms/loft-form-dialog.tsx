import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { useLoftMutations } from "@/hooks/useLoftMutations";

interface LoftFormDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  loft?: any; // If provided, it's edit mode
}

export function LoftFormDialog({
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  loft,
}: LoftFormDialogProps) {
  const { language, t, dir } = useLanguage();
  const [internalOpen, setInternalOpen] = useState(false);
  const { createLoft, updateLoft } = useLoftMutations();

  // Use controlled or uncontrolled state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    capacity: 50,
  });

  // Reset form when dialog opens or loft changes
  useEffect(() => {
    if (isOpen) {
      if (loft) {
        setFormData({
          name: loft.name || "",
          location: loft.location || "",
          description: loft.description || "",
          capacity: loft.capacity || 50,
        });
      } else {
        setFormData({
          name: "",
          location: "",
          description: "",
          capacity: 50,
        });
      }
    }
  }, [isOpen, loft]);

  const handleSave = () => {
    if (!formData.name) {
      toast.error(
        language === "ar" ? "اسم اللوفت مطلوب" : "Loft name is required",
      );
      return;
    }

    if (loft) {
      updateLoft.mutate(
        { id: loft.id, data: formData },
        {
          onSuccess: () => {
            setOpen(false);
          },
        },
      );
    } else {
      createLoft.mutate(formData, {
        onSuccess: () => {
          setOpen(false);
          setFormData({
            name: "",
            location: "",
            description: "",
            capacity: 50,
          });
        },
      });
    }
  };

  const isPending = createLoft.isPending || updateLoft.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="rounded-3xl sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{loft ? t("editLoft") : t("addLoftTitle")}</DialogTitle>
          <DialogDescription>
            {loft
              ? language === "ar"
                ? "تعديل بيانات اللوفت"
                : "Edit loft details"
              : language === "ar"
                ? "أضف لوفت جديد إلى نظامك"
                : "Add a new loft to your system"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("loftName")}</Label>
              <Input
                id="name"
                placeholder={t("loftNamePlaceholder")}
                className="rounded-2xl"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t("loftLocation")}</Label>
              <Input
                id="location"
                placeholder={t("loftLocationPlaceholder")}
                className="rounded-2xl"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("loftDescription")}</Label>
              <Textarea
                id="description"
                placeholder={t("loftDescriptionPlaceholder")}
                className="rounded-2xl min-h-[100px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">{t("capacity") || "Capacity"}</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="50"
                className="rounded-2xl"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-2xl bg-transparent"
            onClick={() => setOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            className="rounded-2xl"
            onClick={handleSave}
            disabled={isPending}
          >
            <Save className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
            {isPending
              ? language === "ar"
                ? "جاري الحفظ..."
                : "Saving..."
              : loft
                ? t("saveLoft")
                : t("saveLoft")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
