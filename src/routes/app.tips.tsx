import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lightbulb, Clock, Bookmark, ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/tips")({
  component: Tips,
  head: () => ({
    meta: [
      { title: "Conseils MaFeliza · Astuces d'organisation" },
      { name: "description", content: "Guides pratiques, checklists et retours d'expérience pour préparer un événement inoubliable." },
      { property: "og:title", content: "Conseils MaFeliza" },
      { property: "og:description", content: "L'école secrète des grands organisateurs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Tip = {
  id: string;
  category: "budget" | "invités" | "timing" | "déco" | "live";
  title: string;
  excerpt: string;
  read: string;
  cover: string;
  featured?: boolean;
};

const tips: Tip[] = [
  { id: "1", category: "timing", title: "Le rétroplanning idéal à 6 mois", excerpt: "La méthode des mariés organisés : 12 étapes clés semaine par semaine, sans stress inutile.", read: "8 min", cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", featured: true },
  { id: "2", category: "budget", title: "Répartir un budget de 15 000 €", excerpt: "Ventilation réaliste par poste : lieu, traiteur, robe, fleurs, photo — avec marges de sécurité.", read: "6 min", cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800" },
  { id: "3", category: "invités", title: "Rédiger un faire-part qui donne envie", excerpt: "Ton, format, wording — 12 exemples avant/après pour transformer une invitation banale.", read: "4 min", cover: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=800" },
  { id: "4", category: "live", title: "Réussir sa diffusion YouTube", excerpt: "Caméra, connexion, cadrage, chat modéré : notre guide pas-à-pas pour un live impeccable.", read: "10 min", cover: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=800" },
  { id: "5", category: "déco", title: "5 tables champêtres à copier", excerpt: "Palette, hauteur, textures : ce qui fait la différence sur les photos aériennes.", read: "5 min", cover: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800" },
  { id: "6", category: "invités", title: "Gérer les plus-un et les enfants", excerpt: "Diplomatie familiale : nos formulations testées pour cadrer sans froisser.", read: "3 min", cover: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800" },
];

const categories = [
  { id: "all", label: "Tous", emoji: "✨" },
  { id: "timing", label: "Timing", emoji: "⏱" },
  { id: "budget", label: "Budget", emoji: "💰" },
  { id: "invités", label: "Invités", emoji: "💌" },
  { id: "live", label: "Live", emoji: "📡" },
  { id: "déco", label: "Déco", emoji: "🌸" },
] as const;

function Tips() {
  const [cat, setCat] = useState<(typeof categories)[number]["id"]>("all");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const list = cat === "all" ? tips : tips.filter((t) => t.category === cat);
  const featured = tips.find((t) => t.featured)!;

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Conseils</p>
        <span className="w-9" />
      </div>

      <section className="px-4 pb-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5 text-primary" /> École MaFeliza
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">L'organisation sans stress</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Guides pratiques rédigés par notre équipe et par les meilleurs wedding planners.
        </p>
      </section>

      <section className="px-4">
        <Link
          to="/app/tips"
          className="group block overflow-hidden rounded-3xl border border-border/60 bg-card"
        >
          <div className="relative h-44 w-full overflow-hidden">
            <img src={featured.cover} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              <TrendingUp className="h-3 w-3" /> À la une
            </span>
            <div className="absolute inset-x-4 bottom-3 text-white">
              <p className="font-serif text-xl leading-tight">{featured.title}</p>
              <p className="mt-1 text-[11px] text-white/80"><Clock className="mr-1 inline h-3 w-3" /> {featured.read} de lecture</p>
            </div>
          </div>
        </Link>
      </section>

      <div className="sticky top-14 z-10 mt-6 bg-background/95 backdrop-blur">
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                cat === c.id ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
              }`}
            >
              <span className="mr-1">{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-3 px-4 pt-3">
        {list.map((t) => {
          const isSaved = saved.has(t.id);
          return (
            <li key={t.id} className="flex gap-3 rounded-3xl border border-border/60 bg-card p-3">
              <img src={t.cover} alt="" className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{t.category}</p>
                <p className="mt-0.5 line-clamp-2 font-serif text-[15px] leading-tight">{t.title}</p>
                <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{t.excerpt}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground"><Clock className="mr-0.5 inline h-3 w-3" /> {t.read}</span>
                  <button
                    onClick={() => setSaved((s) => { const n = new Set(s); n.has(t.id) ? n.delete(t.id) : n.add(t.id); return n; })}
                    className={`grid h-7 w-7 place-items-center rounded-full ${isSaved ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                    aria-label="Enregistrer"
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Coach IA MaFeliza</p>
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Une question précise ?</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Décrivez votre situation, notre coach répond en 30 secondes avec des recommandations sur-mesure.</p>
        <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Discuter maintenant <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </section>
    </div>
  );
}
