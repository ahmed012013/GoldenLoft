import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Bird } from "@shared/interfaces/bird.interface";

import { BirdGender, BirdStatus } from "@shared/enums/bird.enums";

interface UseBirdsQuery {
  search?: string;
  status?: BirdStatus | "all" | string;
  gender?: BirdGender | "all" | string;
}

export function useBirds({ search, status, gender }: UseBirdsQuery = {}) {
  return useQuery<Bird[]>({
    queryKey: ["birds", search, status, gender],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (status && status !== "all") params.status = status;
      if (gender && gender !== "all") params.gender = gender;

      const res = await apiClient.get("/birds", { params });
      return res.data;
    },
  });
}
