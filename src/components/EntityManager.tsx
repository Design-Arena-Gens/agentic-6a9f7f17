"use client";

import { useHelpers } from "@/context/AppStateContext";
import { useState } from "react";
import { Category, Project, Vendor } from "@/lib/types";

export default function EntityManager({ mode }: { mode: "projects" | "categories" | "vendors" }) {
  const helpers = useHelpers();

  if (mode === "projects") return <ProjectsManager />;
  if (mode === "categories") return <CategoriesManager />;
  return <VendorsManager />;
}

function ProjectsManager() {
  const { state, addProject, updateProject, deleteProject } = useHelpers();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [budget, setBudget] = useState("");

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addProject({ name: name.trim(), code: code.trim() || undefined, budget: budget ? Number(budget) : undefined, active: true });
    setName("");
    setCode("");
    setBudget("");
  }

  return (
    <div>
      <form onSubmit={onAdd} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input className="border rounded-md px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border rounded-md px-3 py-2" placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <input className="border rounded-md px-3 py-2" type="number" step="0.01" placeholder="Budget" value={budget} onChange={(e) => setBudget(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Add Project</button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Code</th>
              <th className="text-right p-2">Budget</th>
              <th className="text-left p-2">Active</th>
              <th className="text-right p-2"></th>
            </tr>
          </thead>
          <tbody>
            {state.projects.map((p) => (
              <tr key={p.id} className="border-b last:border-none">
                <td className="p-2">
                  <InlineEdit value={p.name} onChange={(v) => updateProject({ ...p, name: v })} />
                </td>
                <td className="p-2">
                  <InlineEdit value={p.code ?? ""} onChange={(v) => updateProject({ ...p, code: v || undefined })} />
                </td>
                <td className="p-2 text-right">
                  <InlineEdit value={p.budget != null ? String(p.budget) : ""} onChange={(v) => updateProject({ ...p, budget: v ? Number(v) : undefined })} type="number" />
                </td>
                <td className="p-2">
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={p.active} onChange={(e) => updateProject({ ...p, active: e.target.checked })} /> Active</label>
                </td>
                <td className="p-2 text-right">
                  <button className="text-red-600 hover:underline" onClick={() => deleteProject(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoriesManager() {
  const { state, addCategory, updateCategory, deleteCategory } = useHelpers();
  const [name, setName] = useState("");

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addCategory({ name: name.trim() });
    setName("");
  }

  return (
    <div>
      <form onSubmit={onAdd} className="flex gap-3 mb-4">
        <input className="border rounded-md px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Add Category</button>
      </form>
      <ul className="divide-y border rounded-md">
        {state.categories.map((c) => (
          <li key={c.id} className="p-3 flex items-center justify-between">
            <InlineEdit value={c.name} onChange={(v) => updateCategory({ ...c, name: v })} />
            <button className="text-red-600 hover:underline" onClick={() => deleteCategory(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VendorsManager() {
  const { state, addVendor, updateVendor, deleteVendor } = useHelpers();
  const [name, setName] = useState("");

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addVendor({ name: name.trim() });
    setName("");
  }

  return (
    <div>
      <form onSubmit={onAdd} className="flex gap-3 mb-4">
        <input className="border rounded-md px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Add Vendor</button>
      </form>
      <ul className="divide-y border rounded-md">
        {state.vendors.map((v) => (
          <li key={v.id} className="p-3 flex items-center justify-between">
            <InlineEdit value={v.name} onChange={(val) => updateVendor({ ...v, name: val })} />
            <button className="text-red-600 hover:underline" onClick={() => deleteVendor(v.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InlineEdit({ value, onChange, type = "text" }: { value: string; onChange: (v: string) => void; type?: string }) {
  const [local, setLocal] = useState(value);
  return (
    <input
      className="border rounded-md px-3 py-2 w-full"
      type={type}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => onChange(local)}
    />
  );
}
