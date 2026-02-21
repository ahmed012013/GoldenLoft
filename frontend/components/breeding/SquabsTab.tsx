import { useBirds } from "@/hooks/useBirds";
import { PigeonCardSkeleton } from "@/components/ui/pigeon-card-skeleton";
import { SquabStats } from "./SquabStats";
import { SquabList } from "./SquabList";
import { BreedingStatsSkeleton } from "./BreedingStatsSkeleton";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function SquabsTab() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: birdsData, isLoading } = useBirds({
    status: "squab",
    limit: 200,
  });

  const squabs = birdsData?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BreedingStatsSkeleton />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(4)].map((_, i) => (
            <PigeonCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SquabStats squabs={squabs} />

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchByParentRing")}
          className="pl-10 rounded-2xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <SquabList squabs={squabs.filter((squab) => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
          squab.father?.ringNumber?.toLowerCase().includes(search) ||
          squab.mother?.ringNumber?.toLowerCase().includes(search) ||
          squab.father?.name?.toLowerCase().includes(search) ||
          squab.mother?.name?.toLowerCase().includes(search)
        );
      })} />
    </div>
  );
}
