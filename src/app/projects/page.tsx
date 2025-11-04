"use client";

import EntityManager from "@/components/EntityManager";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <div className="rounded-lg border bg-white p-4">
        <EntityManager mode="projects" />
      </div>
    </div>
  );
}
