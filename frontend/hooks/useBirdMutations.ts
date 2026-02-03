import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { CreateBirdDto } from "@shared/dtos/create-bird.dto";

export function useBirdMutations() {
  const queryClient = useQueryClient();

  const createBird = useMutation({
    mutationFn: async (data: CreateBirdDto | FormData) => {
      const res = await apiClient.post("/birds", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["birds"] });
      queryClient.invalidateQueries({ queryKey: ["birds/stats"] });
    },
  });

  const updateBird = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData | any }) => {
      const res = await apiClient.patch(`/birds/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["birds"] });
      queryClient.invalidateQueries({ queryKey: ["birds/stats"] });
    },
  });

  const deleteBird = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/birds/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["birds"] });
      queryClient.invalidateQueries({ queryKey: ["birds/stats"] });
    },
  });

  return {
    createBird,
    updateBird,
    deleteBird,
  };
}
