"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { Search, X, Filter } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: "pigeon" | "loft" | "race" | "task";
  description: string;
}

const sampleResults: SearchResult[] = [
  {
    id: "1",
    title: "حمام الفينيكس",
    type: "pigeon",
    description: "حمام سباق أسود اللون",
  },
  {
    id: "2",
    title: "حمام النيل",
    type: "pigeon",
    description: "حمام تربية أبيض",
  },
  {
    id: "3",
    title: "حظيرة الشرقية",
    type: "loft",
    description: "حظيرة رئيسية",
  },
  {
    id: "4",
    title: "سباق القاهرة",
    type: "race",
    description: "سباق دولي 200 كم",
  },
  { id: "5", title: "إطعام الحمام", type: "task", description: "مهمة يومية" },
];

export function AdvancedSearch() {
  const { t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const filters = [
    { id: "pigeon", label: "الحمام", count: 48 },
    { id: "loft", label: "الحظائر", count: 3 },
    { id: "race", label: "السباقات", count: 12 },
    { id: "task", label: "المهام", count: 8 },
  ];

  const results = sampleResults.filter((result) => {
    const matchesQuery =
      result.title.includes(searchQuery) ||
      result.description.includes(searchQuery);
    const matchesFilter =
      selectedFilters.length === 0 || selectedFilters.includes(result.type);
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className={`absolute top-3 h-4 w-4 text-muted-foreground ${dir === "rtl" ? "right-3" : "left-3"}`}
          />
          <Input
            placeholder="ابحث عن حمام، حظيرة، سباق..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className={`${dir === "rtl" ? "pr-10" : "pl-10"} rounded-2xl`}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-2xl bg-transparent"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 p-4">
          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Badge
                key={filter.id}
                variant={
                  selectedFilters.includes(filter.id) ? "default" : "outline"
                }
                className="cursor-pointer rounded-full"
                onClick={() => {
                  setSelectedFilters((prev) =>
                    prev.includes(filter.id)
                      ? prev.filter((f) => f !== filter.id)
                      : [...prev, filter.id],
                  );
                }}
              >
                {filter.label} ({filter.count})
              </Badge>
            ))}
          </div>

          {/* Results */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="font-medium">{result.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {result.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {filters.find((f) => f.id === result.type)?.label}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                لا توجد نتائج
              </p>
            )}
          </div>
        </Card>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
