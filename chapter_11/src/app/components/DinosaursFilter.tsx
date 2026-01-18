"use client";

import { useEffect, useState } from "react";
import type { Dino } from "../types";

export function DinosaursFilter() {
  const [query, setQuery] = useState("");
  const [dinosaurs, setDinosaurs] = useState<Dino[]>([]);

  useEffect(() => {
    async function loadDinosaurs() {
      const response = await fetch("/api/dinosaurs");
      if (!response.ok) {
        console.error("Failed to fetch dinosaurs");
        return;
      }
      const data = (await response.json()) as Dino[];
      setDinosaurs(data);
    }

    void loadDinosaurs();
  }, []);

  const filtered = dinosaurs.filter((dino) =>
    dino.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          placeholder="Filter by name..."
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
        />
      </div>

      <ul className="space-y-1 text-sm text-slate-200">
        {filtered.map((dino) => (
          <li key={dino.name}>{dino.name}</li>
        ))}
      </ul>
    </section>
  );
}

