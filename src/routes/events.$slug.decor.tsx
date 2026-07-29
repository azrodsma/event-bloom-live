import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Plus, Heart, Share2, Palette, Flower2, Lightbulb } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/decor")({
  component: Decor,
  head: () => ({
    meta: [
      { title: "Moodboard décoration · Memento Live" },
      { name: "description", content: "L'univers visuel de votre événement : palette, fleurs, tables, lumières." },
      { property: "og:title", content: "Moodboard décoration · Memento Live" },
      { property: "og:description", content: "L'ambiance, avant le grand jour." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Category = "palette" | "flowers" | "table" | "lights" | "stationery";

const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Tout" },
  { id: "palette", label: "Palette" },
  { id: "flowers", label: "Fleurs" },
  { id: "table", label: "Tables" },
  { id: "lights", label: "Lumières" },
  { id: "stationery", label: "Papeterie" },
];

type Pin = {
  id: string;
  cat: Category;
  img: string;
  h: "tall" | "med" | "short";
  title: string;
  saves: number;
  saved?: boolean;
};

const pins: Pin[] = [
  { id: "1", cat: "flowers", img: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=500", h: "tall", title: "Centre de table pivoines", saves: 42, saved: true },
  { id: "2", cat: "table", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500", h: "med", title: "Nappage ivoire lin lavé", saves: 28 },
  { id: "3", cat: "lights", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500", h: "short", title: "Guirlandes guinguette", saves: 61, saved: true },
  { id: "4", cat: "flowers", img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500", h: "med", title: "Arche florale eucalyptus", saves: 84 },
  { id: "5", cat: "stationery", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500", h: "tall", title: "Marque-place calligraphié", saves: 19 },
  { id: "6", cat: "table", img: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=500", h: "short", title: "Vaisselle terracotta", saves: 33 },
  { id: "7", cat: "lights", img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500", h: "tall", title: "Bougies chandeliers dorés", saves: 47, saved: true },
  { id: "8", cat: "flowers", img: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500", h: "med", title: "Bouquet de la mariée", saves: 92 },
];

const palette = [
  { hex: "#E85D8E", name: "Rose Memento" },
  { hex: "#FFF8F4", name: "Crème" },
  { hex: "#D9A441", name: "Doré tendre" },
  { hex: "#E8DFD5", name: "Sable" },
  { hex: "#3A2A2A", name: "Cacao doux" },
];

function Decor() {
  const { slug } = useParams({ from: "/events/$slug/decor" });
  const [cat, setCat] = useState<Category | "all">("all");
  const [saved, setSaved] = useState<Set<string>>(new Set(pins.filter((p) => p.saved).map((p) => p.id)));

  const toggle = (id: string) =>
    setSaved((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const filtered = pins.filter((p) => cat === "all" || p.cat === cat);
  const colA = filtered.filter((_, i) => i % 2 === 0);
  const colB = filtered.filter((_, i) => i % 2 === 1);

  const hClass: Record<Pin["h"], string> = {
    tall: "h-64",
    med: "h-48",
    short: "h-36",
  };

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Décoration</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Partager">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-accent/50 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Palette className="h-3.5 w-3.5 text-primary" /> Univers visuel · {saved.size} sauvegardés
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">L'ambiance,<br />avant le grand jour</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Rassemblez vos inspirations. Partagez avec la fleuriste et le traiteur en un lien.
        </p>
      </section>

      <section className="mx-4 rounded-3xl border border-border/60 bg-card p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Palette officielle</p>
        <div className="mt-3 flex gap-2">
          {palette.map((c) => (
            <div key={c.hex} className="flex-1 text-center">
              <div
                className="mx-auto h-14 w-14 rounded-2xl shadow-inner ring-1 ring-border/50"
                style={{ background: c.hex }}
              />
              <p className="mt-1.5 text-[10px] font-semibold">{c.name}</p>
              <p className="text-[9px] uppercase text-muted-foreground">{c.hex}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky top-14 z-10 -mx-1 mt-5 flex gap-1.5 overflow-x-auto border-b border-border/60 bg-background/95 px-5 py-3 backdrop-blur">
        {categories.map((c) => {
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                active ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <section className="grid grid-cols-2 gap-2 px-4 pt-4">
        {[colA, colB].map((col, ci) => (
          <div key={ci} className="space-y-2">
            {col.map((p) => {
              const isSaved = saved.has(p.id);
              return (
                <article key={p.id} className="group relative overflow-hidden rounded-2xl bg-card">
                  <img src={p.img} alt="" className={`w-full ${hClass[p.h]} object-cover`} loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <button
                    onClick={() => toggle(p.id)}
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/85 backdrop-blur"
                    aria-label="Sauvegarder"
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : "text-foreground"}`} />
                  </button>
                  <div className="absolute inset-x-2 bottom-2 text-white">
                    <p className="line-clamp-2 text-[11px] font-semibold leading-tight">{p.title}</p>
                    <p className="mt-0.5 text-[9px] text-white/80">
                      <Heart className="mr-0.5 inline h-2.5 w-2.5 fill-white/80" /> {p.saves + (isSaved && !p.saved ? 1 : 0)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      </section>

      <section className="mx-4 mt-6 rounded-3xl bg-primary/5 p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Lightbulb className="h-3.5 w-3.5" /> Envoi prestataires
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Un lien, tout est prêt</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Générez un moodboard PDF avec palette, dimensions et références — prêt à envoyer à votre fleuriste.
        </p>
        <button className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background">
          Exporter en PDF
        </button>
      </section>

      <div className="fixed bottom-24 left-1/2 z-30 -translate-x-1/2">
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow">
          <Plus className="h-4 w-4" /> Ajouter une inspiration
        </button>
      </div>

      <div className="mx-4 mt-4 flex items-center gap-3 rounded-3xl bg-card p-4 ring-1 ring-border/60">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-accent">
          <Flower2 className="h-5 w-5 text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Suggestions IA · style bohème romantique</p>
          <p className="text-[10px] text-muted-foreground">D'après votre palette et vos sauvegardes</p>
        </div>
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
    </div>
  );
}
