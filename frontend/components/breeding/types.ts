export interface BackendPairing {
  id: string;
  maleId: string;
  femaleId: string;
  startDate: string;
  endDate?: string | null;
  status: "ACTIVE" | "FINISHED";
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
  status: "LAID" | "HATCHED" | "INFERTILE" | "BROKEN" | "DEAD_IN_SHELL";
  candlingDate?: string | null;
  candlingResult?: string | null;
  pairing?: {
    male: { ringNumber: string; name: string };
    female: { ringNumber: string; name: string };
  };
}
