"use client";

import EntityManager from "@/components/EntityManager";

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Vendors</h1>
      <div className="rounded-lg border bg-white p-4">
        <EntityManager mode="vendors" />
      </div>
    </div>
  );
}
