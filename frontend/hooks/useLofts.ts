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
  });

  return {
    lofts,
    isLoading,
    error,
  };
}
