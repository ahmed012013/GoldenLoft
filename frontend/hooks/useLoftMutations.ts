import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

export function useLoftMutations() {
  const queryClient = useQueryClient();

  const createLoft = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post("/lofts", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lofts"] });
      toast.success("Loft created successfully! 🏠");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create loft");
    },
  });

  const updateLoft = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiClient.patch(`/lofts/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lofts"] });
      toast.success("Loft updated successfully! 🏠");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update loft");
    },
  });

  const deleteLoft = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/lofts/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lofts"] });
      toast.success("Loft deleted successfully! 🗑️");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete loft");
    },
  });

  return {
    createLoft,
    updateLoft,
    deleteLoft,
  };
}
