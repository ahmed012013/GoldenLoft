"use client";

import { useLanguage } from "@/lib/language-context";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Plus } from "lucide-react";
import { useState } from "react";

interface IncomeDialogProps {
    onSave: (entry: any) => void;
}

export function IncomeDialog({ onSave }: IncomeDialogProps) {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const [newEntry, setNewEntry] = useState({
        type: "race",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
    });

    const handleSave = () => {
        onSave(newEntry);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t("addNew" as any)}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("addIncomeEntry" as any)}</DialogTitle>
                    <DialogDescription>
                        {t("enterIncomeDetails" as any)}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>{t("type" as any)}</Label>
                        <Select
                            value={newEntry.type}
                            onValueChange={(value) =>
                                setNewEntry({ ...newEntry, type: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="race">
                                    {t("raceWinnings" as any)}
                                </SelectItem>
                                <SelectItem value="sale">
                                    {t("pigeonSale" as any)}
                                </SelectItem>
                                <SelectItem value="other">
                                    {t("other" as any)}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>{t("amount" as any)}</Label>
                        <Input
                            type="number"
                            value={newEntry.amount}
                            onChange={(e) =>
                                setNewEntry({ ...newEntry, amount: e.target.value })
                            }
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <Label>{t("description" as any)}</Label>
                        <Input
                            value={newEntry.description}
                            onChange={(e) =>
                                setNewEntry({
                                    ...newEntry,
                                    description: e.target.value,
                                })
                            }
                            placeholder={t("enterDescription" as any)}
                        />
                    </div>
                    <div>
                        <Label>{t("date" as any)}</Label>
                        <Input
                            type="date"
                            value={newEntry.date}
                            onChange={(e) =>
                                setNewEntry({ ...newEntry, date: e.target.value })
                            }
                        />
                    </div>
                    <Button className="w-full" onClick={handleSave}>{t("save" as any)}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
