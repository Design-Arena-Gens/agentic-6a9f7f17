"use client";

import { useMemo, useState } from "react";
import { useHelpers } from "@/context/AppStateContext";

export default function ExpenseTable() {
  const { state, deleteExpense } = useHelpers();
  const [query, setQuery] = useState("");

  const projectById = useMemo(() => Object.fromEntries(state.projects.map((p) => [p.id, p.name])), [state.projects]);
  const categoryById = useMemo(() => Object.fromEntries(state.categories.map((c) => [c.id, c.name])), [state.categories]);
  const vendorById = useMemo(() => Object.fromEntries(state.vendors.map((v) => [v.id, v.name])), [state.vendors]);

  const filtered = useMemo(() => {
    if (!query.trim()) return state.expenses;
    const q = query.toLowerCase();
    return state.expenses.filter((e) => {
      const composite = [
        e.description,
        projectById[e.projectId],
        categoryById[e.categoryId],
        e.vendorId ? vendorById[e.vendorId] : "",
        e.invoiceNumber ?? "",
        e.paymentMethod ?? "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return composite.includes(q);
    });
  }, [state.expenses, query, projectById, categoryById, vendorById]);

  const total = useMemo(() => filtered.reduce((sum, e) => sum + e.amount + (e.tax ?? 0), 0), [filtered]);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <input
          className="w-64 border rounded-md px-3 py-2"
          placeholder="Search expenses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="text-sm text-gray-600">{filtered.length} items ? Total: ${total.toFixed(2)}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Project</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Vendor</th>
              <th className="text-left p-2">Description</th>
              <th className="text-right p-2">Amount</th>
              <th className="text-right p-2">Tax</th>
              <th className="text-left p-2">Paid</th>
              <th className="text-left p-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-b last:border-none">
                <td className="p-2 whitespace-nowrap">{e.date}</td>
                <td className="p-2 whitespace-nowrap">{projectById[e.projectId] ?? ""}</td>
                <td className="p-2 whitespace-nowrap">{categoryById[e.categoryId] ?? ""}</td>
                <td className="p-2 whitespace-nowrap">{e.vendorId ? vendorById[e.vendorId] : ""}</td>
                <td className="p-2">{e.description}</td>
                <td className="p-2 text-right">${e.amount.toFixed(2)}</td>
                <td className="p-2 text-right">{e.tax != null ? `$${e.tax.toFixed(2)}` : "?"}</td>
                <td className="p-2">{e.paid ? "Yes" : "No"}</td>
                <td className="p-2 text-right">
                  <button
                    onClick={() => deleteExpense(e.id)}
                    className="text-red-600 hover:underline"
                    aria-label="Delete expense"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
