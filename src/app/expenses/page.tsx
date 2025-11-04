"use client";

import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import { expensesToCsv, triggerDownload } from "@/lib/csv";
import { useHelpers } from "@/context/AppStateContext";

export default function ExpensesPage() {
  const { state, importAll, resetDemo } = useHelpers();

  function onExportCsv() {
    const csv = expensesToCsv(state);
    triggerDownload("expenses.csv", csv, "text/csv;charset=utf-8");
  }

  function onExportJson() {
    const content = JSON.stringify(state, null, 2);
    triggerDownload("data.json", content, "application/json");
  }

  function onImportJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        importAll(parsed);
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.currentTarget.value = "";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={onExportCsv} className="px-3 py-2 border rounded-md bg-white">Export CSV</button>
          <button onClick={onExportJson} className="px-3 py-2 border rounded-md bg-white">Export JSON</button>
          <label className="px-3 py-2 border rounded-md bg-white cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={onImportJson} />
          </label>
          <button onClick={resetDemo} className="px-3 py-2 border rounded-md bg-white">Reset Demo Data</button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="text-lg font-medium mb-3">Add Expense</div>
        <ExpenseForm />
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="text-lg font-medium">All Expenses</div>
        <ExpenseTable />
      </div>
    </div>
  );
}
