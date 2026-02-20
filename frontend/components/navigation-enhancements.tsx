"use client";

import { useLanguage } from "@/lib/language-context";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  const { dir } = useLanguage();

  return (
    <nav className="flex items-center gap-2 text-sm mb-4">
      <button
        onClick={() => onNavigate?.("/")}
        className="p-1 hover:bg-accent rounded-lg transition-colors"
      >
        <Home className="h-4 w-4" />
      </button>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground",
              dir === "rtl" && "rotate-180",
            )}
          />
          <button
            onClick={() => item.href && onNavigate?.(item.href)}
            className={cn(
              "px-2 py-1 rounded-lg transition-colors",
              item.current
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:bg-accent",
            )}
          >
            {item.label}
          </button>
        </div>
      ))}
    </nav>
  );
}

// Keyboard shortcuts helper
export const KeyboardShortcuts = {
  HOME: "h",
  SEARCH: "/",
  NOTIFICATIONS: "n",
  SETTINGS: ",",
  HELP: "?",
} as const;

export function useKeyboardShortcuts(callbacks: Record<string, () => void>) {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ignore if user is typing in an input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    Object.entries(KeyboardShortcuts).forEach(([action, key]) => {
      if (e.key.toLowerCase() === key && callbacks[action]) {
        e.preventDefault();
        callbacks[action]();
      }
    });
  };

  return handleKeyDown;
}

// Shortcuts display component
export function ShortcutsHelp() {
  return (
    <div className="space-y-3 text-sm">
      <h4 className="font-medium">اختصارات لوحة المفاتيح</h4>
      <div className="grid gap-2">
        {Object.entries(KeyboardShortcuts).map(([action, key]) => (
          <div key={action} className="flex justify-between">
            <span className="text-muted-foreground">{action}</span>
            <kbd className="px-2 py-1 text-xs bg-accent rounded">{key}</kbd>
          </div>
        ))}
      </div>
    </div>
  );
}
