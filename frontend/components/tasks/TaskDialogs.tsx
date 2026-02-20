
import {
    Dialog,
    DialogContent,
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
import { useLanguage } from "@/lib/language-context";

interface TaskDialogsProps {
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: (open: boolean) => void;
    taskToEdit: any;
    handleCreateTask: (e: React.FormEvent) => Promise<void>;
    lofts: any[] | undefined;
}

export function TaskDialogs({
    isAddDialogOpen,
    setIsAddDialogOpen,
    taskToEdit,
    handleCreateTask,
    lofts,
}: TaskDialogsProps) {
    const { t } = useLanguage();

    return (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-lg rounded-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {taskToEdit ? t("editTask" as any) : t("addNewTask" as any)}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateTask} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label>{t("taskName" as any)}</Label>
                        <Input
                            name="name"
                            required
                            defaultValue={taskToEdit?.title}
                            placeholder={t("taskNamePlaceholder" as any)}
                            className="rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>{t("taskDescription" as any)}</Label>
                        <Textarea
                            name="description"
                            defaultValue={taskToEdit?.description}
                            placeholder={t("taskDescriptionPlaceholder" as any)}
                            className="rounded-xl"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t("taskTime" as any)}</Label>
                            <Input
                                name="time"
                                type="time"
                                defaultValue={taskToEdit?.time}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("taskCategory" as any)}</Label>
                            <Select name="category" defaultValue={taskToEdit?.category || "feeding"}>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder={t("selectCategory" as any)} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="feeding">{t("categoryFeeding" as any)}</SelectItem>
                                    <SelectItem value="cleaning">{t("categoryCleaning" as any)}</SelectItem>
                                    <SelectItem value="health">{t("categoryHealth" as any)}</SelectItem>
                                    <SelectItem value="training">{t("categoryTraining" as any)}</SelectItem>
                                    <SelectItem value="medication">{t("categoryMedication" as any)}</SelectItem>
                                    <SelectItem value="water">{t("categoryWater" as any)}</SelectItem>
                                    <SelectItem value="maintenance">{t("categoryMaintenance" as any)}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t("taskPriority" as any)}</Label>
                            <Select name="priority" defaultValue={taskToEdit?.priority || "medium"}>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder={t("selectPriority" as any)} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high">{t("priorityHigh" as any)}</SelectItem>
                                    <SelectItem value="medium">{t("priorityMedium" as any)}</SelectItem>
                                    <SelectItem value="low">{t("priorityLow" as any)}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>{t("assignedLoft" as any)}</Label>
                            <Select name="loft" defaultValue={taskToEdit?.loft?.id || "all"}>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder={t("selectLoft" as any)} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("allLoftsAssign" as any)}</SelectItem>
                                    {lofts?.map((loft: any) => (
                                        <SelectItem key={loft.id} value={loft.id}>
                                            {loft.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>{t("repeatTask" as any)}</Label>
                        <Select name="repeat" defaultValue={taskToEdit?.frequency || "NONE"}>
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder={t("repeatNone" as any)} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NONE">{t("repeatNone" as any)}</SelectItem>
                                <SelectItem value="DAILY">{t("repeatDaily" as any)}</SelectItem>
                                <SelectItem value="WEEKLY">{t("repeatWeekly" as any)}</SelectItem>
                                <SelectItem value="MONTHLY">{t("repeatMonthly" as any)}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t("startDate" as any)}</Label>
                            <Input
                                name="startDate"
                                type="date"
                                className="rounded-xl"
                                defaultValue={
                                    taskToEdit?.startDate
                                        ? new Date(taskToEdit.startDate).toISOString().split("T")[0]
                                        : new Date().toISOString().split("T")[0]
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("endDate" as any)}</Label>
                            <Input
                                name="endDate"
                                type="date"
                                className="rounded-xl"
                                defaultValue={
                                    taskToEdit?.endDate
                                        ? new Date(taskToEdit.endDate).toISOString().split("T")[0]
                                        : ""
                                }
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1 rounded-2xl">
                            {t("saveTask" as any)}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-2xl bg-transparent"
                            onClick={() => setIsAddDialogOpen(false)}
                        >
                            {t("cancel" as any)}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
