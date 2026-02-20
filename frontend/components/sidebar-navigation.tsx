"use client";

import React from "react";

import { useState } from "react";
import {
  Home,
  Warehouse,
  Bird,
  ClipboardList,
  Package,
  Utensils,
  Heart,
  Trophy,
  DollarSign,
  BarChart3,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  key: string;
  badge?: string;
  items?: Array<{
    title: string;
    url: string;
    badge?: string;
    onClick: () => void;
  }>;
  onClick?: () => void;
}

interface SidebarNavigationProps {
  items: SidebarItem[];
  expandedItems: Record<string, boolean>;
  onToggleExpanded: (title: string) => void;
  onMobileItemClick?: () => void;
  userName?: string;
}

export function SidebarNavigation({
  items,
  expandedItems,
  onToggleExpanded,
  onMobileItemClick,
  userName,
}: SidebarNavigationProps & { userName?: string }) {
  const { t, dir } = useLanguage();

  return (
    <div className="flex flex-col h-full">
      {/* Main navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {items.map((item) => (
          <div key={item.key}>
            {item.items && item.items.length > 0 ? (
              <div>
                <button
                  onClick={() => {
                    onToggleExpanded(item.key);
                    if (item.onClick) item.onClick();
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition-colors",
                    item.isActive
                      ? "bg-primary text-white"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="h-5 w-5 flex-shrink-0">{item.icon}</div>
                    <span className="text-sm font-medium truncate">
                      {item.title}
                    </span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="text-xs ml-auto flex-shrink-0"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 flex-shrink-0 transition-transform",
                      expandedItems[item.key] && "rotate-180",
                    )}
                  />
                </button>

                {/* Submenu */}
                {expandedItems[item.key] && (
                  <div className="ml-2 mt-1 space-y-1 border-l-2 border-muted pl-3">
                    {item.items.map((subitem) => (
                      <button
                        key={subitem.title}
                        onClick={() => {
                          subitem.onClick();
                          onMobileItemClick?.();
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
                      >
                        <span className="truncate">{subitem.title}</span>
                        {subitem.badge && (
                          <Badge variant="secondary" className="text-[10px]">
                            {subitem.badge}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (item.onClick) item.onClick();
                  onMobileItemClick?.();
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors",
                  item.isActive
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <div className="h-5 w-5">{item.icon}</div>
                <span className="text-sm font-medium flex-1 text-left">
                  {item.title}
                </span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
