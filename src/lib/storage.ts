import { DataState, EMPTY_STATE } from "./types";

const STORAGE_KEY = "cem-data-v1";

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadData(): DataState {
  if (!isBrowser()) return EMPTY_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as DataState;
    // minimal validation
    if (!parsed || typeof parsed !== "object") return EMPTY_STATE;
    return {
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      vendors: Array.isArray(parsed.vendors) ? parsed.vendors : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function saveData(state: DataState): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // swallow write errors (quota, etc.)
  }
}

export function clearData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as any).randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
