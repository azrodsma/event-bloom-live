import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Heart, Bookmark } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/app/inspirations")({
  component: Inspirations,
  head: () => ({
    meta: [
      { title: "Inspirations d'événements · MaFeliza" },
      { name: "description", content: "Explorez des moodboards, thèmes et mises en scène pour imaginer votre prochain événement." },
      { property: "og:title", content: "Inspirations · MaFeliza" },
      { property: "og:description", content: "Des idées visuelles pour composer un événement inoubliable." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

interface Inspiration {
  id: string;
  title: string;
  theme: string;
  palette: string[];
  cover: string;
  saves: number;
  tags: string[];
  height: "tall" | "short" | "medium";
}

const themes = ["Tous", "Bohème", "Élégant", "Champêtre", "Moderne", "Vintage", "Tropical"];

const seed: Inspiration[] = [
  { id: "i1", title: "Sous les oliviers", theme: "Bohème", palette: ["#E85D8E", "#D9A441", "#FFF8F4"], cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop", saves: 2412, tags: ["Extérieur", "Été"], height: "tall" },
  { id: "i2", title: "Cérémonie dorée", theme: "Élégant", palette: ["#0F0F10", "#D9A441", "#FFF8F4"], cover: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop", saves: 1897, tags: ["Chic", "Or"], height: "medium" },
  { id: "i3", title: "Fleurs sauvages", theme: "Champêtre", palette: ["#E85D8E", "#B6C48A", "#FFF8F4"], cover: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=800&auto=format&fit=crop", saves: 3120, tags: ["Fleurs", "Naturel"], height: "short" },
  { id: "i4", title: "Néon minimal", theme: "Moderne", palette: ["#E85D8E", "#111111", "#F5F5F7"], cover: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop", saves: 1245, tags: ["Néon", "Urbain"], height: "medium" },
  { id: "i5", title: "Palais vintage", theme: "Vintage", palette: ["#8B3A3A", "#D9A441", "#F3E7D3"], cover: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&auto=format&fit=crop", saves: 986, tags: ["Rétro", "Boiseries"], height: "tall" },
  { id: "i6", title: "Bord de mer", theme: "Tropical", palette: ["#2FB6B0", "#F4B860", "#FFF8F4"], cover: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop", saves: 2201, tags: ["Plage", "Palmiers"], height: "short" },
  { id: "i7", title: "Table blanche", theme: "Élégant", palette: ["#FFFFFF", "#D9A441", "#0F0F10"], cover: "https://images.unsplash.com/photo-1519671845924-1f2ec72c1d5f?w=800&auto=format&fit=crop", saves: 1543, tags: ["Épuré"], height: "medium" },
  { id: "i8", title: "Guirlandes lumineuses", theme: "Bohème", palette: ["#E85D8E", "#F4B860", "#3A2E2A"], cover: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop", saves: 2890, tags: ["Nuit", "Chaleureux"], height: "tall" },
];

const heightClass: Record<Inspiration["height"], string> = {
  tall: "h-80",
  medium: "h-64",
  short: "h-52",
};

function Inspirations() {
  const [theme, setTheme] = useState("Tous");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const items = useMemo(() => (theme === "Tous" ? seed : seed.filter((i) => i.theme === theme)), [theme]);

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="pb-24">
      <div className="sticky top-[57px] z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app/explore" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Inspirations</p>
        <span className="w-9" />
      </div>

      <section className="bg-gradient-to-b from-secondary/60 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> Moodboards
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Trouvez votre style</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enregistrez vos ambiances préférées et créez un événement à partir d'un thème complet.
        </p>
      </section>

      <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-4">
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              t === theme
                ? "bg-foreground text-background"
                : "border border-border bg-background text-foreground hover:border-primary/40"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="columns-2 gap-3 px-4">
        {items.map((i) => (
          <article key={i.id} className="mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-card shadow-sm">
            <div className="relative">
              <img src={i.cover} alt={i.title} className={`w-full object-cover ${heightClass[i.height]}`} loading="lazy" />
              <button
                onClick={() => toggleSave(i.id)}
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 backdrop-blur"
                aria-label="Sauvegarder"
              >
                <Bookmark className={`h-4 w-4 ${saved.has(i.id) ? "fill-foreground" : ""}`} />
              </button>
            </div>
            <div className="p-3">
              <p className="font-serif text-sm leading-snug">{i.title}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{i.theme}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex -space-x-1">
                  {i.palette.map((c) => (
                    <span
                      key={c}
                      className="h-4 w-4 rounded-full border border-white/70"
                      style={{ backgroundColor: c }}
                      aria-hidden
                    />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Heart className="h-3 w-3" /> {i.saves.toLocaleString("fr-FR")}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 px-4">
        <Link
          to="/app/create"
          className="flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground"
        >
          <Sparkles className="h-4 w-4" /> Créer un événement à partir de mes inspirations
        </Link>
      </div>
    </div>
  );
}
