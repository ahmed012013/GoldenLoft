import apiClient from "./api-client";

// ============ Types ============

export interface PairingPayload {
  maleId: string;
  femaleId: string;
  startDate: string;
  nestBox?: string;
  notes?: string;
}

export interface UpdatePairingPayload {
  endDate?: string;
  status?: "ACTIVE" | "FINISHED";
  nestBox?: string;
  notes?: string;
}

export interface EggPayload {
  pairingId: string;
  layDate: string;
  status?: "LAID" | "HATCHED" | "INFERTILE" | "BROKEN" | "DEAD_IN_SHELL";
  candlingDate?: string;
  candlingResult?: string;
}

export interface UpdateEggPayload {
  hatchDateActual?: string;
  status?: "LAID" | "HATCHED" | "INFERTILE" | "BROKEN" | "DEAD_IN_SHELL";
  candlingDate?: string;
  candlingResult?: string;
}

// ============ Pairings API ============

export const pairingsApi = {
  getAll: () => apiClient.get("/pairings").then((r) => r.data),

  getOne: (id: string) => apiClient.get(`/pairings/${id}`).then((r) => r.data),

  getStats: () => apiClient.get("/pairings/stats").then((r) => r.data),

  create: (data: PairingPayload) =>
    apiClient.post("/pairings", data).then((r) => r.data),

  update: (id: string, data: UpdatePairingPayload) =>
    apiClient.patch(`/pairings/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/pairings/${id}`).then((r) => r.data),
};

// ============ Eggs API ============

export const eggsApi = {
  getAll: () => apiClient.get("/eggs").then((r) => r.data),

  getOne: (id: string) => apiClient.get(`/eggs/${id}`).then((r) => r.data),

  create: (data: EggPayload) =>
    apiClient.post("/eggs", data).then((r) => r.data),

  update: (id: string, data: UpdateEggPayload) =>
    apiClient.patch(`/eggs/${id}`, data).then((r) => r.data),

  hatch: (id: string) =>
    apiClient.post(`/eggs/${id}/hatch`).then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/eggs/${id}`).then((r) => r.data),
};

// ============ Squabs API (uses Birds endpoint with filter) ============

export const squabsApi = {
  getAll: () =>
    apiClient
      .get("/birds", { params: { status: "squab" } })
      .then((r) => r.data),
};
