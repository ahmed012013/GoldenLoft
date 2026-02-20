import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  pairingsApi,
  eggsApi,
  PairingPayload,
  UpdatePairingPayload,
  EggPayload,
  UpdateEggPayload,
  HatchEggPayload,
} from "@/lib/breeding-api";

// ============ Query Keys ============
export const breedingKeys = {
  pairings: ["pairings"] as const,
  pairingStats: ["pairings", "stats"] as const,
  eggs: ["eggs"] as const,
};

// ============ Pairings Hooks ============

export function usePairings() {
  return useQuery({
    queryKey: breedingKeys.pairings,
    queryFn: () => pairingsApi.getAll(),
    staleTime: 30 * 1000,
  });
}

export function usePairingStats() {
  return useQuery({
    queryKey: breedingKeys.pairingStats,
    queryFn: pairingsApi.getStats,
    staleTime: 30 * 1000,
  });
}

export function usePairingMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: breedingKeys.pairings });
    queryClient.invalidateQueries({ queryKey: breedingKeys.pairingStats });
    queryClient.invalidateQueries({ queryKey: breedingKeys.eggs });
  };

  const createPairing = useMutation({
    mutationFn: (data: PairingPayload) => pairingsApi.create(data),
    onSuccess: invalidate,
  });

  const updatePairing = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePairingPayload }) =>
      pairingsApi.update(id, data),
    onSuccess: invalidate,
  });

  const deletePairing = useMutation({
    mutationFn: (id: string) => pairingsApi.delete(id),
    onSuccess: invalidate,
  });

  return { createPairing, updatePairing, deletePairing };
}

// ============ Eggs Hooks ============

export function useEggs() {
  return useQuery({
    queryKey: breedingKeys.eggs,
    queryFn: () => eggsApi.getAll(),
    staleTime: 30 * 1000,
  });
}

export function useEggMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: breedingKeys.eggs });
    queryClient.invalidateQueries({ queryKey: breedingKeys.pairings });
    queryClient.invalidateQueries({ queryKey: breedingKeys.pairingStats });
  };

  const createEgg = useMutation({
    mutationFn: (data: EggPayload) => eggsApi.create(data),
    onSuccess: invalidate,
  });

  const updateEgg = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEggPayload }) =>
      eggsApi.update(id, data),
    onSuccess: invalidate,
  });

  const hatchEgg = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: HatchEggPayload }) =>
      eggsApi.hatch(id, data),
    onSuccess: invalidate,
  });

  const deleteEgg = useMutation({
    mutationFn: (id: string) => eggsApi.delete(id),
    onSuccess: invalidate,
  });

  return { createEgg, updateEgg, hatchEgg, deleteEgg };
}
