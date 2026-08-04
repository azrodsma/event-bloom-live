import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Wind, Droplet, Zap } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/scenography")({
  component: Scenography,
  head: () => ({
    meta: [
      { title: "Scénographie · MaFeliza" },
      { name: "description", content: "Lumières, brume, confettis : chorégraphiez chaque effet minute par minute." },
      { property: "og:title", content: "Scénographie · MaFeliza" },
      { property: "og:description", content: "Le spectacle derrière l'émotion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const cues = [
  { t: "16:30", label: "Entrée mariée", color: "Rose poudré", fx: ["Ambient warm", "Uplight autel"], icon: Sparkles },
  { t: "18:30", label: "Cocktail jardin", color: "Doré chaleureux", fx: ["Guirlandes", "Bougies LED"], icon: Sparkles },
  { t: "20:15", label: "Entrée en salle", color: "Blanc glacé", fx: ["Poursuite", "Brume basse", "Confettis"], icon: Wind },
  { t: "22:00", label: "Ouverture de bal", color: "Rose · gold pulse", fx: ["Spot couple", "Étincelles froides", "Fumée"], icon: Zap },
  { t: "23:30", label: "Piste ouverte", color: "Multichromie", fx: ["Lasers doux", "Strobe modéré"], icon: Zap },
  { t: "01:00", label: "Slow final", color: "Ambré tamisé", fx: ["Boule à facettes", "Vent chaud"], icon: Droplet },
];

function Scenography() {
  const { slug } = useParams({ from: "/events/$slug/scenography" });
  const [active, setActive] = useState(2);

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Scénographie</p>
          <p className="text-xs text-muted-foreground">{cues.length} tableaux · régie synchronisée</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-foreground via-primary-dark to-primary p-6 text-white shadow-card">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/40 blur-3xl" />
          <div className="absolute -left-6 bottom-0 h-32 w-32 rounded-full bg-primary/60 blur-3xl" />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Tableau actif</p>
            <p className="mt-2 font-serif text-3xl leading-tight">{cues[active].label}</p>
            <p className="mt-1 text-sm opacity-90">{cues[active].t} · {cues[active].color}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {cues[active].fx.map((f) => (
                <span key={f} className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] backdrop-blur">
                  ✦ {f}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cue-sheet lumière</p>
          <div className="space-y-2">
            {cues.map((c, i) => {
              const Icon = c.icon;
              const on = i === active;
              return (
                <button
                  key={c.t}
                  onClick={() => setActive(i)}
                  className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                    on ? "bg-primary text-white shadow-glow" : "bg-surface shadow-soft"
                  }`}
                >
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${on ? "bg-white/20" : "bg-cream"}`}>
                    <Icon className={`h-5 w-5 ${on ? "text-white" : "text-primary"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${on ? "text-white/90" : "text-primary-dark"}`}>{c.t}</span>
                      <span className="truncate text-sm font-semibold">{c.label}</span>
                    </p>
                    <p className={`mt-0.5 truncate text-[11px] ${on ? "text-white/80" : "text-muted-foreground"}`}>
                      {c.color} · {c.fx.length} effets
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          {[
            { l: "Uplights", v: 24, i: Sparkles },
            { l: "Machines fumée", v: 3, i: Wind },
            { l: "Étincelles", v: 6, i: Zap },
          ].map((k) => {
            const I = k.i;
            return (
              <div key={k.l} className="rounded-2xl bg-surface p-3 text-center shadow-soft">
                <I className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-1 font-serif text-2xl leading-none">{k.v}</p>
                <p className="mt-1 text-[10px] uppercase text-muted-foreground">{k.l}</p>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
