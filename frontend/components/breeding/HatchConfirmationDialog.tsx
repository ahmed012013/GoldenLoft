import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/language-context";
import { BackendEgg } from "./types";
import { Loader2 } from "lucide-react";

interface HatchConfirmationDialogProps {
    egg: BackendEgg | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (hatchDate: string) => Promise<void>;
    isSubmitting: boolean;
}

export function HatchConfirmationDialog({
    egg,
    isOpen,
    onClose,
    onConfirm,
    isSubmitting,
}: HatchConfirmationDialogProps) {
    const { t } = useLanguage();
    const [hatchDate, setHatchDate] = useState("");

    useEffect(() => {
        if (egg && isOpen) {
            // Default to layDate + 18 days
            const layDate = new Date(egg.layDate);
            const defaultHatchDate = new Date(layDate);
            defaultHatchDate.setDate(layDate.getDate() + 18);

            // Format as YYYY-MM-DD for input type="date"
            setHatchDate(defaultHatchDate.toISOString().split("T")[0]);
        }
    }, [egg, isOpen]);

    const handleConfirm = async () => {
        await onConfirm(new Date(hatchDate).toISOString());
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-3xl sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("confirmHatch")}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="hatch-date">{t("hatchDateLabel")}</Label>
                        <Input
                            id="hatch-date"
                            type="date"
                            value={hatchDate}
                            onChange={(e) => setHatchDate(e.target.value)}
                            className="rounded-2xl"
                        />
                        <p className="text-xs text-muted-foreground">
                            {t("hatchDefaultNote")}
                        </p>
                    </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} className="rounded-2xl">
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isSubmitting || !hatchDate}
                        className="rounded-2xl"
                    >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        {t("hatchNow")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
