import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BreedingStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i} className="rounded-3xl">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-2">
                            <Skeleton className="h-8 w-12" /> {/* Stat value */}
                            <Skeleton className="h-4 w-24" /> {/* Stat label */}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
