import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, Gauge } from "lucide-react";

export const Route = createFileRoute("/events/$slug/emotion-heatmap")({
  component: EmotionHeatmap,
  head: () => ({
    meta: [
      { title: "Carte émotionnelle · MaFeliza" },
      { name: "description", content: "Les pics d'émotion de la journée, minute par minute." },
      { property: "og:title", content: "Émotions live · MaFeliza" },
      { property: "og:description", content: "Applaudissements, larmes, éclats de rire : la journée en signal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const peaks = [
  { t: "14:52", label: "Échange des vœux", score: 98, kind: "Larmes" },
  { t: "15:04", label: "Bénédiction grand-mère", score: 94, kind: "Larmes" },
  { t: "16:08", label: "Sortie · pluie de pétales", score: 92, kind: "Applaudissements" },
  { t: "18:45", label: "Discours de Julie (témoin)", score: 96, kind: "Rires + larmes" },
  { t: "21:12", label: "Ouverture de bal", score: 89, kind: "Émotion douce" },
  { t: "22:30", label: "Surprise vidéo grands-parents", score: 99, kind: "Larmes collectives" },
  { t: "23:45", label: "Feu d'artifice", score: 91, kind: "Émerveillement" },
];

function EmotionHeatmap() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Carte émotionnelle</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Signal live · captation acoustique</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Heart className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white">
          <Gauge className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Ce qu'on ressent, mesuré sans caméra.</h2>
          <p className="mt-3 text-sm opacity-90">Trois micros d'ambiance analysent en temps réel l'intensité vocale, les rires et les silences. Aucun visage n'est identifié : le signal est purement acoustique et anonyme.</p>
        </section>

        <section className="space-y-2">
          {peaks.map((p) => (
            <div key={p.t} className="rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:ring-primary/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-primary">{p.t}</span>
                  <span className="text-sm font-medium">{p.label}</span>
                </div>
                <span className="font-display text-2xl text-primary">{p.score}</span>
              </div>
              <div className="h-1.5 rounded-full bg-cream overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-gold" style={{ width: `${p.score}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">{p.kind}</p>
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">RGPD & éthique</p>
          <p className="text-xs text-muted-foreground mt-1">Aucune parole n'est transcrite ni stockée. Seul le niveau sonore est agrégé toutes les 5 secondes. Consentement demandé à l'inscription.</p>
        </div>
      </main>
    </div>
  );
}
