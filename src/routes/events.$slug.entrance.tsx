import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react";

export const Route = createFileRoute("/events/$slug/entrance")({
  component: Entrance,
  head: () => ({
    meta: [
      { title: "Entrée des mariés · MaFeliza" },
      { name: "description", content: "Chorégraphie, musique et effets pour une entrée mémorable." },
      { property: "og:title", content: "Entrée des mariés · MaFeliza" },
      { property: "og:description", content: "90 secondes pour donner le ton de la soirée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const steps = [
  { s: "00:00", l: "Fumée basse + lumières tamisées", d: "Machine à brouillard bas Antari · faisceaux ambre" },
  { s: "00:08", l: "MC annonce", d: "\"Mesdames et messieurs, pour la première fois...\"" },
  { s: "00:15", l: "Musique démarre", d: "Perfect - Ed Sheeran (version orchestrale montante)" },
  { s: "00:22", l: "Portes s'ouvrent", d: "Confettis pétales roses (canons manuels témoins)" },
  { s: "00:30", l: "Marche vers piste centrale", d: "Éclairage suiveur · invités debout" },
  { s: "01:00", l: "Salut & bisou", d: "Pause 4 sec pour photographe" },
  { s: "01:15", l: "Première danse enchaînée", d: "Transition fluide vers valse ouverture" },
];

function Entrance() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Entrée des mariés</h1>
            <p className="text-xs text-muted-foreground">21:30 · Durée 1'30</p>
          </div>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white">
          <Wand2 className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Le moment où tout commence.</h2>
          <p className="mt-3 text-sm opacity-90">Chaque seconde compte. On la scénarise ensemble.</p>
        </section>

        <section className="space-y-2">
          {steps.map((step, i) => (
            <div key={step.s} className="rounded-2xl border border-border/50 bg-card p-4 flex gap-4">
              <div className="flex flex-col items-center">
                <span className="font-mono text-xs text-primary">{step.s}</span>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="flex-1 pb-2">
                <p className="font-medium text-sm">{step.l}</p>
                <p className="text-xs text-muted-foreground mt-1">{step.d}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Régie coordonnée</p>
          <p className="text-xs text-muted-foreground mt-1">DJ Nova · Éclairagiste Léo · MC Antoine · Photographe Studio Paloma · Vidéaste Aurélien. Répétition technique 18h30 sans public.</p>
        </section>
      </main>
    </div>
  );
}
