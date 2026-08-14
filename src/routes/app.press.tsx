import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Newspaper, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/press")({
  component: Press,
  head: () => ({
    meta: [
      { title: "Presse · MaFeliza" },
      { name: "description", content: "MaFeliza dans les médias : articles, distinctions, kit presse." },
      { property: "og:title", content: "Presse · MaFeliza" },
      { property: "og:description", content: "Une nouvelle façon de vivre les célébrations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const features = [
  { media: "Vogue France", title: "Les nouveaux rituels d'un mariage moderne", date: "mars 2026", quote: "L'app qui a repensé la mémoire du grand jour." },
  { media: "Les Échos", title: "MaFeliza lève 4M€ pour digitaliser l'événementiel privé", date: "février 2026", quote: "Un pari sur l'émotion, pas sur la publicité." },
  { media: "Elle Décoration", title: "Le mood board qui remplace Pinterest", date: "janvier 2026", quote: "Précis, esthétique, sans distraction." },
  { media: "Konbini", title: "L'app qui rend les mariages plus doux", date: "décembre 2025", quote: "Pour les invités aussi, ça change tout." },
];

const awards = [
  { l: "Prix de l'innovation UX", org: "Awwwards · 2026" },
  { l: "Grande cause pour les mémoires familiales", org: "Prix EFAP · 2026" },
  { l: "Meilleure application française privée", org: "App of the Year · 2025" },
];

function Press() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Espace presse</p>
          <p className="text-xs text-muted-foreground">Media room officielle</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-foreground via-primary-dark to-primary p-6 text-white shadow-card">
          <Newspaper className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Une nouvelle façon de célébrer</p>
          <p className="mt-2 text-sm opacity-90">
            Fondée en 2024, MaFeliza accompagne 24 000 événements privés et rassemble une communauté de 380 000 utilisateurs mensuels.
          </p>
        </section>

        <section className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-2xl bg-primary/10 p-3">
            <p className="font-serif text-2xl text-primary-dark">24k</p>
            <p className="text-[10px] text-muted-foreground">événements</p>
          </div>
          <div className="rounded-2xl bg-gold/25 p-3">
            <p className="font-serif text-2xl">380k</p>
            <p className="text-[10px] text-muted-foreground">utilisateurs</p>
          </div>
          <div className="rounded-2xl bg-foreground p-3 text-background">
            <p className="font-serif text-2xl">4,8</p>
            <p className="text-[10px] opacity-80">note App Store</p>
          </div>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" /> Ils en parlent
          </p>
          <div className="space-y-2">
            {features.map((f) => (
              <article key={f.title} className="rounded-2xl bg-surface p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-dark">{f.media}</p>
                  <span className="text-[10px] text-muted-foreground">{f.date}</span>
                </div>
                <p className="mt-2 font-serif text-lg leading-tight">{f.title}</p>
                <p className="mt-2 border-l-2 border-primary/40 pl-3 text-xs italic text-muted-foreground">« {f.quote} »</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Distinctions
          </p>
          <div className="space-y-2">
            {awards.map((a) => (
              <article key={a.l} className="flex items-center justify-between rounded-2xl bg-cream p-3.5 shadow-soft">
                <div>
                  <p className="text-sm font-semibold">{a.l}</p>
                  <p className="text-[11px] text-muted-foreground">{a.org}</p>
                </div>
                <span className="text-2xl">🏆</span>
              </article>
            ))}
          </div>
        </section>

        <div className="flex gap-2">
          <button className="flex-1 rounded-full bg-foreground py-3 text-sm font-semibold text-background">Télécharger le kit presse</button>
          <button className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-white">Contact presse</button>
        </div>
      </main>
    </div>
  );
}
