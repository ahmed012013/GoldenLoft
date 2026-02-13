import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface PigeonStats {
  total: number;
  healthy: number;
  sick: number;
}

async function fetchPigeonStats(): Promise<PigeonStats> {
  const res = await apiClient.get("/birds/stats");
  return res.data;
}

export function usePigeonStats() {
  const query = useQuery({
    queryKey: ["pigeonStats"],
    queryFn: fetchPigeonStats,
    retry: false,
    staleTime: 30 * 1000, // Stats fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  return query;
}
