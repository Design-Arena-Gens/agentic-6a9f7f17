"use client";

import { useMemo } from "react";
import { useAppState } from "@/context/AppStateContext";

export default function Home() {
  const { state } = useAppState();

  const totals = useMemo(() => {
    const total = state.expenses.reduce((s, e) => s + e.amount + (e.tax ?? 0), 0);
    const byProject = new Map<string, number>();
    for (const e of state.expenses) {
      byProject.set(e.projectId, (byProject.get(e.projectId) ?? 0) + e.amount + (e.tax ?? 0));
    }
    return { total, byProject };
  }, [state.expenses]);

  const projectById = useMemo(() => Object.fromEntries(state.projects.map((p) => [p.id, p.name])), [state.projects]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-gray-500">Total Spend</div>
          <div className="text-2xl font-bold mt-1">${totals.total.toFixed(2)}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-gray-500">Projects</div>
          <div className="text-2xl font-bold mt-1">{state.projects.length}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-gray-500">Expenses</div>
          <div className="text-2xl font-bold mt-1">{state.expenses.length}</div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="text-lg font-medium mb-2">Spend by Project</div>
        <ul className="divide-y">
          {Array.from(totals.byProject.entries()).map(([pid, amt]) => (
            <li key={pid} className="py-2 flex items-center justify-between">
              <span>{projectById[pid] ?? pid}</span>
              <span className="font-medium">${amt.toFixed(2)}</span>
            </li>
          ))}
          {totals.byProject.size === 0 && <li className="py-2 text-gray-500">No expenses yet</li>}
        </ul>
      </div>
    </div>
  );
}
