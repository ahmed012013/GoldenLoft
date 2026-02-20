import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

// Interfaces for chart data
export interface PigeonStats {
    name: string;
    total: number;
    active: number;
}

export interface BreedingStats {
    month: string;
    eggs: number;
    hatched: number;
}

export interface FinancialStats {
    month: string;
    income: number;
    expenses: number;
}

const initialPigeonStats: PigeonStats[] = [
    { name: "Jan", total: 45, active: 30 },
    { name: "Feb", total: 48, active: 32 },
    { name: "Mar", total: 52, active: 35 },
    { name: "Apr", total: 55, active: 38 },
    { name: "May", total: 58, active: 40 },
    { name: "Jun", total: 60, active: 42 },
];

const initialBreedingStats: BreedingStats[] = [
    { month: "Jan", eggs: 12, hatched: 10 },
    { month: "Feb", eggs: 15, hatched: 12 },
    { month: "Mar", eggs: 18, hatched: 15 },
    { month: "Apr", eggs: 20, hatched: 18 },
    { month: "May", eggs: 22, hatched: 20 },
    { month: "Jun", eggs: 25, hatched: 22 },
];

const initialFinancialStats: FinancialStats[] = [
    { month: "Jan", income: 1200, expenses: 800 },
    { month: "Feb", income: 1500, expenses: 900 },
    { month: "Mar", income: 1800, expenses: 1000 },
    { month: "Apr", income: 2000, expenses: 1100 },
    { month: "May", income: 2200, expenses: 1200 },
    { month: "Jun", income: 2500, expenses: 1300 },
];

export function useReports() {
    const { t } = useLanguage();
    const [pigeonStats] = useState<PigeonStats[]>(initialPigeonStats);
    const [breedingStats] = useState<BreedingStats[]>(initialBreedingStats);
    const [financialStats] = useState<FinancialStats[]>(initialFinancialStats);

    return {
        pigeonStats,
        breedingStats,
        financialStats,
    };
}
