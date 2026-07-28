import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sun, Moon, Sunrise, Sunset } from "lucide-react";

export const Route = createFileRoute("/events/$slug/light-plan")({
  component: LightPlan,
  head: () => ({
    meta: [
      { title: "Plan lumière · Memento Live" },
      { name: "description", content: "Ambiances lumineuses heure par heure : dorée, tamisée, dansante." },
      { property: "og:title", content: "Plan lumière · Memento Live" },
      { property: "og:description", content: "L'atmosphère, orchestrée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const phases = [
  { icon: Sunrise, t: "15:00", label: "Accueil champagne", kelvin: "3000K", intensity: 60, hue: "Blanc chaud", color: "from-gold/70 to-primary" },
  { icon: Sun, t: "17:30", label: "Cérémonie extérieure", kelvin: "6500K", intensity: 100, hue: "Lumière naturelle", color: "from-primary to-gold" },
  { icon: Sunset, t: "20:00", label: "Dîner", kelvin: "2400K", intensity: 40, hue: "Bougies + guirlandes", color: "from-primary-dark to-gold" },
  { icon: Moon, t: "23:00", label: "Piste de danse", kelvin: "RGB", intensity: 90, hue: "Rose · doré · violet", color: "from-foreground to-primary-dark" },
];

function LightPlan() {
  const { slug } = useParams({ from: "/events/$slug/light-plan" });
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Plan lumière</p>
          <p className="text-xs text-muted-foreground">{phases.length} ambiances · pilotage DMX</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-gold/25 to-primary/20 p-6 shadow-card">
          <Sun className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">L'atmosphère, orchestrée</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Chaque phase choisit sa température de couleur pour flatter les visages et sublimer les photos.
          </p>
        </section>

        {phases.map((p) => {
          const Icon = p.icon;
          return (
            <article key={p.t} className={`rounded-3xl bg-gradient-to-br ${p.color} p-5 text-white shadow-soft`}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/25 backdrop-blur">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold opacity-80">{p.t}</p>
                  <p className="font-serif text-xl leading-tight">{p.label}</p>
                </div>
                <span className="ml-auto rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold backdrop-blur">{p.kelvin}</span>
              </div>
              <p className="mt-3 text-xs opacity-90">{p.hue}</p>
              <div className="mt-2 flex items-center justify-between text-[10px] opacity-80">
                <span>Intensité</span><span>{p.intensity}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/25">
                <div className="h-full rounded-full bg-white" style={{ width: `${p.intensity}%` }} />
              </div>
            </article>
          );
        })}

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Astuces photo</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Golden hour = 30 min avant le coucher du soleil (18h42 ce jour)</li>
            <li>· Prévoir bougies LED sur les tables (autonomie 8h)</li>
            <li>· Éviter le néon frontal : projecteurs latéraux ambrés</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
