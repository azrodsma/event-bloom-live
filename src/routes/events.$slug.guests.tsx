import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Search, UserPlus, Check, Clock, X, Mail, Users } from "lucide-react";
import { findEvent } from "@/lib/mock-data";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/guests")({
  head: ({ params }) => ({
    meta: [
      { title: `Invités — ${params.slug} — Memento Live` },
      { name: "description", content: "Gérez la liste des invités de l'événement." },
    ],
  }),
  loader: ({ params }) => {
    const e = findEvent(params.slug);
    if (!e) throw notFound();
    return { event: e };
  },
  component: Guests,
});

type Status = "confirmed" | "pending" | "declined";

type Guest = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: Status;
  plusOne: number;
  table?: string;
};

const guests: Guest[] = [
  { id: "1", name: "Marie Laurent", role: "Maman de la mariée", avatar: "https://i.pravatar.cc/80?img=47", status: "confirmed", plusOne: 1, table: "1" },
  { id: "2", name: "Alex Bernard", role: "Ami du marié", avatar: "https://i.pravatar.cc/80?img=12", status: "confirmed", plusOne: 1, table: "4" },
  { id: "3", name: "Emma Petit", role: "Témoin", avatar: "https://i.pravatar.cc/80?img=25", status: "confirmed", plusOne: 0, table: "2" },
  { id: "4", name: "Julien Roux", role: "Cousin", avatar: "https://i.pravatar.cc/80?img=15", status: "pending", plusOne: 2 },
  { id: "5", name: "Grand-mère Rose", role: "Famille", avatar: "https://i.pravatar.cc/80?img=32", status: "confirmed", plusOne: 0, table: "1" },
  { id: "6", name: "Sofia Nakamura", role: "Amie d'enfance", avatar: "https://i.pravatar.cc/80?img=44", status: "pending", plusOne: 1 },
  { id: "7", name: "Marc Delacroix", role: "Collègue", avatar: "https://i.pravatar.cc/80?img=11", status: "declined", plusOne: 0 },
  { id: "8", name: "Chloé Fontaine", role: "Amie", avatar: "https://i.pravatar.cc/80?img=48", status: "confirmed", plusOne: 1, table: "3" },
  { id: "9", name: "Yanis Belkacem", role: "Ami", avatar: "https://i.pravatar.cc/80?img=13", status: "confirmed", plusOne: 0, table: "3" },
  { id: "10", name: "Léa Moreau", role: "Cousine", avatar: "https://i.pravatar.cc/80?img=49", status: "pending", plusOne: 0 },
];

const statusMeta: Record<Status, { label: string; className: string; icon: typeof Check }> = {
  confirmed: { label: "Confirmé", className: "bg-success/15 text-success", icon: Check },
  pending: { label: "En attente", className: "bg-gold/15 text-gold", icon: Clock },
  declined: { label: "Décliné", className: "bg-danger/15 text-danger", icon: X },
};

const filters = [
  { key: "all", label: "Tous" },
  { key: "confirmed", label: "Confirmés" },
  { key: "pending", label: "En attente" },
  { key: "declined", label: "Déclinés" },
] as const;

function Guests() {
  const { event } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");

  const counts = useMemo(() => {
    return {
      total: guests.length,
      confirmed: guests.filter((g) => g.status === "confirmed").length,
      pending: guests.filter((g) => g.status === "pending").length,
      declined: guests.filter((g) => g.status === "declined").length,
      seats: guests.reduce((n, g) => n + 1 + g.plusOne, 0),
    };
  }, []);

  const list = guests.filter((g) => {
    if (filter !== "all" && g.status !== filter) return false;
    if (query && !g.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link
            to="/events/$slug"
            params={{ slug: event.slug }}
            className="grid h-10 w-10 place-items-center rounded-full bg-surface"
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Invités</h1>
            <p className="truncate text-xs text-muted-foreground">{event.title}</p>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-white shadow-glow" aria-label="Ajouter un invité">
            <UserPlus className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-4">
        <section className="grid grid-cols-4 gap-2">
          {[
            { v: counts.total, l: "Invités", c: "text-foreground" },
            { v: counts.confirmed, l: "Confirmés", c: "text-success" },
            { v: counts.pending, l: "En attente", c: "text-gold" },
            { v: counts.seats, l: "Sièges", c: "text-primary" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-surface p-3 text-center shadow-card">
              <div className={`font-serif text-2xl ${s.c}`}>{s.v}</div>
              <div className="text-[10px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-gradient-primary p-4 text-white shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-lg">Réponses reçues</p>
              <p className="text-xs text-white/80">{counts.confirmed + counts.declined} / {counts.total} invités</p>
            </div>
            <button className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-primary">
              <Mail className="h-3.5 w-3.5" /> Relancer
            </button>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${((counts.confirmed + counts.declined) / counts.total) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 shadow-card">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un invité…"
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === f.key ? "bg-primary text-white shadow-glow" : "bg-surface text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {list.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-surface p-8 text-center">
              <Users className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 font-serif text-lg">Aucun invité</p>
              <p className="text-xs text-muted-foreground">Aucun résultat pour ce filtre.</p>
            </div>
          ) : (
            list.map((g) => {
              const s = statusMeta[g.status];
              const Icon = s.icon;
              return (
                <div key={g.id} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-card">
                  <img src={g.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{g.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {g.role}
                      {g.plusOne > 0 && ` · +${g.plusOne}`}
                      {g.table && ` · Table ${g.table}`}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${s.className}`}>
                    <Icon className="h-3 w-3" /> {s.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
