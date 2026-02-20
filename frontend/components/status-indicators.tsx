"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { type LucideIcon } from "lucide-react";

interface StatusIndicatorProps {
  icon: LucideIcon;
  label: string;
  count: number;
  color: "blue" | "green" | "red" | "amber" | "purple";
  onClick?: () => void;
  isActive?: boolean;
  hidden?: boolean;
  prefix?: string;
}

interface StatusIndicatorsProps {
  items: StatusIndicatorProps[];
  title?: string;
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900",
  green:
    "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:border-green-900",
  red: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:border-red-900",
  amber:
    "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900",
  purple:
    "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900",
};

export function StatusIndicators({ items, title }: StatusIndicatorsProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {items
          .filter((item) => !item.hidden)
          .map((item, index) => {
            const Icon = item.icon;
            const colorClass = colorMap[item.color];

            return (
              <button
                key={index}
                onClick={item.onClick}
                disabled={!item.onClick}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                  item.onClick
                    ? "cursor-pointer hover:shadow-md hover:scale-105"
                    : "cursor-default",
                  item.isActive
                    ? "bg-primary/10 border-primary shadow-sm"
                    : colorClass,
                )}
              >
                <Icon className="h-5 w-5" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-center line-clamp-2">
                    {item.label}
                  </span>
                  <Badge variant="secondary" className="text-xs font-bold px-2">
                    {item.prefix}
                    {item.count}
                  </Badge>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
