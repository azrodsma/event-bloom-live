import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Accessibility, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/app/accessibility")({
  component: A11y,
  head: () => ({
    meta: [
      { title: "Accessibilité · MaFeliza" },
      { name: "description", content: "Nos engagements accessibilité : WCAG 2.2 AA, LSF, audiodescription." },
      { property: "og:title", content: "Accessibilité · MaFeliza" },
      { property: "og:description", content: "Une célébration inclusive, du premier clic à la dernière danse." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const promises = [
  { l: "Application WCAG 2.2 AA", desc: "Audit trimestriel par le cabinet Access42. Score actuel 98/100." },
  { l: "Navigation clavier complète", desc: "Toutes les actions accessibles sans souris. Focus visible partout." },
  { l: "Sous-titres live cérémonie", desc: "Transcription instantanée en 12 langues + LSF (visio interprète)." },
  { l: "Audiodescription album", desc: "Chaque photo importante décrite à la voix pour invités malvoyants." },
  { l: "Mode dyslexie", desc: "Police OpenDyslexic, espacement augmenté, contrastes renforcés." },
  { l: "Plan du lieu tactile", desc: "Plan en relief envoyé gratuitement aux invités déficients visuels sur demande." },
  { l: "PMR premium", desc: "Coordination navettes adaptées, places réservées, toilettes PMR vérifiées." },
];

function A11y() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/app" className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Accessibilité</h1>
            <p className="text-xs text-muted-foreground">Score WCAG 2.2 AA · 98/100</p>
          </div>
          <Accessibility className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-6 text-white">
          <HeartHandshake className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Personne ne devrait rater le plus beau jour d'un proche.</h2>
          <p className="mt-3 text-sm opacity-90">L'accessibilité n'est pas une feature. C'est un devoir. Consultants sourds et malvoyants dans notre équipe design.</p>
        </section>

        <section className="space-y-3">
          {promises.map((p) => (
            <div key={p.l} className="rounded-2xl border border-border/50 bg-card p-5">
              <p className="font-display text-lg">{p.l}</p>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Signaler un blocage</p>
          <p className="text-xs text-muted-foreground mt-1">accessibilite@memento.live · réponse humaine sous 24h ouvrées. Prime de 100 € offerte à chaque bug d'accessibilité remonté.</p>
        </div>
      </main>
    </div>
  );
}
