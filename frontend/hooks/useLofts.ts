import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export interface Loft {
  id: string;
  name: string;
  isDefault: boolean;
}

export function useLofts() {
  const {
    data: lofts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lofts"],
    queryFn: async () => {
      const res = await apiClient.get<Loft[]>("/lofts/my-loft");
      return res.data;
    },
    staleTime: 60 * 1000, // Lofts rarely change - fresh for 1 minute
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  return {
    lofts,
    isLoading,
    error,
  };
}
