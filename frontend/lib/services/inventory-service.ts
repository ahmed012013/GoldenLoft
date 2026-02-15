import apiClient from "@/lib/api-client";

export interface InventoryItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  minStock: number;
  cost: number;
  supplier?: string;
  expiryDate?: string;
  purchaseDate?: string;
  location?: string;
  condition?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: "inStock" | "lowStock" | "outOfStock" | "expiringSoon"; // Computed in frontend or backend
}

export interface CreateInventoryItemDto {
  name: string;
  type: string;
  quantity: number;
  unit: string;
  minStock?: number;
  cost?: number;
  supplier?: string;
  expiryDate?: string;
  purchaseDate?: string;
  location?: string;
  condition?: string;
  notes?: string;
}

export interface UpdateInventoryItemDto extends Partial<CreateInventoryItemDto> {}

export const inventoryService = {
  async findAll(type?: string, status?: string) {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (status) params.append("status", status);

    // Using apiClient for authenticated requests
    return apiClient.get<InventoryItem[]>(`/inventory?${params.toString()}`);
  },

  async findOne(id: string) {
    return apiClient.get<InventoryItem>(`/inventory/${id}`);
  },

  async create(data: CreateInventoryItemDto) {
    return apiClient.post<InventoryItem>("/inventory", data);
  },

  async update(id: string, data: UpdateInventoryItemDto) {
    return apiClient.patch<InventoryItem>(`/inventory/${id}`, data);
  },

  async remove(id: string) {
    return apiClient.delete(`/inventory/${id}`);
  },
};
