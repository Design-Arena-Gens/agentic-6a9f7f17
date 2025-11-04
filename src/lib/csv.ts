import { DataState, Expense } from "./types";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export function expensesToCsv(state: DataState): string {
  const header = [
    "id",
    "date",
    "project",
    "category",
    "vendor",
    "description",
    "amount",
    "tax",
    "invoiceNumber",
    "paid",
    "paymentMethod",
  ];

  const projectById = Object.fromEntries(state.projects.map((p) => [p.id, p.name]));
  const categoryById = Object.fromEntries(state.categories.map((c) => [c.id, c.name]));
  const vendorById = Object.fromEntries(state.vendors.map((v) => [v.id, v.name]));

  const rows = state.expenses.map((e: Expense) => [
    e.id,
    e.date,
    projectById[e.projectId] ?? "",
    categoryById[e.categoryId] ?? "",
    e.vendorId ? vendorById[e.vendorId] ?? "" : "",
    e.description,
    e.amount,
    e.tax ?? "",
    e.invoiceNumber ?? "",
    e.paid ? "TRUE" : "FALSE",
    e.paymentMethod ?? "",
  ]);

  const all = [header, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  return all + "\n";
}

export function triggerDownload(filename: string, content: string, mime: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
