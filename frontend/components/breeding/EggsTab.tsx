import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";
import { useEggs, usePairings, useEggMutations } from "@/hooks/useBreeding";
import { BackendEgg, BackendPairing } from "./types";
import { PairingCardSkeleton } from "@/components/ui/pairing-card-skeleton";
import { EggStats } from "./EggStats";
import { EggForm } from "./EggForm";
import { EggList } from "./EggList";
import { HatchConfirmationDialog } from "./HatchConfirmationDialog";
import { PairingStatus, EggStatus } from "@/lib/breeding-api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function EggsTab() {
  const { t } = useLanguage();
  const { data: eggsData, isLoading } = useEggs();
  const eggs = (eggsData || []) as BackendEgg[];
  const { data: pairings = [], isLoading: isPairingsLoading } = usePairings();
  const { createEgg, updateEgg, hatchEgg, deleteEgg } = useEggMutations();

  const [showForm, setShowForm] = useState(false);
  const [editingEgg, setEditingEgg] = useState<BackendEgg | null>(null);
  const [hatchingEgg, setHatchingEgg] = useState<BackendEgg | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const activePairings = (pairings as BackendPairing[]).filter(
    (p) => p.status === PairingStatus.ACTIVE,
  );

  const handleFormSubmit = async (data: any) => {
    if (!editingEgg && (!data.pairingId || !data.layDate)) {
      toast.error(t("fillAllFields"));
      return;
    }

    try {
      if (editingEgg) {
        await updateEgg.mutateAsync({
          id: editingEgg.id,
          data: {
            candlingDate: data.candlingDate
              ? new Date(data.candlingDate).toISOString()
              : undefined,
            candlingResult: data.candlingResult || undefined,
            status: data.status,
            hatchDateActual: data.hatchDate ? new Date(data.hatchDate).toISOString() : undefined,
          },
        });
        toast.success(t("eggUpdated"));
      } else {
        await createEgg.mutateAsync({
          pairingId: data.pairingId,
          layDate: new Date(data.layDate).toISOString(),
          candlingDate: data.candlingDate
            ? new Date(data.candlingDate).toISOString()
            : undefined,
          candlingResult: data.candlingResult || undefined,
          status: data.status,
          hatchDate: data.hatchDate ? new Date(data.hatchDate).toISOString() : undefined,
        });
        toast.success(t("eggCreated"));
      }
      setShowForm(false);
      setEditingEgg(null);
    } catch {
      // Error handled by api-client interceptor
    }
  };

  const handleEdit = (egg: BackendEgg) => {
    setEditingEgg(egg);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEgg.mutateAsync(id);
      toast.success(t("eggDeleted"));
    } catch {
      // Error handled by api-client interceptor
    }
  };

  const handleHatchConfirm = async (hatchDate: string) => {
    if (!hatchingEgg) return;
    try {
      await hatchEgg.mutateAsync({
        id: hatchingEgg.id,
        data: { hatchDate },
      });
      toast.success(t("eggHatchedStats"));
      setHatchingEgg(null);
    } catch {
      // Error handled by api-client interceptor
    }
  };

  const handleStatusChange = async (
    eggId: string,
    newStatus: BackendEgg["status"],
  ) => {
    try {
      if (newStatus === EggStatus.HATCHED) {
        const egg = eggs.find((e) => e.id === eggId);
        if (egg) {
          setHatchingEgg(egg as BackendEgg);
        }
      } else {
        await updateEgg.mutateAsync({
          id: eggId,
          data: {
            status: newStatus,
          },
        });
        toast.success(t("statusUpdated"));
      }
    } catch {
      // Error handled by api-client interceptor
    }
  };

  if (isLoading || isPairingsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <PairingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EggStats eggs={eggs as BackendEgg[]} />

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchByParentRing")}
            className="pl-10 rounded-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setEditingEgg(null);
            setShowForm(true);
          }}
          className="gap-2 rounded-2xl w-full md:w-auto"
        >
          <Plus className="h-4 w-4" />
          {t("addEgg")}
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingEgg ? t("editEgg") : t("addEgg")}
            </DialogTitle>
          </DialogHeader>
          <EggForm
            editingEgg={editingEgg}
            activePairings={activePairings}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            isSubmitting={createEgg.isPending || updateEgg.isPending}
          />
        </DialogContent>
      </Dialog>

      <EggList
        eggs={(eggs as BackendEgg[]).filter((egg) => {
          if (!searchTerm) return true;
          const search = searchTerm.toLowerCase();
          return (
            egg.pairing?.male?.ringNumber?.toLowerCase().includes(search) ||
            egg.pairing?.female?.ringNumber?.toLowerCase().includes(search) ||
            egg.pairing?.male?.name?.toLowerCase().includes(search) ||
            egg.pairing?.female?.name?.toLowerCase().includes(search)
          );
        })}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        isDeleting={deleteEgg.isPending}
      />

      <HatchConfirmationDialog
        egg={hatchingEgg}
        isOpen={!!hatchingEgg}
        onClose={() => setHatchingEgg(null)}
        onConfirm={handleHatchConfirm}
        isSubmitting={hatchEgg.isPending}
      />
    </div>
  );
}
