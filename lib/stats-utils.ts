// lib/stats-utils.ts
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";

export function getCurrentMonthRange() {
  const now = new Date();
  return { start: startOfMonth(now), end: endOfMonth(now) };
}

export function isInRange(
  date: Date | string | null | undefined,
  start: Date,
  end: Date
): boolean {
  if (!date) return false;
  const d = typeof date === "string" ? parseISO(date) : date;
  return isWithinInterval(d, { start, end });
}

export function sumBy<T>(arr: T[], fn: (item: T) => number): number {
  return arr.reduce((acc, item) => acc + fn(item), 0);
}

export const COMMISSION_RATE = 0.1;

// Helper pour convertir une date en clé YYYY-MM-DD (UTC)
export function toDateKey(d: Date | string): string {
  return new Date(d).toISOString().split("T")[0];
}