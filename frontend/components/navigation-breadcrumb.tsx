"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface NavigationBreadcrumbProps {
  items: BreadcrumbItem[];
  onBack?: () => void;
  title?: string;
}

export function NavigationBreadcrumb({
  items,
  onBack,
  title,
}: NavigationBreadcrumbProps) {
  const { dir } = useLanguage();

  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          >
            {dir === "rtl" ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="text-xs">{dir === "rtl" ? "رجوع" : "Back"}</span>
          </button>
        )}

        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && (
              <div className="text-muted-foreground/50 text-xs">
                {dir === "rtl" ? "←" : "→"}
              </div>
            )}
            <button
              onClick={item.onClick}
              disabled={!item.onClick}
              className={cn(
                "text-xs px-2 py-1 rounded-lg transition-colors",
                item.active
                  ? "bg-primary text-white font-medium"
                  : item.onClick
                    ? "text-muted-foreground hover:bg-muted"
                    : "text-muted-foreground cursor-default",
              )}
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>

      {/* Title */}
      {title && (
        <h1 className="text-2xl md:text-3xl font-bold text-balance">{title}</h1>
      )}
    </div>
  );
}
