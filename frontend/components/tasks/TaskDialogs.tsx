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
import { Task } from "@/hooks/use-tasks";
import { Loft } from "@/hooks/useLofts";
import { useState, useEffect } from "react";

interface TaskDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  taskToEdit: Task | null;
  handleCreateTask: (e: React.FormEvent) => Promise<void>;
  lofts: Loft[] | undefined;
}

export function TaskDialogs({
  isAddDialogOpen,
  setIsAddDialogOpen,
  taskToEdit,
  handleCreateTask,
  lofts,
}: TaskDialogsProps) {
  const { t } = useLanguage();
  const [category, setCategory] = useState(taskToEdit?.category || "feeding");
  const [priority, setPriority] = useState(taskToEdit?.priority || "medium");
  const [loftId, setLoftId] = useState(taskToEdit?.loft?.id || "all");
  const [frequency, setFrequency] = useState(taskToEdit?.frequency || "NONE");

  useEffect(() => {
    setCategory(taskToEdit?.category || "feeding");
    setPriority(taskToEdit?.priority || "medium");
    setLoftId(taskToEdit?.loft?.id || "all");
    setFrequency(taskToEdit?.frequency || "NONE");
  }, [taskToEdit]);

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="max-w-lg rounded-3xl">
        <DialogHeader>
          <DialogTitle>
            {taskToEdit ? t("editTask") : t("addNewTask")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateTask} className="space-y-4 mt-4">
          {/* Hidden inputs for Select components */}
          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="priority" value={priority} />
          <input type="hidden" name="loft" value={loftId} />
          <input type="hidden" name="repeat" value={frequency} />
          
          <div className="space-y-2">
            <Label>{t("taskName")}</Label>
            <Input
              name="name"
              required
              defaultValue={taskToEdit?.title}
              placeholder={t("taskNamePlaceholder")}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("taskDescription")}</Label>
            <Textarea
              name="description"
              defaultValue={taskToEdit?.description}
              placeholder={t("taskDescriptionPlaceholder")}
              className="rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("taskTime")}</Label>
              <Input
                name="time"
                type="time"
                defaultValue={taskToEdit?.time}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("taskCategory")}</Label>
              <Select
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feeding">
                    {t("categoryFeeding")}
                  </SelectItem>
                  <SelectItem value="cleaning">
                    {t("categoryCleaning")}
                  </SelectItem>
                  <SelectItem value="health">
                    {t("categoryHealth")}
                  </SelectItem>
                  <SelectItem value="training">
                    {t("categoryTraining")}
                  </SelectItem>
                  <SelectItem value="medication">
                    {t("categoryMedication")}
                  </SelectItem>
                  <SelectItem value="water">
                    {t("categoryWater")}
                  </SelectItem>
                  <SelectItem value="maintenance">
                    {t("categoryMaintenance")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("taskPriority")}</Label>
              <Select
                value={priority}
                onValueChange={setPriority}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder={t("selectPriority")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    {t("priorityHigh")}
                  </SelectItem>
                  <SelectItem value="medium">
                    {t("priorityMedium")}
                  </SelectItem>
                  <SelectItem value="low">{t("priorityLow")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("assignedLoft")}</Label>
              <Select value={loftId} onValueChange={setLoftId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder={t("selectLoft")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("allLoftsAssign")}
                  </SelectItem>
                  {lofts?.map((loft: Loft) => (
                    <SelectItem key={loft.id} value={loft.id}>
                      {loft.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("repeatTask")}</Label>
            <Select
              value={frequency}
              onValueChange={setFrequency}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("repeatNone")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">{t("repeatNone")}</SelectItem>
                <SelectItem value="DAILY">{t("repeatDaily")}</SelectItem>
                <SelectItem value="WEEKLY">
                  {t("repeatWeekly")}
                </SelectItem>
                <SelectItem value="MONTHLY">
                  {t("repeatMonthly")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("startDate")}</Label>
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
              <Label>{t("endDate")}</Label>
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
              {t("saveTask")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl bg-transparent"
              onClick={() => setIsAddDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
