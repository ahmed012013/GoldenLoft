import { BirdGender, BirdStatus, BirdType } from "../enums/bird.enums";

export interface Bird {
  id: string;
  ringNumber: string;
  name: string;
  gender: BirdGender;
  color: string;
  status: BirdStatus;
  birthDate?: Date | string | null; // Updated to be nullable
  loftId: string;
  fatherId?: string | null;
  motherId?: string | null;
  type?: BirdType;
  image?: string;
  weight?: string;
  nameEn?: string;
  totalRaces: number;
  wins: number;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;

  // Relations (Optional based on fetch depth)
  loft?: { id: string; name: string };
  father?: Bird;
  mother?: Bird;
  childrenFromFather?: Bird[];
  childrenFromMother?: Bird[];
  healthRecords?: any[]; // Replace with HealthRecord interface when available
}
