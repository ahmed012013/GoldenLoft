import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

interface TaskFiltersProps {
  filterCategory: string;
  setFilterCategory: (value: string) => void;
}

export function TaskFilters({
  filterCategory,
  setFilterCategory,
}: TaskFiltersProps) {
  const { t } = useLanguage();

  return (
    <CardHeader>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CardTitle>{t("todayTasksTitle" as any)}</CardTitle>
        <div className="flex gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[140px] rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories" as any)}</SelectItem>
              <SelectItem value="feeding">
                {t("categoryFeeding" as any)}
              </SelectItem>
              <SelectItem value="cleaning">
                {t("categoryCleaning" as any)}
              </SelectItem>
              <SelectItem value="health">
                {t("categoryHealth" as any)}
              </SelectItem>
              <SelectItem value="training">
                {t("categoryTraining" as any)}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardHeader>
  );
}
