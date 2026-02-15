import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { BirdGender, BirdStatus } from "@shared/enums/bird.enums";

interface BirdFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  genderFilter: string;
  setGenderFilter: (value: string) => void;
}

export function BirdFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  genderFilter,
  setGenderFilter,
}: BirdFiltersProps) {
  const { t, dir } = useLanguage();

  return (
    <Card className="rounded-3xl">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute top-3 h-4 w-4 text-muted-foreground",
                dir === "rtl" ? "right-3" : "left-3",
              )}
            />
            <Input
              placeholder={t("searchPigeons")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn("rounded-2xl", dir === "rtl" ? "pr-9" : "pl-9")}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px] rounded-2xl">
              <SelectValue placeholder={t("filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses")}</SelectItem>
              <SelectItem value={BirdStatus.HEALTHY}>{t("healthy")}</SelectItem>
              <SelectItem value={BirdStatus.SICK}>{t("sick")}</SelectItem>
              <SelectItem value={BirdStatus.UNDER_OBSERVATION}>
                {t("observation")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-full md:w-[180px] rounded-2xl">
              <SelectValue placeholder={t("filterByGender")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allGenders")}</SelectItem>
              <SelectItem value={BirdGender.MALE}>{t("male")}</SelectItem>
              <SelectItem value={BirdGender.FEMALE}>{t("female")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
