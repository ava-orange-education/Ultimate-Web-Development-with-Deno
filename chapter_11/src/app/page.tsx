import type { Dino } from "./types";

async function fetchDinosaurs(): Promise<Dino[]> {
  const response = await fetch("http://localhost:3000/api/dinosaurs", {
    // Next.js will automatically treat this as a server-side request
    // when executed in a Server Component.
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Failed to fetch dinosaurs", response.statusText);
    return [];
  }

  const data = (await response.json()) as Dino[];
  return data;
}

export default async function HomePage() {
  const dinosaurs = await fetchDinosaurs();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Dinosaurs catalog
        </h2>
        <p className="max-w-2xl text-sm text-slate-300">
          This simple catalog demonstrates how to build a full stack Next.js
          application running on top of the Deno 2.x runtime. The frontend and
          backend live in the same project, sharing types and business rules.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dinosaurs.map((dino) => (
          <article
            key={dino.name}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition hover:border-emerald-400/80"
          >
            <h3 className="text-lg font-semibold text-emerald-300">
              {dino.name}
            </h3>
            <p className="mt-2 text-sm text-slate-200">{dino.description}</p>

            <dl className="mt-3 space-y-1 text-xs text-slate-400">
              <div className="flex justify-between">
                <dt className="font-medium text-slate-300">Era</dt>
                <dd>{dino.era}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-slate-300">Diet</dt>
                <dd className="capitalize">{dino.diet}</dd>
              </div>
            </dl>

            <div className="mt-4">
              <a
                href={`/dinosaurs/${encodeURIComponent(dino.name)}`}
                className="text-xs font-medium text-emerald-300 hover:text-emerald-200 underline underline-offset-2"
              >
                View details
              </a>
            </div>
          </article>
        ))}

        {dinosaurs.length === 0 && (
          <p className="text-sm text-red-400">
            No dinosaurs found. Make sure the API is running correctly.
          </p>
        )}
      </div>
    </section>
  );
}

