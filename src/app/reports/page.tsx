"use client";

import { useMemo, useState } from "react";
import { useHelpers } from "@/context/AppStateContext";
import { expensesToCsv, triggerDownload } from "@/lib/csv";

export default function ReportsPage() {
  const { state } = useHelpers();
  const [projectId, setProjectId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paid, setPaid] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return state.expenses.filter((e) => {
      if (projectId && e.projectId !== projectId) return false;
      if (categoryId && e.categoryId !== categoryId) return false;
      if (paid === "yes" && !e.paid) return false;
      if (paid === "no" && e.paid) return false;
      if (from && e.date < from) return false;
      if (to && e.date > to) return false;
      return true;
    });
  }, [state.expenses, projectId, categoryId, paid, from, to]);

  const total = useMemo(() => filtered.reduce((s, e) => s + e.amount + (e.tax ?? 0), 0), [filtered]);

  function exportFilteredCsv() {
    const csv = expensesToCsv({ ...state, expenses: filtered });
    triggerDownload("report.csv", csv, "text/csv;charset=utf-8");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>

      <div className="rounded-lg border bg-white p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select className="border rounded-md px-3 py-2" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">All Projects</option>
            {state.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select className="border rounded-md px-3 py-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">All Categories</option>
            {state.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select className="border rounded-md px-3 py-2" value={paid} onChange={(e) => setPaid(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="yes">Paid</option>
            <option value="no">Unpaid</option>
          </select>

          <input className="border rounded-md px-3 py-2" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input className="border rounded-md px-3 py-2" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">{filtered.length} expenses ? Total ${total.toFixed(2)}</div>
          <button onClick={exportFilteredCsv} className="ml-auto px-3 py-2 border rounded-md bg-white">
            Export Filtered CSV
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 overflow-x-auto">
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
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-b last:border-none">
                <td className="p-2 whitespace-nowrap">{e.date}</td>
                <td className="p-2 whitespace-nowrap">{state.projects.find((p) => p.id === e.projectId)?.name ?? ""}</td>
                <td className="p-2 whitespace-nowrap">{state.categories.find((c) => c.id === e.categoryId)?.name ?? ""}</td>
                <td className="p-2 whitespace-nowrap">{e.vendorId ? state.vendors.find((v) => v.id === e.vendorId)?.name : ""}</td>
                <td className="p-2">{e.description}</td>
                <td className="p-2 text-right">${e.amount.toFixed(2)}</td>
                <td className="p-2 text-right">{e.tax != null ? `$${e.tax.toFixed(2)}` : "?"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
