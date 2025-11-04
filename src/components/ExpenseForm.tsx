"use client";

import { useState, useMemo } from "react";
import { Expense } from "@/lib/types";
import { useHelpers } from "@/context/AppStateContext";

interface Props {
  initial?: Expense;
  onSubmitted?: () => void;
}

export default function ExpenseForm({ initial, onSubmitted }: Props) {
  const { state, addExpense, updateExpense } = useHelpers();

  const [date, setDate] = useState<string>(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [projectId, setProjectId] = useState<string>(initial?.projectId ?? (state.projects[0]?.id ?? ""));
  const [categoryId, setCategoryId] = useState<string>(initial?.categoryId ?? (state.categories[0]?.id ?? ""));
  const [vendorId, setVendorId] = useState<string | undefined>(initial?.vendorId ?? state.vendors[0]?.id);
  const [description, setDescription] = useState<string>(initial?.description ?? "");
  const [amount, setAmount] = useState<string>(initial ? String(initial.amount) : "");
  const [tax, setTax] = useState<string>(initial?.tax != null ? String(initial.tax) : "");
  const [invoiceNumber, setInvoiceNumber] = useState<string>(initial?.invoiceNumber ?? "");
  const [paid, setPaid] = useState<boolean>(initial?.paid ?? false);
  const [paymentMethod, setPaymentMethod] = useState<string>(initial?.paymentMethod ?? "");

  const canSubmit = useMemo(() => {
    return Boolean(date && projectId && categoryId && description && amount !== "");
  }, [date, projectId, categoryId, description, amount]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const payload = {
      date,
      projectId,
      categoryId,
      vendorId: vendorId || undefined,
      description: description.trim(),
      amount: Number(amount),
      tax: tax === "" ? undefined : Number(tax),
      invoiceNumber: invoiceNumber.trim() || undefined,
      paid,
      paymentMethod: paymentMethod.trim() || undefined,
    };

    if (initial) {
      updateExpense({ id: initial.id, ...payload });
    } else {
      addExpense(payload);
    }
    onSubmitted?.();
    if (!initial) {
      setDescription("");
      setAmount("");
      setTax("");
      setInvoiceNumber("");
      setPaid(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium">Date</label>
        <input type="date" className="mt-1 w-full border rounded-md px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Project</label>
        <select className="mt-1 w-full border rounded-md px-3 py-2" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
          {state.projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Category</label>
        <select className="mt-1 w-full border rounded-md px-3 py-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {state.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Vendor</label>
        <select className="mt-1 w-full border rounded-md px-3 py-2" value={vendorId || ""} onChange={(e) => setVendorId(e.target.value || undefined)}>
          <option value="">?</option>
          {state.vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <input className="mt-1 w-full border rounded-md px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input type="number" step="0.01" className="mt-1 w-full border rounded-md px-3 py-2" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Tax</label>
        <input type="number" step="0.01" className="mt-1 w-full border rounded-md px-3 py-2" value={tax} onChange={(e) => setTax(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Invoice #</label>
        <input className="mt-1 w-full border rounded-md px-3 py-2" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
      </div>
      <div className="flex items-center gap-2 mt-6">
        <input id="paid" type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} />
        <label htmlFor="paid">Paid</label>
      </div>
      <div>
        <label className="block text-sm font-medium">Payment Method</label>
        <input className="mt-1 w-full border rounded-md px-3 py-2" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
      </div>
      <div className="md:col-span-3">
        <button disabled={!canSubmit} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50">
          {initial ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}
