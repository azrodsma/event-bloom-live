import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, TrendingUp, Sparkles, Calendar, Flame } from "lucide-react";

export const Route = createFileRoute("/app/trends")({
  component: Trends,
  head: () => ({
    meta: [
      { title: "Tendances 2026 · Memento Live" },
      { name: "description", content: "Palettes, thèmes et fleurs qui font vibrer les événements cette saison." },
      { property: "og:title", content: "Tendances 2026 · Memento Live" },
      { property: "og:description", content: "L'inspiration du moment, chaque semaine." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const palettes = [
  { name: "Terracotta doré", colors: ["#C97B5C", "#E8B87E", "#F4E3C8", "#3A2820"], score: 92 },
  { name: "Rose crème", colors: ["#E85D8E", "#FFF8F4", "#D9A441", "#2A1F1A"], score: 88 },
  { name: "Sauge & lin", colors: ["#9CAF88", "#E8E0D0", "#B8956A", "#3D3B2E"], score: 84 },
];

const themes = [
  { name: "Jardin secret", emoji: "🌿", trend: "+124%", note: "Fleurs suspendues et végétal foisonnant" },
  { name: "Riviera dolce vita", emoji: "🍋", trend: "+87%", note: "Citrons, lin blanc et céramique bleue" },
  { name: "Cinéma vintage", emoji: "🎞️", trend: "+62%", note: "Sépia, projecteurs, playlist années 60" },
  { name: "Bal masqué", emoji: "🎭", trend: "+41%", note: "Velours, plumes et bougies" },
];

function Trends() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Tendances 2026</p>
          <p className="text-xs text-muted-foreground">Mise à jour hebdomadaire</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-90">
            <TrendingUp className="h-3.5 w-3.5" /> Cette semaine
          </div>
          <p className="mt-2 font-serif text-3xl leading-tight">Le retour du velours</p>
          <p className="mt-2 text-sm opacity-90">
            +214% de mentions ces 30 derniers jours dans les mariages d'automne.
          </p>
          <button className="mt-4 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur">
            Explorer le moodboard
          </button>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Palettes populaires
          </p>
          <div className="space-y-2">
            {palettes.map((p) => (
              <div key={p.name} className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-soft">
                <div className="flex overflow-hidden rounded-xl">
                  {p.colors.map((c) => (
                    <div key={c} className="h-14 w-8" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {p.colors.join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-bold text-gold">
                  <Flame className="h-3 w-3" /> {p.score}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Thèmes qui montent
          </p>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((t) => (
              <div key={t.name} className="rounded-2xl bg-surface p-4 shadow-soft">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{t.emoji}</span>
                  <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                    {t.trend}
                  </span>
                </div>
                <p className="mt-3 font-serif text-lg leading-tight">{t.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-cream p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-dark">
            <Sparkles className="h-4 w-4" /> Prédiction IA
          </div>
          <p className="mt-2 font-serif text-lg leading-tight">
            Les mariages « slow » de 2 jours vont dominer le printemps 2026.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Basé sur 12 000 événements analysés sur Memento Live.
          </p>
          <button className="mt-3 flex items-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
            <Calendar className="h-3.5 w-3.5" /> Voir le calendrier
          </button>
        </section>
      </main>
    </div>
  );
}
