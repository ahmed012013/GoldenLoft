import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Bird } from "@shared/interfaces/bird.interface";

import { BirdGender, BirdStatus } from "@shared/enums/bird.enums";

interface UseBirdsQuery {
  search?: string;
  status?: BirdStatus | "all" | string;
  gender?: BirdGender | "all" | string;
}

export interface BirdsResponse {
  data: Bird[];
  total: number;
}

export function useBirds({
  search,
  status,
  gender,
  page = 1,
  limit = 20,
}: UseBirdsQuery & { page?: number; limit?: number } = {}) {
  return useQuery<BirdsResponse>({
    queryKey: ["birds", search, status, gender, page, limit],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page,
        limit,
        skip: (page - 1) * limit,
        take: limit,
      };
      if (search) params.search = search;
      if (status && status !== "all") params.status = status;
      if (gender && gender !== "all") params.gender = gender;

      const res = await apiClient.get("/birds", { params });
      // Backend now returns { data, total }
      return res.data;
    },
    staleTime: 30 * 1000, // Data stays fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
  });
}
