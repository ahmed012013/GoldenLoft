/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/language-context";
import { BirdModal } from "./bird-modal";
import { HealthRecordsList } from "./health-records-list";
import { AddHealthRecordDialog } from "./add-health-record-dialog";
import { useBirdMutations } from "@/hooks/useBirdMutations";
import { useBirds } from "@/hooks/useBirds";
import { Bird } from "@shared/interfaces/bird.interface";
import { useDebounce } from "@/hooks/use-debounce";
import { PigeonCardSkeleton } from "@/components/ui/pigeon-card-skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OnboardingGuard } from "@/components/onboarding-guard";

// New Components
import { BirdCard } from "./pigeon/ui/bird-card";
import { BirdStats } from "./pigeon/ui/bird-stats";
import { BirdFilters } from "./pigeon/ui/bird-filters";
import { BirdForm } from "./pigeon/bird-form";
import { PedigreeDialog } from "./pigeon/dialogs/pedigree-dialog";
import { PedigreeBirdCard } from "./pigeon/ui/pedigree-bird-card";

interface PigeonPagesProps {
  currentPage: "all" | "add" | "pedigree" | "health";
  onBack: () => void;
  onNavigate?: (page: "all" | "add" | "pedigree" | "health") => void;
}
export function PigeonPages({
  currentPage,
  onBack,
  onNavigate,
}: PigeonPagesProps) {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [selectedPigeon, setSelectedPigeon] = useState<Bird | null>(null);
  const [showPedigreeModal, setShowPedigreeModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // For BirdModal (quick add?)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showHealthModal, setShowHealthModal] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const { deleteBird } = useBirdMutations();

  // Use the custom hook for fetching birds with filters
  const { data: birdsData, isLoading } = useBirds({
    search: debouncedSearch,
    status: statusFilter,
    gender: genderFilter,
    page: 1,
    limit: 1000, // Fetch all birds (assuming reasonable limit)
  });

  const filteredPigeons = birdsData?.data || [];
  // const totalBirds = birdsData?.total || 0;

  const handleDelete = useCallback(
    (id: string) => {
      if (
        confirm(
          language === "ar"
            ? "هل أنت متأكد من حذف هذه الحمامة؟"
            : "Are you sure you want to delete this pigeon?",
        )
      ) {
        deleteBird.mutate(id, {
          onSuccess: () => {
            toast.success(
              language === "ar" ? "تم حذف الحمامة" : "Pigeon deleted",
            );
          },
          onError: () => {
            toast.error(
              language === "ar" ? "خطأ في الحذف" : "Error deleting pigeon",
            );
          },
        });
      }
    },
    [deleteBird, language],
  );

  const handleEdit = useCallback(
    (pigeon: Bird) => {
      setEditingId(pigeon.id);
      if (onNavigate) {
        onNavigate("add");
      }
    },
    [onNavigate],
  );

  const handleView = useCallback((p: Bird) => {
    setSelectedPigeon(p);
    setShowPedigreeModal(true);
  }, []);

  const renderAddPigeon = () => (
    <BirdForm
      editingBird={
        editingId ? filteredPigeons?.find((b) => b.id === editingId) : null
      }
      onBack={() => {
        setEditingId(null);
        onBack();
      }}
      onSuccess={() => {
        setEditingId(null);
        if (onNavigate) {
          onNavigate("all");
        } else {
          onBack();
        }
      }}
    />
  );

  const renderAllPigeons = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("allPigeonsTitle")}</h1>
          <p className="text-muted-foreground">{t("pigeonManagementTitle")}</p>
        </div>
      </div>

      {/* Statistics */}
      <BirdStats birds={filteredPigeons} />

      {/* Filters */}
      <BirdFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
      />

      {/* Pigeons Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [...Array(6)].map((_, i) => <PigeonCardSkeleton key={i} />)
        ) : (
          filteredPigeons.map((pigeon) => (
            <BirdCard
              key={pigeon.id}
              pigeon={pigeon}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Pedigree Modal (Accessed via View Button in BirdCard) */}
      <PedigreeDialog
        bird={selectedPigeon}
        open={showPedigreeModal}
        onOpenChange={setShowPedigreeModal}
      />
    </div>
  );

  const renderPedigree = () => (
    <OnboardingGuard requiredLevel="bird">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("pedigreeTitle")}</h1>
            <p className="text-muted-foreground">
              {t("pigeonManagementTitle")}
            </p>
          </div>
        </div>

        {/* Search */}
        <BirdFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
        />

        {/* Pigeons List for Pedigree */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredPigeons.map((pigeon) => (
            <PedigreeBirdCard
              key={pigeon.id}
              pigeon={pigeon}
              onClick={(p) => {
                setSelectedPigeon(p);
                setShowPedigreeModal(true);
              }}
            />
          ))}
        </div>

        {/* Pedigree Modal */}
        <PedigreeDialog
          bird={selectedPigeon}
          open={showPedigreeModal}
          onOpenChange={setShowPedigreeModal}
        />
      </div>
    </OnboardingGuard>
  );

  const renderHealth = () => (
    <OnboardingGuard requiredLevel="bird">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {language === "ar" ? "السجلات الصحية" : "Health Records"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar"
                ? "إدارة الحالة الصحية والتطعيمات"
                : "Manage health status and vaccinations"}
            </p>
          </div>
        </div>

        <HealthRecordsList onAddClick={() => setShowHealthModal(true)} />

        <AddHealthRecordDialog
          open={showHealthModal}
          onOpenChange={setShowHealthModal}
        />
      </div>
    </OnboardingGuard>
  );

  return (
    <OnboardingGuard requiredLevel="loft">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        {currentPage === "all" && renderAllPigeons()}
        {currentPage === "add" && renderAddPigeon()}

        {currentPage === "pedigree" && renderPedigree()}
        {currentPage === "health" && renderHealth()}

        {/* Bird Modal (Quick Add? Not used in current flow but kept for compatibility) */}
        <BirdModal
          open={showAddModal}
          onOpenChange={setShowAddModal}
          existingBirds={filteredPigeons || []}
        />
      </div>
    </OnboardingGuard>
  );
}
