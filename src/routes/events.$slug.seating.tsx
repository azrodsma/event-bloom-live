import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, Users, UtensilsCrossed, Baby, Wine, Wheat } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/seating")({
  component: Seating,
  head: () => ({
    meta: [
      { title: "Plan de table · Memento Live" },
      { name: "description", content: "Organisez visuellement vos tables et attribuez chaque invité à sa place." },
      { property: "og:title", content: "Plan de table · Memento Live" },
      { property: "og:description", content: "Composez visuellement votre plan de table." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Diet = "std" | "veg" | "sansGluten" | "enfant";

interface Guest {
  id: string;
  name: string;
  diet: Diet;
}

interface TableData {
  id: string;
  name: string;
  capacity: number;
  guests: Guest[];
}

const dietMeta: Record<Diet, { label: string; icon: typeof UtensilsCrossed; className: string }> = {
  std: { label: "Standard", icon: UtensilsCrossed, className: "text-muted-foreground" },
  veg: { label: "Végétarien", icon: Wheat, className: "text-primary" },
  sansGluten: { label: "Sans gluten", icon: Wine, className: "text-accent-foreground" },
  enfant: { label: "Enfant", icon: Baby, className: "text-primary" },
};

const initialTables: TableData[] = [
  {
    id: "th",
    name: "Table d'honneur",
    capacity: 10,
    guests: [
      { id: "g1", name: "Sarah Bernard", diet: "std" },
      { id: "g2", name: "Thomas Bernard", diet: "std" },
      { id: "g3", name: "Camille Rousseau", diet: "veg" },
      { id: "g4", name: "Julien Mercier", diet: "std" },
      { id: "g5", name: "Nadia Ouali", diet: "sansGluten" },
      { id: "g6", name: "Antoine Kessler", diet: "std" },
    ],
  },
  {
    id: "t1",
    name: "Table 1 · Famille de Sarah",
    capacity: 8,
    guests: [
      { id: "g7", name: "Isabelle Bernard", diet: "std" },
      { id: "g8", name: "Marc Bernard", diet: "std" },
      { id: "g9", name: "Emma Bernard", diet: "enfant" },
      { id: "g10", name: "Lucas Bernard", diet: "enfant" },
      { id: "g11", name: "Céline Aubry", diet: "veg" },
    ],
  },
  {
    id: "t2",
    name: "Table 2 · Famille de Thomas",
    capacity: 8,
    guests: [
      { id: "g12", name: "Michel Durand", diet: "std" },
      { id: "g13", name: "Françoise Durand", diet: "sansGluten" },
      { id: "g14", name: "Léa Durand", diet: "std" },
      { id: "g15", name: "Adrien Durand", diet: "std" },
    ],
  },
  {
    id: "t3",
    name: "Table 3 · Amis d'enfance",
    capacity: 8,
    guests: [
      { id: "g16", name: "Paul Vasseur", diet: "std" },
      { id: "g17", name: "Mathilde Roux", diet: "veg" },
      { id: "g18", name: "Yanis Belkacem", diet: "std" },
      { id: "g19", name: "Sofia Marchetti", diet: "std" },
      { id: "g20", name: "Hugo Prévost", diet: "std" },
      { id: "g21", name: "Alice Perrin", diet: "veg" },
      { id: "g22", name: "Théo Lambert", diet: "std" },
      { id: "g23", name: "Manon Lefèvre", diet: "std" },
    ],
  },
  {
    id: "t4",
    name: "Table 4 · Collègues",
    capacity: 8,
    guests: [
      { id: "g24", name: "Karim Sabri", diet: "std" },
      { id: "g25", name: "Julie Torres", diet: "veg" },
      { id: "g26", name: "Ben Halloun", diet: "std" },
    ],
  },
];

const unassigned: Guest[] = [
  { id: "u1", name: "Marie-Ange Colin", diet: "std" },
  { id: "u2", name: "Fabien Roques", diet: "std" },
  { id: "u3", name: "Anna Petit", diet: "enfant" },
  { id: "u4", name: "Salomé Ferrer", diet: "veg" },
];

function TableCard({ table, active, onSelect }: { table: TableData; active: boolean; onSelect: () => void }) {
  const percent = Math.round((table.guests.length / table.capacity) * 100);
  return (
    <button
      onClick={onSelect}
      className={`group relative flex flex-col items-center gap-2 rounded-3xl border-2 p-4 transition-all ${
        active
          ? "border-primary bg-primary/5 shadow-glow"
          : "border-border/60 bg-card hover:border-primary/40"
      }`}
    >
      <div className="relative">
        <div className={`grid h-24 w-24 place-items-center rounded-full border-2 border-dashed ${active ? "border-primary" : "border-border"}`}>
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-accent/40 to-primary/20 font-serif text-lg">
            {table.guests.length}
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">/{table.capacity}</span>
          </div>
        </div>
      </div>
      <p className="line-clamp-2 text-center text-xs font-medium leading-tight">{table.name}</p>
      <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div className={`h-full ${percent >= 100 ? "bg-danger" : "bg-primary"}`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
    </button>
  );
}

function Seating() {
  const { slug } = useParams({ from: "/events/$slug/seating" });
  const [tables] = useState(initialTables);
  const [selectedId, setSelectedId] = useState(initialTables[0].id);
  const selected = tables.find((t) => t.id === selectedId) ?? tables[0];

  const totalSeated = tables.reduce((acc, t) => acc + t.guests.length, 0);
  const totalCapacity = tables.reduce((acc, t) => acc + t.capacity, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Plan de table</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Nouvelle table">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <section className="grid grid-cols-3 gap-3 border-b border-border/60 bg-secondary/40 px-4 py-4 text-center">
        <div>
          <p className="font-serif text-2xl leading-none">{tables.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tables</p>
        </div>
        <div>
          <p className="font-serif text-2xl leading-none">{totalSeated}<span className="text-muted-foreground">/{totalCapacity}</span></p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Placés</p>
        </div>
        <div>
          <p className="font-serif text-2xl leading-none text-primary">{unassigned.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sans table</p>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-serif text-lg">Salle de réception</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {tables.map((t) => (
            <TableCard key={t.id} table={t} active={t.id === selectedId} onSelect={() => setSelectedId(t.id)} />
          ))}
          <button className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border p-4 text-muted-foreground hover:border-primary hover:text-primary">
            <Plus className="h-6 w-6" />
            <span className="text-xs font-medium">Nouvelle table</span>
          </button>
        </div>
      </section>

      <section className="mt-8 border-t border-border/60 px-4 pt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-xl">{selected.name}</h2>
          <span className="text-xs text-muted-foreground">{selected.guests.length}/{selected.capacity}</span>
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {selected.guests.map((g) => {
            const meta = dietMeta[g.diet];
            const Icon = meta.icon;
            return (
              <li key={g.id} className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-[10px] font-semibold">
                  {g.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{g.name}</p>
                  <p className={`inline-flex items-center gap-1 text-[10px] ${meta.className}`}>
                    <Icon className="h-2.5 w-2.5" /> {meta.label}
                  </p>
                </div>
              </li>
            );
          })}
          {Array.from({ length: Math.max(0, selected.capacity - selected.guests.length) }).map((_, i) => (
            <li key={`empty-${i}`} className="flex items-center justify-center rounded-2xl border-2 border-dashed border-border/60 px-3 py-2.5 text-[11px] text-muted-foreground">
              Place libre
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 border-t border-border/60 px-4 pt-6">
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="font-serif text-lg">Invités sans table · {unassigned.length}</h2>
        </div>
        <ul className="space-y-2">
          {unassigned.map((g) => {
            const meta = dietMeta[g.diet];
            const Icon = meta.icon;
            return (
              <li key={g.id} className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-background p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-semibold">
                  {g.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{g.name}</p>
                  <p className={`inline-flex items-center gap-1 text-[10px] ${meta.className}`}>
                    <Icon className="h-2.5 w-2.5" /> {meta.label}
                  </p>
                </div>
                <button className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
                  Placer
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
