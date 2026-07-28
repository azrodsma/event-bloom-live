import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Flame, Sparkles, Clock } from "lucide-react";

export const Route = createFileRoute("/events/$slug/fireworks")({
  component: Fireworks,
  head: () => ({
    meta: [
      { title: "Feu d'artifice · Memento Live" },
      { name: "description", content: "Chorégraphiez le bouquet final à la seconde près." },
      { property: "og:title", content: "Feu d'artifice · Memento Live" },
      { property: "og:description", content: "Le ciel comme signature." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const acts = [
  { l: "Ouverture", d: "20 s", pieces: "Comètes dorées basses", song: "Cinema Paradiso · intro", color: "from-gold to-primary" },
  { l: "Développement", d: "45 s", pieces: "Bouquets roses et blancs", song: "La Vie en Rose · cordes", color: "from-primary to-primary-dark" },
  { l: "Crescendo", d: "35 s", pieces: "Étoiles filantes multi-hauteurs", song: "Time · Hans Zimmer", color: "from-primary-dark to-foreground" },
  { l: "Bouquet final", d: "25 s", pieces: "Palme dorée · saules pleureurs", song: "The Beauty and the Beast", color: "from-foreground to-gold" },
];

function Fireworks() {
  const { slug } = useParams({ from: "/events/$slug/fireworks" });
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Feu d'artifice</p>
          <p className="text-xs text-muted-foreground">Durée totale · 2 min 05 · déclenchement 23:15</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-foreground via-primary-dark to-primary p-6 text-white shadow-card">
          <Flame className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Le ciel comme signature</p>
          <p className="mt-2 text-sm opacity-90">
            Chorégraphie synchronisée avec la musique — validée par la préfecture · pyrotechniciens certifiés.
          </p>
        </section>

        <section className="rounded-3xl bg-cream p-4 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary-dark">Autorisations</p>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p>✓ Déclaration préfecture · reçu #FA-2026-1841</p>
            <p>✓ Assurance responsabilité civile — Groupama</p>
            <p>✓ Périmètre sécurité 40 m tracé</p>
            <p>✓ Éco-poudre biodégradable</p>
          </div>
        </section>

        <section className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-gold via-primary to-foreground" />
          <div className="space-y-3">
            {acts.map((a, i) => (
              <article key={i} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${a.color} p-4 text-white shadow-soft`}>
                <span className="absolute -left-[18px] top-5 grid h-4 w-4 place-items-center rounded-full bg-white ring-4 ring-background" />
                <div className="flex items-center justify-between">
                  <p className="font-serif text-lg leading-tight">Acte {i + 1} · {a.l}</p>
                  <span className="flex items-center gap-1 rounded-full bg-white/25 px-2 py-1 text-[11px] font-semibold">
                    <Clock className="h-3 w-3" /> {a.d}
                  </span>
                </div>
                <p className="mt-1 text-xs opacity-90">{a.pieces}</p>
                <p className="mt-2 rounded-full bg-white/20 px-2.5 py-1 text-[11px] inline-block">♪ {a.song}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="mt-2 font-serif text-lg leading-tight">Alternative silencieuse</p>
          <p className="mt-1 text-sm opacity-80">
            Feu low-noise (75 dB max) pour préserver les animaux et enfants sensibles — même intensité visuelle.
          </p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold">Basculer en silencieux</button>
        </section>
      </main>
    </div>
  );
}
