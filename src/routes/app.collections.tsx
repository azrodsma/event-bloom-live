import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, Lock, Users, Sparkles, MoreVertical, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/collections")({
  component: Collections,
  head: () => ({
    meta: [
      { title: "Mes collections · MaFeliza" },
      { name: "description", content: "Rassemblez vos souvenirs préférés en collections thématiques : voyages, famille, jours heureux." },
      { property: "og:title", content: "Mes collections · MaFeliza" },
      { property: "og:description", content: "Souvenirs, rangés avec soin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Collection = {
  id: string;
  emoji: string;
  title: string;
  items: number;
  events: number;
  contributors: number;
  updated: string;
  covers: string[];
  privacy: "private" | "family" | "friends";
  auto?: boolean;
  color: string;
};

const collections: Collection[] = [
  {
    id: "c1",
    emoji: "💛",
    title: "Coups de cœur",
    items: 84,
    events: 6,
    contributors: 1,
    updated: "il y a 2 h",
    privacy: "private",
    color: "from-amber-100 to-amber-200",
    covers: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=300",
      "https://images.unsplash.com/photo-1521543387223-cffef79eb5b6?w=300",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300",
    ],
  },
  {
    id: "c2",
    emoji: "👨‍👩‍👧",
    title: "Famille — génération grands-parents",
    items: 142,
    events: 12,
    contributors: 8,
    updated: "hier",
    privacy: "family",
    color: "from-rose-100 to-rose-200",
    covers: [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300",
    ],
  },
  {
    id: "c3",
    emoji: "🎂",
    title: "Anniversaires marquants",
    items: 96,
    events: 4,
    contributors: 12,
    updated: "il y a 3 j",
    privacy: "friends",
    auto: true,
    color: "from-fuchsia-100 to-fuchsia-200",
    covers: [
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300",
      "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?w=300",
      "https://images.unsplash.com/photo-1544928147-40e88b3caa7d?w=300",
    ],
  },
  {
    id: "c4",
    emoji: "🌊",
    title: "Souvenirs d'été",
    items: 210,
    events: 8,
    contributors: 4,
    updated: "la semaine dernière",
    privacy: "friends",
    color: "from-sky-100 to-sky-200",
    covers: [
      "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=300",
      "https://images.unsplash.com/photo-1499363536502-87642509e31b?w=300",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=300",
    ],
  },
  {
    id: "c5",
    emoji: "🎵",
    title: "Playlists de nos soirées",
    items: 58,
    events: 5,
    contributors: 3,
    updated: "il y a 2 sem.",
    privacy: "friends",
    color: "from-violet-100 to-violet-200",
    covers: [
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300",
      "https://images.unsplash.com/photo-1526394931762-8a4116f6e4c9?w=300",
    ],
  },
];

const suggestions = [
  { emoji: "🥂", label: "Discours & toasts (12 vocaux détectés)" },
  { emoji: "🐾", label: "Animaux invités surprise (7 photos)" },
  { emoji: "🌅", label: "Lever & coucher de soleil (18 clichés)" },
];

const privacyMeta = {
  private: { label: "Privé", icon: Lock, tint: "bg-muted text-muted-foreground" },
  family: { label: "Famille", icon: Users, tint: "bg-primary/10 text-primary" },
  friends: { label: "Amis", icon: Users, tint: "bg-accent/60 text-foreground" },
} as const;

function Collections() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Mes collections</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Rechercher">
          <Search className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> {collections.length} collections · 590 souvenirs
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Souvenirs,<br />rangés avec soin</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Regroupez photos, vidéos et vocaux à travers tous vos événements dans des collections thématiques.
        </p>
      </section>

      <div className="flex items-center justify-between px-4 pb-3">
        <div className="flex gap-1 rounded-full bg-secondary p-0.5">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                view === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {v === "grid" ? "Grille" : "Liste"}
            </button>
          ))}
        </div>
        <button className="inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground">
          <Plus className="h-3.5 w-3.5" /> Nouvelle
        </button>
      </div>

      {view === "grid" ? (
        <section className="grid grid-cols-2 gap-2 px-4">
          {collections.map((c) => {
            const pm = privacyMeta[c.privacy];
            const PIcon = pm.icon;
            return (
              <article key={c.id} className={`overflow-hidden rounded-3xl border border-border/60 bg-card`}>
                <div className={`relative h-32 w-full bg-gradient-to-br ${c.color}`}>
                  <div className="absolute inset-1.5 grid grid-cols-2 grid-rows-2 gap-1">
                    {c.covers.slice(0, 3).map((src, i) => (
                      <div
                        key={i}
                        className={`overflow-hidden rounded-xl bg-white/40 ${i === 0 ? "row-span-2" : ""}`}
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    ))}
                    <div className="grid place-items-center rounded-xl bg-white/60 text-lg font-bold backdrop-blur">
                      +{c.items - 3}
                    </div>
                  </div>
                  <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/85 text-base backdrop-blur">
                    {c.emoji}
                  </span>
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-sm font-semibold">{c.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {c.items} souvenirs · {c.events} événements
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${pm.tint}`}>
                      <PIcon className="h-2.5 w-2.5" /> {pm.label}
                    </span>
                    {c.auto && (
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                        Auto
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <ul className="space-y-2 px-4">
          {collections.map((c) => {
            const pm = privacyMeta[c.privacy];
            const PIcon = pm.icon;
            return (
              <li key={c.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
                <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${c.color} text-2xl`}>
                  {c.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold">{c.title}</p>
                    <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${pm.tint}`}>
                      <PIcon className="h-2.5 w-2.5" /> {pm.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {c.items} souvenirs · {c.contributors} contributeur{c.contributors > 1 ? "s" : ""} · maj {c.updated}
                  </p>
                </div>
                <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary" aria-label="Actions">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <section className="mx-4 mt-8 rounded-3xl bg-primary/5 p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Suggestions intelligentes
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">On a repéré 3 collections<br />potentielles</p>
        <ul className="mt-3 space-y-1.5">
          {suggestions.map((s) => (
            <li key={s.label}>
              <button className="flex w-full items-center justify-between rounded-2xl bg-background px-3.5 py-3 text-left text-sm ring-1 ring-border/60">
                <span className="inline-flex items-center gap-2">
                  <span className="text-lg">{s.emoji}</span>
                  <span>{s.label}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
