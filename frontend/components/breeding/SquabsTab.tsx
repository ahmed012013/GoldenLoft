import { useBirds } from "@/hooks/useBirds";
import { PigeonCardSkeleton } from "@/components/ui/pigeon-card-skeleton";
import { SquabStats } from "./SquabStats";
import { SquabList } from "./SquabList";
import { BreedingStatsSkeleton } from "./BreedingStatsSkeleton";

export function SquabsTab() {
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
      <SquabList squabs={squabs} />
    </div>
  );
}
