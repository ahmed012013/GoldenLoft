import apiClient from "./api-client";

export enum PairingStatus {
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

export enum EggStatus {
  LAID = "LAID",
  HATCHED = "HATCHED",
  INFERTILE = "INFERTILE",
  BROKEN = "BROKEN",
  DEAD_IN_SHELL = "DEAD_IN_SHELL",
}

export interface PairingPayload {
  maleId: string;
  femaleId: string;
  startDate: string;
  nestBox?: string;
  notes?: string;
}

export interface UpdatePairingPayload {
  endDate?: string;
  status?: PairingStatus;
  nestBox?: string;
  notes?: string;
}

export interface EggPayload {
  pairingId: string;
  layDate: string;
  status?: EggStatus;
  candlingDate?: string;
  candlingResult?: string;
  hatchDate?: string;
}

export interface UpdateEggPayload {
  status?: EggStatus;
  candlingDate?: string;
  candlingResult?: string;
  hatchDateActual?: string;
  hatchDate?: string;
}

export interface HatchEggPayload {
  hatchDate?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

// ============ Pairings API ============

export const pairingsApi = {
  getAll: (params?: PaginationParams) =>
    apiClient.get("/pairings", { params }).then((r) => r.data),

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
  getAll: (params?: PaginationParams) =>
    apiClient.get("/eggs", { params }).then((r) => r.data),

  getOne: (id: string) => apiClient.get(`/eggs/${id}`).then((r) => r.data),

  create: (data: EggPayload) =>
    apiClient.post("/eggs", data).then((r) => r.data),

  update: (id: string, data: UpdateEggPayload) =>
    apiClient.patch(`/eggs/${id}`, data).then((r) => r.data),

  hatch: (id: string, data?: HatchEggPayload) =>
    apiClient.post(`/eggs/${id}/hatch`, data).then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/eggs/${id}`).then((r) => r.data),
};

// ============ Squabs API (uses Birds endpoint with filter) ============

export const squabsApi = {
  getAll: (params?: PaginationParams) =>
    apiClient
      .get("/birds", { params: { status: "squab", ...params } })
      .then((r) => r.data),
};
