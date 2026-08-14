import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, Sparkles, Calendar, MapPin, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/venues")({
  component: Venues,
  head: () => ({
    meta: [
      { title: "Lieux de réception · MaFeliza" },
      { name: "description", content: "Découvrez une sélection de domaines, châteaux et rooftops pour votre événement." },
      { property: "og:title", content: "Lieux · MaFeliza" },
      { property: "og:description", content: "Le décor de vos plus beaux souvenirs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Venue = {
  id: string;
  name: string;
  region: string;
  style: "Château" | "Domaine" | "Rooftop" | "Villa" | "Ferme";
  capacity: string;
  price: string;
  score: number;
  image: string;
  tags: string[];
};

const venues: Venue[] = [
  { id: "v1", name: "Château de Roubines", region: "Provence · 84", style: "Château", capacity: "80 – 220", price: "12 000 €", score: 4.9, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800", tags: ["Piscine", "Chapelle", "Vue vignes"] },
  { id: "v2", name: "Domaine des Tilleuls", region: "Bourgogne · 21", style: "Domaine", capacity: "50 – 180", price: "7 500 €", score: 4.8, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800", tags: ["Gîte 30 pers.", "Étang", "Chapiteau inclus"] },
  { id: "v3", name: "Rooftop Célestine", region: "Paris · 75011", style: "Rooftop", capacity: "40 – 120", price: "6 900 €", score: 4.7, image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", tags: ["Vue Sacré-Cœur", "Cocktail dînatoire", "Nocturne 2h"] },
  { id: "v4", name: "Villa Costa Bianca", region: "Corse · 20", style: "Villa", capacity: "30 – 90", price: "18 400 €", score: 5.0, image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800", tags: ["Face mer", "Piscine", "10 chambres"] },
  { id: "v5", name: "La Grange aux Foins", region: "Normandie · 14", style: "Ferme", capacity: "60 – 150", price: "5 200 €", score: 4.6, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800", tags: ["Champêtre", "Pommiers", "Feu de camp"] },
  { id: "v6", name: "Château d'Aubervilliers", region: "Île-de-France · 95", style: "Château", capacity: "100 – 300", price: "14 800 €", score: 4.8, image: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800", tags: ["Parc XVIIIᵉ", "Orangerie", "Nocturne libre"] },
];

const filters = ["Tous", "Château", "Domaine", "Rooftop", "Villa", "Ferme"] as const;

function Venues() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tous");
  const [saved, setSaved] = useState<Set<string>>(new Set(["v1"]));
  const list = filter === "Tous" ? venues : venues.filter((v) => v.style === filter);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Lieux</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-secondary" aria-label="Filtres">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      <section className="px-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Sélection MaFeliza
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Le décor de vos plus beaux souvenirs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          140 lieux vérifiés en France, filtrés par style, capacité et budget.
        </p>
      </section>

      <div className="sticky top-14 z-10 bg-background/95 backdrop-blur">
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                filter === f ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-4 px-4 pt-2">
        {list.map((v) => {
          const on = saved.has(v.id);
          return (
            <li key={v.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
              <div className="relative h-56 w-full">
                <img src={v.image} alt={v.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <button
                  onClick={() => setSaved((s) => { const n = new Set(s); n.has(v.id) ? n.delete(v.id) : n.add(v.id); return n; })}
                  className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-background/90 backdrop-blur"
                  aria-label="Favori"
                >
                  <Heart className={`h-4 w-4 ${on ? "fill-primary text-primary" : "text-foreground"}`} />
                </button>
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur">
                  {v.style}
                </span>
                <div className="absolute inset-x-4 bottom-3 text-white">
                  <p className="font-serif text-xl leading-tight">{v.name}</p>
                  <p className="flex items-center gap-1 text-[11px] text-white/85">
                    <MapPin className="h-3 w-3" /> {v.region}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">À partir de</p>
                    <p className="font-serif text-xl leading-none">{v.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Capacité</p>
                    <p className="font-serif text-sm">{v.capacity}</p>
                  </div>
                  <div className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                    ★ {v.score.toFixed(1)}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {v.tags.map((t) => (
                    <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button className="flex-1 rounded-full bg-foreground py-2.5 text-xs font-bold text-background">
                    Visiter le lieu
                  </button>
                  <button className="grid h-10 w-10 place-items-center rounded-full bg-secondary" aria-label="Disponibilités">
                    <Calendar className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Concierge MaFeliza</p>
        <p className="mt-2 font-serif text-lg leading-tight">Nous cherchons pour vous</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Décrivez votre vision, budget et date — notre équipe vous propose 3 lieux sur-mesure sous 48h.
        </p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Demander une sélection
        </button>
      </section>
    </div>
  );
}
