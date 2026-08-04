import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Moon, Heart, Coffee, Wind, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/wellness")({
  component: Wellness,
  head: () => ({
    meta: [
      { title: "Bien-être organisateur · MaFeliza" },
      { name: "description", content: "Préservez votre énergie pendant la préparation : sommeil, respiration, micro-pauses et rituels doux." },
      { property: "og:title", content: "Bien-être organisateur · MaFeliza" },
      { property: "og:description", content: "Un événement inoubliable commence par vous, en forme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const days = [
  { d: "Lun", sleep: 6.5, mood: 3 },
  { d: "Mar", sleep: 7, mood: 4 },
  { d: "Mer", sleep: 5.5, mood: 2 },
  { d: "Jeu", sleep: 6, mood: 3 },
  { d: "Ven", sleep: 8, mood: 5 },
  { d: "Sam", sleep: 7.5, mood: 4 },
  { d: "Dim", sleep: 8.5, mood: 5 },
];

const rituals = [
  { icon: Wind, title: "Respiration 4-7-8", desc: "Inspirer 4s · retenir 7s · expirer 8s", minutes: 3, color: "from-primary to-primary-dark" },
  { icon: Coffee, title: "Pause thé matcha", desc: "Éloignez l'écran, réchauffez vos mains.", minutes: 10, color: "from-gold to-primary" },
  { icon: Heart, title: "Ancrage gratitude", desc: "Notez 3 personnes qui vous soutiennent.", minutes: 5, color: "from-primary to-gold" },
  { icon: Moon, title: "Rituel de coucher", desc: "Écran off · lumière chaude · tisane.", minutes: 15, color: "from-foreground to-primary" },
];

function Wellness() {
  const [today, setToday] = useState<number | null>(4);
  const avgSleep = (days.reduce((s, d) => s + d.sleep, 0) / days.length).toFixed(1);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Bien-être organisateur</p>
          <p className="text-xs text-muted-foreground">Semaine du 20 juillet · J-5</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Comment vous sentez-vous ?</p>
          <div className="mt-4 flex justify-between">
            {["😴", "😕", "🙂", "😊", "🤩"].map((e, i) => (
              <button
                key={i}
                onClick={() => setToday(i)}
                className={`grid h-12 w-12 place-items-center rounded-full text-2xl transition ${
                  today === i ? "bg-white text-foreground scale-110 shadow-glow" : "bg-white/15"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm opacity-90">
            {today !== null ? "Merci d'avoir pris ce petit moment pour vous." : "Un tap suffit — on garde ça pour vous."}
          </p>
        </section>

        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-serif text-lg">Sommeil de la semaine</p>
              <p className="text-xs text-muted-foreground">Moyenne · {avgSleep} h par nuit</p>
            </div>
            <Moon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex items-end justify-between gap-2">
            {days.map((d) => {
              const h = Math.max(20, (d.sleep / 10) * 120);
              return (
                <div key={d.d} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary/40 to-primary"
                    style={{ height: h }}
                  />
                  <span className="text-[10px] font-medium text-muted-foreground">{d.d}</span>
                  <span className="text-[10px] text-foreground">{d.sleep}h</span>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rituels du jour</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {rituals.map((r) => (
              <button
                key={r.title}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${r.color} p-5 text-left text-white shadow-card transition hover:shadow-glow`}
              >
                <r.icon className="h-6 w-6" />
                <p className="mt-3 font-serif text-lg leading-tight">{r.title}</p>
                <p className="mt-1 text-xs opacity-90">{r.desc}</p>
                <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold backdrop-blur">
                  {r.minutes} min · Commencer
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">Message de l'IA MaFeliza</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            « Vous avez délégué 3 tâches à votre wedding-planner cette semaine. Bravo. Ce soir, on lâche le téléphone à 22h. »
          </p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-full bg-primary-light px-4 py-2 text-xs font-semibold text-primary">Activer le mode calme</button>
            <button className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold">Plus tard</button>
          </div>
        </section>
      </main>
    </div>
  );
}
