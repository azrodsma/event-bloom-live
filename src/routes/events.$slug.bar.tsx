import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, GlassWater, Wine, Coffee, Heart, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/bar")({
  component: Bar,
  head: () => ({
    meta: [
      { title: "Carte des cocktails · Memento Live" },
      { name: "description", content: "Signature drinks, mocktails et sélection de vins de la soirée." },
      { property: "og:title", content: "Carte du bar · Memento Live" },
      { property: "og:description", content: "Le bar de la soirée, avec amour." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Category = "signature" | "classics" | "mocktails" | "wines";

const categories: { id: Category; label: string; icon: typeof GlassWater }[] = [
  { id: "signature", label: "Signature", icon: Sparkles },
  { id: "classics", label: "Classiques", icon: GlassWater },
  { id: "mocktails", label: "Sans alcool", icon: Coffee },
  { id: "wines", label: "Vins", icon: Wine },
];

type Drink = {
  id: string;
  name: string;
  subtitle: string;
  glass: string;
  strength: 0 | 1 | 2 | 3;
  ingredients: string[];
  color: string;
  emoji: string;
  cat: Category;
  story?: string;
  favs: number;
  faved?: boolean;
  signature?: boolean;
};

const drinks: Drink[] = [
  {
    id: "d1",
    name: "L'amour rose",
    subtitle: "La signature de Sarah",
    glass: "Coupe",
    strength: 2,
    ingredients: ["Gin infusé rose", "Litchi", "Champagne", "Citron vert"],
    color: "from-rose-200 via-pink-300 to-rose-400",
    emoji: "🌸",
    cat: "signature",
    story: "Inventé lors de notre première Saint-Valentin à Lisbonne, en 2021.",
    favs: 47,
    faved: true,
    signature: true,
  },
  {
    id: "d2",
    name: "Le Thomas",
    subtitle: "Fumé, corsé, un peu têtu",
    glass: "Old-fashioned",
    strength: 3,
    ingredients: ["Whisky tourbé", "Sirop d'érable", "Bitter orange", "Zeste"],
    color: "from-amber-300 via-amber-500 to-orange-600",
    emoji: "🥃",
    cat: "signature",
    story: "Un clin d'œil au single malt qu'il a offert à son père.",
    favs: 33,
    signature: true,
  },
  {
    id: "d3",
    name: "Spritz Provence",
    subtitle: "Aperitivo local",
    glass: "Ballon",
    strength: 1,
    ingredients: ["Aperol", "Rosé de Provence", "Eau gazeuse", "Orange"],
    color: "from-orange-200 to-orange-400",
    emoji: "🍊",
    cat: "classics",
    favs: 58,
    faved: true,
  },
  {
    id: "d4",
    name: "French 75",
    subtitle: "L'élégance en bulles",
    glass: "Flûte",
    strength: 2,
    ingredients: ["Gin", "Citron", "Sirop de sucre", "Champagne"],
    color: "from-yellow-100 to-amber-200",
    emoji: "🥂",
    cat: "classics",
    favs: 29,
  },
  {
    id: "d5",
    name: "Jardin d'été",
    subtitle: "Mocktail rafraîchissant",
    glass: "Highball",
    strength: 0,
    ingredients: ["Concombre", "Menthe", "Citron vert", "Tonic elderflower"],
    color: "from-emerald-200 to-emerald-400",
    emoji: "🌿",
    cat: "mocktails",
    favs: 41,
  },
  {
    id: "d6",
    name: "Sunset zéro",
    subtitle: "Douceur, sans alcool",
    glass: "Coupe",
    strength: 0,
    ingredients: ["Grenadine artisanale", "Pamplemousse", "Basilic", "Kombucha"],
    color: "from-pink-200 via-rose-300 to-red-300",
    emoji: "🌅",
    cat: "mocktails",
    favs: 22,
  },
  {
    id: "d7",
    name: "Domaine Tempier",
    subtitle: "Bandol rosé 2022",
    glass: "Verre à vin",
    strength: 2,
    ingredients: ["Mourvèdre", "Grenache", "Cinsault"],
    color: "from-rose-200 to-rose-300",
    emoji: "🍷",
    cat: "wines",
    favs: 15,
  },
  {
    id: "d8",
    name: "Champagne Bollinger",
    subtitle: "Special Cuvée",
    glass: "Flûte",
    strength: 2,
    ingredients: ["Pinot noir", "Chardonnay", "Meunier"],
    color: "from-yellow-100 to-yellow-200",
    emoji: "🍾",
    cat: "wines",
    favs: 88,
    faved: true,
  },
];

const strengthLabel = ["Sans alcool", "Léger", "Corsé", "Fort"] as const;

function Bar() {
  const { slug } = useParams({ from: "/events/$slug/bar" });
  const [cat, setCat] = useState<Category>("signature");
  const [faved, setFaved] = useState<Set<string>>(new Set(drinks.filter((d) => d.faved).map((d) => d.id)));

  const toggle = (id: string) =>
    setFaved((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const list = drinks.filter((d) => d.cat === cat);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Le bar</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Filtres">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/40 to-transparent" />
        <div className="absolute -right-8 top-6 h-32 w-32 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative px-4 pb-6 pt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <GlassWater className="h-3.5 w-3.5 text-primary" /> 8 boissons · 2 signatures
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-tight">
            Le bar<br />
            <span className="italic text-primary">de la soirée</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Deux cocktails signature créés pour Sarah & Thomas, plus une carte pensée pour tous les goûts.
          </p>
        </div>
      </section>

      <div className="sticky top-14 z-10 border-b border-border/60 bg-background/95 px-3 py-3 backdrop-blur">
        <div className="flex gap-1 rounded-full bg-secondary p-1">
          {categories.map((c) => {
            const Icon = c.icon;
            const active = cat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-semibold ${
                  active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-3 w-3" /> {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <ul className="space-y-4 px-4 pt-5">
        {list.map((d) => {
          const isFav = faved.has(d.id);
          return (
            <li key={d.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
              <div className={`relative h-40 w-full bg-gradient-to-br ${d.color}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                <span className="absolute left-4 top-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/80 text-3xl shadow-sm backdrop-blur">
                  {d.emoji}
                </span>
                {d.signature && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold text-primary backdrop-blur">
                    <Sparkles className="h-3 w-3" /> Signature
                  </span>
                )}
                <button
                  onClick={() => toggle(d.id)}
                  className="absolute right-3 bottom-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur"
                  aria-label="Favori"
                >
                  <Heart className={`h-4 w-4 ${isFav ? "fill-primary text-primary" : "text-foreground"}`} />
                </button>
                <div className="absolute inset-x-4 bottom-3 max-w-[70%] text-white">
                  <p className="font-serif text-2xl leading-tight drop-shadow">{d.name}</p>
                  <p className="text-[11px] text-white/85">{d.subtitle}</p>
                </div>
              </div>

              <div className="p-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>🥃 {d.glass}</span>
                  <span>·</span>
                  <span>
                    {strengthLabel[d.strength]}
                    <span className="ml-1 inline-flex gap-0.5 align-middle">
                      {[1, 2, 3].map((i) => (
                        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= d.strength ? "bg-primary" : "bg-border"}`} />
                      ))}
                    </span>
                  </span>
                  <span>·</span>
                  <span>
                    <Heart className="mr-0.5 inline h-2.5 w-2.5 fill-primary text-primary" /> {d.favs + (isFav && !d.faved ? 1 : 0)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {d.ingredients.map((ing) => (
                    <span key={ing} className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium">
                      {ing}
                    </span>
                  ))}
                </div>

                {d.story && (
                  <blockquote className="mt-3 border-l-2 border-primary/40 pl-3 font-serif text-[12px] italic leading-relaxed text-muted-foreground">
                    « {d.story} »
                  </blockquote>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mx-4 mt-6 rounded-3xl bg-primary/5 p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Rappel important
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Boire, oui — modérément</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Le bar reste ouvert jusqu'à 3 h. Navettes disponibles à toute heure — pensez à vous.
        </p>
      </div>
    </div>
  );
}
