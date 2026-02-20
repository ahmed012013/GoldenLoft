import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates the age of a bird in months and days.
 */
export function calculateAge(birthDate: Date | string, t: any, language: string) {
  const start = new Date(birthDate);
  const end = new Date();

  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const lastDayOfPrevMonth = new Date(
      end.getFullYear(),
      end.getMonth(),
      0,
    ).getDate();
    days += lastDayOfPrevMonth;
  }

  const parts = [];

  if (months > 0) {
    if (language === "ar") {
      if (months === 1) parts.push("شهر");
      else if (months === 2) parts.push("شهران");
      else if (months >= 3 && months <= 10) parts.push(`${months} أشهر`);
      else parts.push(`${months} شهر`);
    } else {
      parts.push(`${months} ${months === 1 ? "month" : "months"}`);
    }
  }

  if (days > 0 || parts.length === 0) {
    if (language === "ar") {
      if (days === 1) parts.push("يوم");
      else if (days === 2) parts.push("يومان");
      else if (days >= 3 && days <= 10) parts.push(`${days} أيام`);
      else parts.push(`${days} يوم`);
    } else {
      parts.push(`${days} ${days === 1 ? "day" : "days"}`);
    }
  }

  return language === "ar" ? parts.join(" و ") : parts.join(" and ");
}
