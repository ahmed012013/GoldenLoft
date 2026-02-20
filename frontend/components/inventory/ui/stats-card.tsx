import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColorClass: string;
  iconBgClass: string;
  valueColorClass?: string;
  subValue?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColorClass,
  iconBgClass,
  valueColorClass,
  subValue,
}: StatsCardProps) {
  return (
    <Card className="rounded-3xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={cn("text-3xl font-bold", valueColorClass)}>{value}</p>
            {subValue && (
              <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl",
              iconBgClass,
            )}
          >
            <Icon className={cn("h-6 w-6", iconColorClass)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
