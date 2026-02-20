import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PigeonCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-3xl border-muted/40">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Image Placeholder */}
          <Skeleton className="h-20 w-20 shrink-0 rounded-2xl" />

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 w-full">
                {/* Name */}
                <Skeleton className="h-5 w-32" />
                {/* Ring Number */}
                <Skeleton className="h-4 w-24" />
              </div>
              {/* Status Badge */}
              <Skeleton className="h-6 w-16 rounded-xl" />
            </div>

            {/* Details Lines */}
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="pt-1">
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t bg-muted/10 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
