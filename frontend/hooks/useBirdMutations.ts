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
    },
  });

  return {
    createBird,
  };
}
