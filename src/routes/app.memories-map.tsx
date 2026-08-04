import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Sparkles, Compass, Plane, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/memories-map")({
  component: MemoriesMap,
  head: () => ({
    meta: [
      { title: "Carte des souvenirs · MaFeliza" },
      { name: "description", content: "Toutes les villes et pays où vous avez célébré, réunis sur une même carte." },
      { property: "og:title", content: "Carte des souvenirs · MaFeliza" },
      { property: "og:description", content: "Le monde vu à travers vos moments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Pin = {
  id: string;
  city: string;
  country: string;
  count: number;
  x: number; // % of container
  y: number; // % of container
  size: "sm" | "md" | "lg";
  emoji: string;
  latest: string;
};

const pins: Pin[] = [
  { id: "p1", city: "Provence", country: "France", count: 5, x: 50, y: 42, size: "lg", emoji: "💒", latest: "Mariage Sarah & Thomas" },
  { id: "p2", city: "Paris", country: "France", count: 8, x: 48, y: 32, size: "lg", emoji: "🎂", latest: "30 ans de Clara" },
  { id: "p3", city: "Lyon", country: "France", count: 3, x: 51, y: 37, size: "md", emoji: "👶", latest: "Baptême Gabriel" },
  { id: "p4", city: "Marrakech", country: "Maroc", count: 2, x: 43, y: 56, size: "md", emoji: "💍", latest: "Fiançailles Noor & Adam" },
  { id: "p5", city: "Rome", country: "Italie", count: 1, x: 55, y: 44, size: "sm", emoji: "🥂", latest: "EVJF Léa" },
  { id: "p6", city: "New York", country: "USA", count: 2, x: 22, y: 38, size: "md", emoji: "🎓", latest: "Diplôme Lucas" },
  { id: "p7", city: "Tokyo", country: "Japon", count: 1, x: 82, y: 42, size: "sm", emoji: "🌸", latest: "Voyage de noces" },
  { id: "p8", city: "Bali", country: "Indonésie", count: 1, x: 78, y: 62, size: "sm", emoji: "🏖️", latest: "Baby-moon Emma" },
];

const stats = [
  { label: "Pays", value: 7 },
  { label: "Villes", value: 12 },
  { label: "Événements", value: 23 },
  { label: "Km parcourus", value: "48 200" },
];

const topCities = [...pins].sort((a, b) => b.count - a.count).slice(0, 4);

const sizeMap = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };
const ringMap = { sm: "h-5 w-5", md: "h-7 w-7", lg: "h-9 w-9" };

function MemoriesMap() {
  const [selected, setSelected] = useState<Pin | null>(pins[0]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Carte des souvenirs</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Filtres">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Compass className="h-3.5 w-3.5 text-primary" /> Votre atlas personnel
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Le monde vu à<br />travers vos moments</h1>
      </section>

      <section className="mx-4">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-sky-50 via-accent/30 to-primary/10 p-1">
          <svg
            viewBox="0 0 100 60"
            className="h-64 w-full"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            {/* stylised continents blobs */}
            <g fill="currentColor" className="text-foreground/8">
              <path d="M8 20 Q14 12 26 14 T44 18 T54 26 T48 36 T30 40 T14 34 Z" />
              <path d="M56 12 Q66 8 78 14 T90 22 T86 34 T72 38 T60 30 Z" />
              <path d="M20 42 Q28 44 34 50 T30 56 T22 54 T18 48 Z" />
              <path d="M62 44 Q72 46 78 52 T74 58 T66 56 T62 50 Z" />
              <path d="M82 42 Q92 44 96 50 T92 56 T84 54 Z" />
            </g>
            <g stroke="currentColor" strokeWidth="0.15" className="text-foreground/12" fill="none">
              <path d="M0 15 Q50 12 100 18" />
              <path d="M0 30 Q50 32 100 28" />
              <path d="M0 45 Q50 48 100 42" />
            </g>
          </svg>

          {/* Pins */}
          {pins.map((p) => {
            const active = selected?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                aria-label={p.city}
              >
                <span className={`absolute -inset-0 rounded-full bg-primary/20 ${active ? "animate-ping" : ""}`} />
                <span
                  className={`relative grid place-items-center rounded-full ring-2 ring-white transition-all ${ringMap[p.size]} ${
                    active ? "bg-primary shadow-glow" : "bg-foreground"
                  }`}
                >
                  <MapPin className={`${sizeMap[p.size]} text-white`} />
                </span>
                {active && (
                  <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[9px] font-bold text-background">
                    {p.city} · {p.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-2xl">{selected.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {selected.city}, {selected.country}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {selected.count} événement{selected.count > 1 ? "s" : ""} · Dernier : {selected.latest}
              </p>
            </div>
            <button className="rounded-full bg-foreground px-3 py-1.5 text-[11px] font-bold text-background">Explorer</button>
          </div>
        )}
      </section>

      <section className="mx-4 mt-6 grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card p-3 text-center ring-1 ring-border/60">
            <p className="font-serif text-xl">{s.value}</p>
            <p className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Villes phares</p>
        <ul className="mt-3 space-y-2">
          {topCities.map((c, i) => (
            <li key={c.id}>
              <button
                onClick={() => setSelected(c)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 text-left"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-serif text-sm">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {c.city} <span className="text-[10px] font-normal text-muted-foreground">· {c.country}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground">{c.count} événements</p>
                </div>
                <span className="text-xl">{c.emoji}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-4 mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-accent/40 p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Plane className="h-3.5 w-3.5" /> Prochain voyage
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">
          Bientôt : mariage à<br />
          Lisbonne 🇵🇹
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">Dans 42 jours. Un nouveau pin sera épinglé automatiquement.</p>
      </section>

      <div className="mx-4 mt-6 flex items-center gap-2 rounded-3xl bg-secondary/40 p-4 text-[11px] text-muted-foreground">
        <Sparkles className="h-4 w-4 shrink-0 text-primary" /> Astuce : imprimez cette carte en poster grand format (30 × 40 cm) depuis MaFeliza.
      </div>
    </div>
  );
}
