import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, Heart, Share2, Lock, Gift, Trash2, ExternalLink, Sparkles, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/wishes")({
  component: Wishes,
  head: () => ({
    meta: [
      { title: "Ma liste de souhaits · MaFeliza" },
      { name: "description", content: "Rassemblez vos envies : anniversaire, mariage, crémaillère. Partagez-les à vos proches en un lien." },
      { property: "og:title", content: "Ma liste de souhaits · MaFeliza" },
      { property: "og:description", content: "Vos envies, rassemblées." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Wish = {
  id: string;
  title: string;
  shop: string;
  price: number;
  priority: "must" | "nice" | "later";
  image: string;
  category: string;
  reservedBy?: string;
  bought?: boolean;
  private?: boolean;
};

const initial: Wish[] = [
  {
    id: "w1",
    title: "Machine espresso De'Longhi Dedica",
    shop: "Boulanger",
    price: 249,
    priority: "must",
    image: "https://images.unsplash.com/photo-1559751048-06e78531d8dd?w=400",
    category: "Cuisine",
    reservedBy: "Cousine Marie",
  },
  {
    id: "w2",
    title: "Plaid en pure laine des Pyrénées",
    shop: "Maison Sajou",
    price: 89,
    priority: "nice",
    image: "https://images.unsplash.com/photo-1616627981234-1e75f728c92e?w=400",
    category: "Maison",
  },
  {
    id: "w3",
    title: "Week-end aux Cinque Terre",
    shop: "Airbnb",
    price: 380,
    priority: "must",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400",
    category: "Expérience",
    bought: true,
    reservedBy: "Emma & Julien",
  },
  {
    id: "w4",
    title: "Livre de recettes Ottolenghi",
    shop: "Fnac",
    price: 32,
    priority: "later",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    category: "Livres",
  },
  {
    id: "w5",
    title: "Vinyle 'Random Access Memories'",
    shop: "Discogs",
    price: 45,
    priority: "nice",
    image: "https://images.unsplash.com/photo-1526394931762-8a4116f6e4c9?w=400",
    category: "Musique",
    private: true,
  },
];

const priorityMeta = {
  must: { label: "Coup de cœur", tint: "bg-primary/10 text-primary" },
  nice: { label: "Ça me plairait", tint: "bg-secondary text-foreground" },
  later: { label: "Un jour", tint: "bg-muted text-muted-foreground" },
} as const;

const filters = ["Toutes", "Coup de cœur", "Réservées", "Reçues"];

function Wishes() {
  const [wishes, setWishes] = useState(initial);
  const [filter, setFilter] = useState("Toutes");

  const filtered = wishes.filter((w) => {
    if (filter === "Coup de cœur") return w.priority === "must";
    if (filter === "Réservées") return !!w.reservedBy && !w.bought;
    if (filter === "Reçues") return !!w.bought;
    return true;
  });

  const total = wishes.reduce((s, w) => s + w.price, 0);
  const covered = wishes.filter((w) => w.reservedBy || w.bought).reduce((s, w) => s + w.price, 0);
  const pct = Math.round((covered / total) * 100);

  const remove = (id: string) => setWishes((ws) => ws.filter((w) => w.id !== id));

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Ma liste de souhaits</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Partager">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> {wishes.length} envies · {covered} € couverts
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Vos envies,<br />rassemblées</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Créez une liste pour votre anniversaire, votre mariage, une naissance… Partagez-la en un lien.
        </p>

        <div className="mt-4 rounded-3xl border border-border/60 bg-card p-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold">Couverture</span>
            <span className="text-muted-foreground">{pct}% · {covered} / {total} €</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-3 flex gap-2">
            <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground py-2 text-xs font-bold text-background">
              <Share2 className="h-3.5 w-3.5" /> Partager le lien
            </button>
            <button className="rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold">
              memento.live/wishes/emma
            </button>
          </div>
        </div>
      </section>

      <div className="sticky top-14 z-10 border-b border-border/60 bg-background/95 px-4 py-2 backdrop-blur">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                filter === f ? "bg-foreground text-background" : "bg-secondary text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-3 px-4 pt-4">
        {filtered.map((w) => {
          const pm = priorityMeta[w.priority];
          return (
            <li
              key={w.id}
              className={`overflow-hidden rounded-3xl border bg-card ${
                w.bought ? "border-primary/30 opacity-90" : "border-border/60"
              }`}
            >
              <div className="flex gap-3 p-3">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-secondary">
                  <img src={w.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  {w.bought && (
                    <div className="absolute inset-0 grid place-items-center bg-primary/70">
                      <Check className="h-6 w-6 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${pm.tint}`}>
                      {pm.label}
                    </span>
                    {w.private && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold">
                        <Lock className="h-2.5 w-2.5" /> Privé
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-tight">{w.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{w.shop} · {w.category}</p>
                  <p className="mt-1 text-sm font-bold">{w.price} €</p>
                </div>
              </div>

              {(w.reservedBy || w.bought) && (
                <div className="border-t border-border bg-secondary/40 px-4 py-2 text-[11px]">
                  {w.bought ? (
                    <p className="inline-flex items-center gap-1 font-semibold text-primary">
                      <Check className="h-3.5 w-3.5" /> Offert par {w.reservedBy}
                    </p>
                  ) : (
                    <p className="inline-flex items-center gap-1 font-semibold">
                      <Heart className="h-3.5 w-3.5 text-primary" /> Réservé par {w.reservedBy}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                <button className="inline-flex items-center justify-center gap-1 py-2.5 text-[11px] font-semibold text-muted-foreground hover:bg-secondary">
                  <ExternalLink className="h-3 w-3" /> Voir
                </button>
                <button className="inline-flex items-center justify-center gap-1 py-2.5 text-[11px] font-semibold text-muted-foreground hover:bg-secondary">
                  <Share2 className="h-3 w-3" /> Partager
                </button>
                <button
                  onClick={() => remove(w.id)}
                  className="inline-flex items-center justify-center gap-1 py-2.5 text-[11px] font-semibold text-destructive hover:bg-destructive/5"
                >
                  <Trash2 className="h-3 w-3" /> Retirer
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mx-4 mt-8 rounded-3xl bg-primary/5 p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Gift className="h-3.5 w-3.5" /> Astuce
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Importez depuis vos favoris</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Collez un lien Amazon, Fnac, Etsy — nous récupérons image, titre et prix automatiquement.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            placeholder="https://…"
            className="flex-1 rounded-full border border-border bg-background px-3.5 py-2 text-xs outline-none focus:border-primary"
          />
          <button className="rounded-full bg-foreground px-3.5 py-2 text-xs font-bold text-background">
            Ajouter
          </button>
        </div>
      </section>

      <button className="fixed bottom-24 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-xs font-bold text-primary-foreground shadow-glow">
        <Plus className="h-4 w-4" /> Ajouter un souhait
      </button>
    </div>
  );
}
