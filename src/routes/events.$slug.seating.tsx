import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, Users, UtensilsCrossed, Trash2, LogIn } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventBySlug } from "@/lib/events.functions";
import { adaptEvent } from "@/lib/event-adapter";
import { listSeating, createTable, deleteTable, assignGuest } from "@/lib/seating.functions";
import { useAuth } from "@/hooks/use-auth";
import { findEvent } from "@/lib/mock-data";

export const Route = createFileRoute("/events/$slug/seating")({
  head: ({ params }) => ({
    meta: [
      { title: `Plan de table · ${params.slug} — Memento Live` },
      { name: "description", content: "Organisez visuellement vos tables et attribuez chaque invité à sa place." },
      { property: "og:title", content: "Plan de table · Memento Live" },
      { property: "og:description", content: "Composez visuellement votre plan de table." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ params }) => {
    const db = await getEventBySlug({ data: { slug: params.slug } });
    if (!db) {
      const e = findEvent(params.slug);
      if (!e) throw notFound();
      return { event: e, dbId: null as string | null };
    }
    return { event: adaptEvent(db), dbId: db.id };
  },
  component: Seating,
});

type Guest = { id: string; full_name: string; dietary: string | null; table_number: number | null; rsvp: string; plus_ones: number };
type TableRow = { id: string; table_number: number; label: string | null; capacity: number };

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function Seating() {
  const { dbId } = Route.useLoaderData();
  const { slug } = useParams({ from: "/events/$slug/seating" });
  const { user } = useAuth();
  const qc = useQueryClient();
  const list = useServerFn(listSeating);
  const addTable = useServerFn(createTable);
  const removeTable = useServerFn(deleteTable);
  const assign = useServerFn(assignGuest);

  const { data } = useQuery({
    queryKey: ["seating", dbId],
    queryFn: () =>
      dbId
        ? list({ data: { eventId: dbId } })
        : Promise.resolve({ tables: [] as TableRow[], guests: [] as Guest[] }),
    enabled: !!dbId,
  });

  const tables = (data?.tables ?? []) as TableRow[];
  const guests = (data?.guests ?? []) as Guest[];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = tables.find((t) => t.id === selectedId) ?? tables[0] ?? null;
  const [form, setForm] = useState({ label: "", capacity: "8" });
  const [busy, setBusy] = useState(false);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["seating", dbId] });

  const seatedByTable = (n: number) => guests.filter((g) => g.table_number === n);
  const unassigned = guests.filter((g) => g.table_number == null);
  const totalSeated = guests.filter((g) => g.table_number != null).length;
  const totalCapacity = tables.reduce((a, t) => a + t.capacity, 0);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!dbId) return;
    setBusy(true);
    try {
      const next = (tables.reduce((m, t) => Math.max(m, t.table_number), 0) || 0) + 1;
      await addTable({
        data: {
          eventId: dbId,
          tableNumber: next,
          label: form.label.trim() || `Table ${next}`,
          capacity: Math.max(1, Number(form.capacity) || 8),
        },
      });
      setForm({ label: "", capacity: "8" });
      await invalidate();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Plan de table</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Users className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="grid grid-cols-3 gap-3 border-b border-border/60 bg-secondary/40 px-4 py-4 text-center">
        <div>
          <p className="font-serif text-2xl leading-none">{tables.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tables</p>
        </div>
        <div>
          <p className="font-serif text-2xl leading-none">
            {totalSeated}
            <span className="text-muted-foreground">/{totalCapacity || "—"}</span>
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Placés</p>
        </div>
        <div>
          <p className="font-serif text-2xl leading-none text-primary">{unassigned.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sans table</p>
        </div>
      </section>

      {user && dbId ? (
        <form onSubmit={onCreate} className="mx-4 mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card p-3">
          <input
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="Nom de la table (ex. Amis)"
            className="min-w-0 flex-1 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={1}
            max={30}
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            className="w-20 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm"
            aria-label="Capacité"
          />
          <button
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Nouvelle table
          </button>
        </form>
      ) : !user ? (
        <div className="mx-4 mt-4 flex items-center justify-between rounded-2xl border border-dashed border-border/60 p-4 text-sm">
          <span className="text-muted-foreground">Connectez-vous pour gérer les tables.</span>
          <Link to="/auth" className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"><LogIn className="h-3 w-3" /> Se connecter</Link>
        </div>
      ) : null}

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-serif text-lg">Salle de réception</h2>
        {tables.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
            Aucune table pour l'instant. {user ? "Créez la première ci-dessus." : ""}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tables.map((t) => {
              const seated = seatedByTable(t.table_number).length;
              const percent = Math.round((seated / t.capacity) * 100);
              const active = (selected?.id ?? tables[0].id) === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`group relative flex flex-col items-center gap-2 rounded-3xl border-2 p-4 transition-all ${
                    active ? "border-primary bg-primary/5 shadow-glow" : "border-border/60 bg-card hover:border-primary/40"
                  }`}
                >
                  <div className={`grid h-24 w-24 place-items-center rounded-full border-2 border-dashed ${active ? "border-primary" : "border-border"}`}>
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-accent/40 to-primary/20 font-serif text-lg">
                      {seated}
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">/{t.capacity}</span>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-center text-xs font-medium leading-tight">
                    {t.label ?? `Table ${t.table_number}`}
                  </p>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full ${percent >= 100 ? "bg-danger" : "bg-primary"}`} style={{ width: `${Math.min(percent, 100)}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {selected && (
        <section className="mt-8 border-t border-border/60 px-4 pt-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl">{selected.label ?? `Table ${selected.table_number}`}</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {seatedByTable(selected.table_number).length}/{selected.capacity}
              </span>
              {user && (
                <button
                  onClick={async () => {
                    if (!confirm("Supprimer cette table ? Les invités seront libérés.")) return;
                    await removeTable({ data: { id: selected.id, eventId: dbId!, tableNumber: selected.table_number } });
                    setSelectedId(null);
                    await invalidate();
                  }}
                  className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
                  aria-label="Supprimer la table"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {seatedByTable(selected.table_number).map((g) => (
              <li key={g.id} className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-[10px] font-semibold">
                  {initials(g.full_name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{g.full_name}</p>
                  {g.dietary && (
                    <p className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <UtensilsCrossed className="h-2.5 w-2.5" /> {g.dietary}
                    </p>
                  )}
                </div>
                {user && (
                  <button
                    onClick={async () => {
                      await assign({ data: { guestId: g.id, tableNumber: null } });
                      await invalidate();
                    }}
                    className="text-[10px] text-muted-foreground hover:text-primary"
                  >
                    Libérer
                  </button>
                )}
              </li>
            ))}
            {Array.from({ length: Math.max(0, selected.capacity - seatedByTable(selected.table_number).length) }).map((_, i) => (
              <li key={`empty-${i}`} className="flex items-center justify-center rounded-2xl border-2 border-dashed border-border/60 px-3 py-2.5 text-[11px] text-muted-foreground">
                Place libre
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 border-t border-border/60 px-4 pt-6">
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="font-serif text-lg">Invités sans table · {unassigned.length}</h2>
        </div>
        {unassigned.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/60 p-4 text-center text-sm text-muted-foreground">
            Tous les invités ont une place attribuée.
          </p>
        ) : (
          <ul className="space-y-2">
            {unassigned.map((g) => (
              <li key={g.id} className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-background p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-semibold">
                  {initials(g.full_name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{g.full_name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {g.rsvp === "confirmed" ? "Confirmé" : g.rsvp === "maybe" ? "Peut-être" : g.rsvp === "declined" ? "Décliné" : "En attente"}
                    {g.dietary ? ` · ${g.dietary}` : ""}
                  </p>
                </div>
                {user && tables.length > 0 ? (
                  <select
                    defaultValue=""
                    onChange={async (e) => {
                      const n = Number(e.target.value);
                      if (!Number.isFinite(n)) return;
                      await assign({ data: { guestId: g.id, tableNumber: n } });
                      await invalidate();
                    }}
                    className="rounded-full border border-border/60 bg-background px-3 py-1.5 text-[11px]"
                  >
                    <option value="" disabled>Placer…</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.table_number}>
                        {t.label ?? `Table ${t.table_number}`} ({seatedByTable(t.table_number).length}/{t.capacity})
                      </option>
                    ))}
                  </select>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
