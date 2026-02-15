"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  inventoryService,
  InventoryItem,
} from "@/lib/services/inventory-service";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/lib/language-context";
import { Wheat, Pill, Wrench, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InventoryItemDialog } from "./inventory-item-dialog";
import { InventoryFeedTab } from "./inventory/tabs/feed-tab";
import { InventoryMedicationsTab } from "./inventory/tabs/medications-tab";
import { InventoryEquipmentTab } from "./inventory/tabs/equipment-tab";
import { OnboardingGuard } from "@/components/onboarding-guard";

interface InventoryPagesProps {
  currentPage: "feed" | "medications" | "equipment";
  onBack: () => void;
}

export function InventoryPages({ currentPage, onBack }: InventoryPagesProps) {
  const { t, language, dir } = useLanguage();
  const currencySymbol = t("currency" as any) || "EGP";
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(currentPage);

  const queryClient = useQueryClient();

  // Fetch Inventory items
  const inventoryQuery = useQuery({
    queryKey: ["inventory"],
    queryFn: () => inventoryService.findAll(),
  });

  const allItems = inventoryQuery.data?.data || [];
  const isLoading = inventoryQuery.isLoading;

  const createItemMutation = useMutation({
    mutationFn: inventoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setIsAddDialogOpen(false);
      toast.success(
        t("itemAdded" as any) ||
          (language === "ar"
            ? "تمت إضافة العنصر بنجاح"
            : "Item added successfully"),
      );
    },
    onError: (error: any) => {
      toast.error(
        error.message ||
          (language === "ar" ? "فشل إضافة العنصر" : "Failed to add item"),
      );
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      inventoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setIsAddDialogOpen(false);
      toast.success(
        t("itemUpdated" as any) ||
          (language === "ar"
            ? "تم تحديث العنصر بنجاح"
            : "Item updated successfully"),
      );
    },
    onError: (error: any) => {
      toast.error(
        error.message ||
          (language === "ar" ? "فشل تحديث العنصر" : "Failed to update item"),
      );
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: inventoryService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success(
        t("itemDeleted" as any) ||
          (language === "ar"
            ? "تم حذف العنصر بنجاح"
            : "Item deleted successfully"),
      );
    },
    onError: (error: any) => {
      toast.error(
        error.message ||
          (language === "ar" ? "فشل حذف العنصر" : "Failed to delete item"),
      );
    },
  });

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [dialogCategory, setDialogCategory] = useState<
    "feed" | "medications" | "equipment"
  >("feed");

  const handleAddNew = (category: "feed" | "medications" | "equipment") => {
    setDialogMode("add");
    setDialogCategory(category);
    setEditingItem(null);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (
    item: InventoryItem,
    category: "feed" | "medications" | "equipment",
  ) => {
    setDialogMode("edit");
    setDialogCategory(category);
    setEditingItem(item);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteItemMutation.mutate(id);
  };

  const handleDialogSubmit = (data: any) => {
    const formattedData = { ...data };

    if (formattedData.expiryDate) {
      formattedData.expiryDate = new Date(
        formattedData.expiryDate,
      ).toISOString();
    } else {
      formattedData.expiryDate = null;
    }

    if (formattedData.purchaseDate) {
      formattedData.purchaseDate = new Date(
        formattedData.purchaseDate,
      ).toISOString();
    } else {
      formattedData.purchaseDate = null;
    }

    if (dialogMode === "add") {
      createItemMutation.mutate(formattedData);
    } else {
      if (editingItem) {
        updateItemMutation.mutate({ id: editingItem.id, data: formattedData });
      }
    }
  };

  // Filter items based on current page and search/filters
  const getFilteredItems = (category: "feed" | "medications" | "equipment") => {
    const feedTypes = ["seed", "grain", "pellet", "mix", "grit", "supplement"];
    const medTypes = [
      "vaccine",
      "antibiotic",
      "vitamin",
      "antiparasitic",
      "probiotic",
      "med_other",
    ];
    const equipTypes = [
      "feeder",
      "drinker",
      "nestBox",
      "perch",
      "trap",
      "cage",
      "cleaning",
      "training",
      "equip_other",
    ];

    return allItems
      .filter((item) => {
        // 1. Filter by Category
        if (category === "feed") {
          return feedTypes.includes(item.type);
        }
        if (category === "medications") {
          return medTypes.includes(item.type);
        }
        if (category === "equipment") {
          return equipTypes.includes(item.type);
        }
        return false;
      })
      .filter((item: InventoryItem) => {
        // 2. Search
        if (
          searchQuery &&
          !item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;
        // 3. Filter Type
        if (filterType !== "all" && item.type !== filterType) return false;
        // 4. Filter Status
        if (category !== "equipment") {
          // Equipment doesn't have the same status logic usually, or at least not "expiring"
          const status = getComputedStatus(item);
          if (filterStatus !== "all" && status !== filterStatus) return false;
        }

        return true;
      });
  };

  const getComputedStatus = (item: InventoryItem) => {
    if (item.quantity <= 0) return "outOfStock";
    if (item.quantity <= (item.minStock || 0)) return "lowStock";
    if (
      item.expiryDate &&
      new Date(item.expiryDate) <
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    )
      return "expiringSoon"; // 30 days
    return "inStock";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "inStock":
        return (
          <Badge className="rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20">
            {t("inStock" as any) || (language === "ar" ? "متوفر" : "In Stock")}
          </Badge>
        );
      case "lowStock":
        return (
          <Badge className="rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
            {t("lowStock" as any) ||
              (language === "ar" ? "مخزون منخفض" : "Low Stock")}
          </Badge>
        );
      case "outOfStock":
        return (
          <Badge className="rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20">
            {t("outOfStock" as any) ||
              (language === "ar" ? "نفذ المخزون" : "Out of Stock")}
          </Badge>
        );
      case "expiringSoon":
        return (
          <Badge className="rounded-xl bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">
            {t("expiringSoon" as any) ||
              (language === "ar" ? "ينتهي قريباً" : "Expiring Soon")}
          </Badge>
        );
      default:
        return <Badge className="rounded-xl">{status}</Badge>;
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "good":
        return (
          <Badge className="rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20">
            {language === "ar" ? "جيدة" : "Good"}
          </Badge>
        );
      case "fair":
        return (
          <Badge className="rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
            {language === "ar" ? "مقبولة" : "Fair"}
          </Badge>
        );
      case "worn":
        return (
          <Badge className="rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20">
            {language === "ar" ? "مستهلكة" : "Worn"}
          </Badge>
        );
      default:
        return <Badge className="rounded-xl">{condition}</Badge>;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case "feed":
        return t("feedManagement" as any);
      case "medications":
        return t("medicationsManagement" as any);
      case "equipment":
        return t("equipmentManagement" as any);
    }
  };

  const getPageIcon = () => {
    switch (currentPage) {
      case "feed":
        return <Wheat className="h-6 w-6" />;
      case "medications":
        return <Pill className="h-6 w-6" />;
      case "equipment":
        return <Wrench className="h-6 w-6" />;
    }
  };

  return (
    <OnboardingGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-2xl"
            >
              {dir === "rtl" ? (
                <ArrowRight className="h-5 w-5" />
              ) : (
                <ArrowLeft className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                {getPageIcon()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
                <p className="text-sm text-muted-foreground">
                  {t("inventoryManagement" as any)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentPage === "feed" && (
              <InventoryFeedTab
                items={getFilteredItems("feed")}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterType={filterType}
                setFilterType={setFilterType}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                onAdd={() => handleAddNew("feed")}
                onEdit={(item) => handleEdit(item, "feed")}
                onDelete={handleDelete}
                getStatusBadge={getStatusBadge}
                getComputedStatus={getComputedStatus}
              />
            )}
            {currentPage === "medications" && (
              <InventoryMedicationsTab
                items={getFilteredItems("medications")}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterType={filterType}
                setFilterType={setFilterType}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                onAdd={() => handleAddNew("medications")}
                onEdit={(item) => handleEdit(item, "medications")}
                onDelete={handleDelete}
                getStatusBadge={getStatusBadge}
                getComputedStatus={getComputedStatus}
              />
            )}
            {currentPage === "equipment" && (
              <InventoryEquipmentTab
                items={getFilteredItems("equipment")}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterType={filterType}
                setFilterType={setFilterType}
                onAdd={() => handleAddNew("equipment")}
                onEdit={(item) => handleEdit(item, "equipment")}
                onDelete={handleDelete}
                getConditionBadge={getConditionBadge}
              />
            )}
          </motion.div>
        </AnimatePresence>
        {/* Shared Inventory Dialog */}
        <InventoryItemDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          mode={dialogMode}
          category={dialogCategory}
          defaultValues={editingItem || undefined}
          onSubmit={handleDialogSubmit}
        />
      </div>
    </OnboardingGuard>
  );
}
