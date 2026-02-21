import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";
import {
  usePairings,
  usePairingStats,
  usePairingMutations,
} from "@/hooks/useBreeding";
import { useBirds } from "@/hooks/useBirds";
import { BackendPairing } from "./types";
import { PairingCardSkeleton } from "@/components/ui/pairing-card-skeleton";
import { PairingStats } from "./PairingStats";
import { BreedingStatsSkeleton } from "./BreedingStatsSkeleton";
import { PairingForm } from "./PairingForm";
import { PairingList } from "./PairingList";
import { PairingStatus } from "@/lib/breeding-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function PairingsTab() {
  const { t } = useLanguage();
  const { data: pairings = [], isLoading } = usePairings();
  const { data: stats } = usePairingStats();
  const { createPairing, updatePairing, deletePairing } = usePairingMutations();
  const { data: birdsData } = useBirds({ limit: 200 });

  const [showForm, setShowForm] = useState(false);
  const [editingPairing, setEditingPairing] = useState<BackendPairing | null>(
    null,
  );

  const activeBirdIds = new Set(
    (pairings as BackendPairing[])
      .filter((p) => p.status === PairingStatus.ACTIVE)
      .flatMap((p) => [p.maleId, p.femaleId]),
  );

  const birds = birdsData?.data || [];

  const handleFormSubmit = async (data: {
    maleId: string;
    femaleId: string;
    startDate: string;
    nestBox?: string;
    notes?: string;
  }) => {
    if (
      !editingPairing &&
      (!data.maleId || !data.femaleId || !data.startDate)
    ) {
      toast.error(t("fillAllFields"));
      return;
    }

    try {
      if (editingPairing) {
        await updatePairing.mutateAsync({
          id: editingPairing.id,
          data: {
            nestBox: data.nestBox || undefined,
            notes: data.notes || undefined,
          },
        });
        toast.success(t("pairingUpdated"));
      } else {
        await createPairing.mutateAsync({
          maleId: data.maleId,
          femaleId: data.femaleId,
          startDate: new Date(data.startDate).toISOString(),
          nestBox: data.nestBox || undefined,
          notes: data.notes || undefined,
        });
        toast.success(t("pairingCreated"));
      }
      setShowForm(false);
      setEditingPairing(null);
    } catch {
      // Error handled by api-client interceptor
    }
  };

  const handleEdit = (pairing: BackendPairing) => {
    setEditingPairing(pairing);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePairing.mutateAsync(id);
      toast.success(t("pairingDeleted"));
    } catch {
      // Error handled by api-client interceptor
    }
  };

  const handleStatusChange = async (id: string, newStatus: PairingStatus) => {
    try {
      await updatePairing.mutateAsync({
        id,
        data: {
          status: newStatus,
          ...(newStatus === PairingStatus.FINISHED
            ? { endDate: new Date().toISOString() }
            : {}),
        },
      });
      toast.success(t("statusUpdated"));
    } catch {
      // Error handled by api-client interceptor
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BreedingStatsSkeleton />
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
      <PairingStats stats={stats} />

      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingPairing(null);
            setShowForm(true);
          }}
          className="gap-2 rounded-2xl"
        >
          <Plus className="h-4 w-4" />
          {t("addPairing")}
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingPairing ? t("editPairing") : t("addPairing")}
            </DialogTitle>
          </DialogHeader>
          <PairingForm
            editingPairing={editingPairing}
            birds={birds}
            activeBirdIds={activeBirdIds}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            isSubmitting={createPairing.isPending || updatePairing.isPending}
          />
        </DialogContent>
      </Dialog>

      <PairingList
        pairings={pairings as BackendPairing[]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        isDeleting={deletePairing.isPending}
      />
    </div>
  );
}
