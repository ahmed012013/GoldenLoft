"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bird, Plus, Search, Warehouse, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { useLoftMutations } from "@/hooks/useLoftMutations";
import { useLofts } from "@/hooks/useLofts";
import { PageLoading } from "@/components/ui/page-loading";

// New Components
import { LoftCard } from "./loft/ui/loft-card";
import { LoftFormDialog } from "./loft/forms/loft-form-dialog";
import { ViewLoftDialog } from "./loft/dialogs/view-loft-dialog";

import apiClient from "@/lib/api-client";

// API_URL removed as it is handled by apiClient

interface LoftPagesProps {
  currentPage: "all" | "add" | "settings";
  onBack: () => void;
}

export function LoftPages({ currentPage, onBack }: LoftPagesProps) {
  const { language, t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog States
  const [loftToEdit, setLoftToEdit] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [loftToView, setLoftToView] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const { lofts, isLoading } = useLofts();
  const { deleteLoft } = useLoftMutations();

  // Fetch bird stats for occupancy (Global stats, though loft cards show individual occupancy)
  const { data: birdStats } = useQuery({
    queryKey: ["birds/stats"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/birds/stats");
        return res.data;
      } catch (error) {
        return { total: 0 };
      }
    },
  });

  const filteredLofts =
    lofts?.filter((loft: any) => {
      const name = loft.name || "";
      const location = loft.location || "";
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }) || [];

  const handleDelete = (id: string) => {
    if (
      confirm(
        language === "ar"
          ? "هل أنت متأكد من حذف هذا اللوفت؟"
          : "Are you sure you want to delete this loft?",
      )
    ) {
      deleteLoft.mutate(id);
    }
  };

  // Loft Settings Page (Keeping as is, or could be extracted too)
  const LoftSettingsPage = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-2xl"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t("loftSettingsTitle")}</h1>
        </div>
      </div>
      <div className="p-4 rounded-3xl border bg-card text-card-foreground shadow-sm">
        <p className="text-muted-foreground">
          Settings configuration would go here.
        </p>
      </div>
    </div>
  );

  if (currentPage === "settings") return <LoftSettingsPage />;

  if (isLoading) {
    return <PageLoading />;
  }

  // If no lofts
  if (!lofts || lofts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <div className="p-6 rounded-full bg-primary/10">
          <Warehouse className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">
          {language === "ar"
            ? "مرحباً بك في جولدن لوفت!"
            : "Welcome to Golden Loft!"}
        </h2>
        <p className="max-w-md text-muted-foreground">
          {language === "ar"
            ? "لم تقم بإنشاء أي لوفت بعد. ابدأ بإدارة حمامك بإضافة أول لوفت لك."
            : "You haven't created any lofts yet. Start managing your pigeons by adding your first loft."}
        </p>
        <LoftFormDialog
          trigger={
            <Button className="rounded-2xl">
              <Plus
                className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
              />
              {t("addNewLoft")}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t("allLoftsTitle")}</h1>
            <p className="text-muted-foreground">
              {language === "ar"
                ? `${lofts.length} لوفت مسجل`
                : `${lofts.length} lofts registered`}
            </p>
          </div>
          <LoftFormDialog
            trigger={
              <Button className="rounded-2xl">
                <Plus
                  className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                />
                {t("addNewLoft")}
              </Button>
            }
          />
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className={cn(
              "absolute top-3 h-4 w-4 text-muted-foreground",
              dir === "rtl" ? "right-3" : "left-3",
            )}
          />
          <Input
            type="search"
            placeholder={t("search")}
            className={cn("rounded-2xl", dir === "rtl" ? "pr-10" : "pl-10")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <Warehouse className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{lofts.length}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("allLofts")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <Bird className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{birdStats?.total || 0}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("currentOccupancy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lofts Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLofts.map((loft: any) => (
            <LoftCard
              key={loft.id}
              loft={loft}
              onView={(loft) => {
                setLoftToView(loft);
                setShowViewDialog(true);
              }}
              onEdit={(loft) => {
                setLoftToEdit(loft);
                setShowEditDialog(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* View Details Dialog */}
        <ViewLoftDialog
          loft={loftToView}
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
        />

        {/* Edit Dialog - Using the same LoftFormDialog but passing loft prop */}
        <LoftFormDialog
          loft={loftToEdit}
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) setLoftToEdit(null);
          }}
        />
      </div>
    </div>
  );
}
