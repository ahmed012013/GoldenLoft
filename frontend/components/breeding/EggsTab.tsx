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

export function EggsTab() {
  const { t } = useLanguage();
  const { data: eggs = [], isLoading } = useEggs();
  const { data: pairings = [], isLoading: isPairingsLoading } = usePairings();
  const { createEgg, updateEgg, hatchEgg, deleteEgg } = useEggMutations();

  const [showForm, setShowForm] = useState(false);
  const [editingEgg, setEditingEgg] = useState<BackendEgg | null>(null);
  const [hatchingEgg, setHatchingEgg] = useState<BackendEgg | null>(null);

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
        const egg = eggs.find((e: any) => e.id === eggId);
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

      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingEgg(null);
            setShowForm(true);
          }}
          className="gap-2 rounded-2xl"
        >
          <Plus className="h-4 w-4" />
          {t("addEgg")}
        </Button>
      </div>

      {showForm && (
        <EggForm
          editingEgg={editingEgg}
          activePairings={activePairings}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          isSubmitting={createEgg.isPending || updateEgg.isPending}
        />
      )}

      <EggList
        eggs={eggs as BackendEgg[]}
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
