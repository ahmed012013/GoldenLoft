import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

export interface IncomeItem {
  id: number;
  type: string;
  amount: number;
  description: string;
  date: string;
  pigeon?: string;
}

export interface ExpenseItem {
  id: number;
  category: string;
  amount: number;
  description: string;
  date: string;
  quantity?: string;
}

const initialIncomeData: IncomeItem[] = [
  {
    id: 1,
    type: "race",
    amount: 250,
    description: "جائزة الفائز - السباق الأول",
    date: "2024-01-15",
    pigeon: "فارس البياض",
  },
  {
    id: 2,
    type: "race",
    amount: 150,
    description: "جائزة المركز الثاني - السباق الثاني",
    date: "2024-01-10",
    pigeon: "الريح السريعة",
  },
  {
    id: 3,
    type: "sale",
    amount: 500,
    description: "بيع زوج حمام ",
    date: "2024-01-05",
    pigeon: "زوج مشهور",
  },
];

const initialExpensesData: ExpenseItem[] = [
  {
    id: 1,
    category: "feed",
    amount: 120,
    description: "علف حبوب عالي الجودة",
    date: "2024-01-20",
    quantity: "25 كغ",
  },
  {
    id: 2,
    category: "medicine",
    amount: 85,
    description: "أدوية وفيتامينات",
    date: "2024-01-18",
    quantity: "مجموعة",
  },
  {
    id: 3,
    category: "equipment",
    amount: 300,
    description: "شبك وقفص جديد",
    date: "2024-01-12",
    quantity: "قطعة",
  },
  {
    id: 4,
    category: "transport",
    amount: 60,
    description: "نقل الحمام للسباق",
    date: "2024-01-10",
    quantity: "رحلة",
  },
];

export function useFinance() {
  const { t } = useLanguage();
  const [income, setIncome] = useState<IncomeItem[]>(initialIncomeData);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpensesData);

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const profit = totalIncome - totalExpenses;

  const addIncome = (item: Omit<IncomeItem, "id">) => {
    setIncome([...income, { ...item, id: Date.now() }]);
  };

  const addExpense = (item: Omit<ExpenseItem, "id">) => {
    setExpenses([...expenses, { ...item, id: Date.now() }]);
  };

  const deleteIncome = (id: number) => {
    setIncome(income.filter((i) => i.id !== id));
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  return {
    income,
    expenses,
    totalIncome,
    totalExpenses,
    profit,
    addIncome,
    addExpense,
    deleteIncome,
    deleteExpense,
  };
}
