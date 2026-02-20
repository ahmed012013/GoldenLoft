import { PairingStatus, EggStatus } from "@/lib/breeding-api";

export interface BackendPairing {
  id: string;
  maleId: string;
  femaleId: string;
  startDate: string;
  endDate?: string | null;
  status: PairingStatus;
  nestBox?: string | null;
  notes?: string | null;
  male: { id: string; ringNumber: string; name: string };
  female: { id: string; ringNumber: string; name: string };
  eggs: BackendEgg[];
}

export interface BackendEgg {
  id: string;
  pairingId: string;
  layDate: string;
  hatchDateExpected?: string | null;
  hatchDateActual?: string | null;
  status: EggStatus;
  candlingDate?: string | null;
  candlingResult?: string | null;
  pairing?: {
    male: { ringNumber: string; name: string };
    female: { ringNumber: string; name: string };
  };
}
