import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStatsSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-32 mb-4" /> {/* Title */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border bg-card"
          >
            <Skeleton className="h-5 w-5 rounded-md" /> {/* Icon */}
            <div className="flex flex-col items-center gap-1 w-full">
              <Skeleton className="h-3 w-20" /> {/* Label */}
              <Skeleton className="h-5 w-12 rounded-full" /> {/* Count Badge */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
