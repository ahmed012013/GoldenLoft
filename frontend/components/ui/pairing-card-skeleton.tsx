import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PairingCardSkeleton() {
  return (
    <Card className="rounded-3xl">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 w-full">
              <Skeleton className="h-6 w-24 rounded-2xl" /> {/* Badge */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
