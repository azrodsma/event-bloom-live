import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Crown, Star, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/first-dance")({
  component: FirstDance,
  head: () => ({
    meta: [
      { title: "Ouverture de bal · MaFeliza" },
      { name: "description", content: "Chorégraphiez votre première danse : morceau, tempo, pas et éclairage." },
      { property: "og:title", content: "Ouverture de bal · MaFeliza" },
      { property: "og:description", content: "Un moment suspendu, préparé avec soin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const tracks = [
  { title: "At Last", artist: "Etta James", bpm: 68, mood: "Classique", color: "from-gold to-primary" },
  { title: "Perfect", artist: "Ed Sheeran", bpm: 95, mood: "Romantique", color: "from-primary to-primary-dark" },
  { title: "La vie en rose", artist: "Louis Armstrong", bpm: 84, mood: "Français", color: "from-primary-dark to-gold" },
  { title: "Thinking Out Loud", artist: "Ed Sheeran", bpm: 79, mood: "Doux", color: "from-primary to-gold" },
];

const steps = [
  { at: "0:00", label: "Entrée main dans la main", light: "Spot doré" },
  { at: "0:12", label: "Premier tour lent", light: "Ambiance tamisée" },
  { at: "0:38", label: "Dip romantique", light: "Confettis argentés" },
  { at: "1:15", label: "Retour au centre", light: "Full lumière" },
  { at: "1:58", label: "Fin & baiser final", light: "Feu de bengale" },
];

function FirstDance() {
  const { slug } = useParams({ from: "/events/$slug/first-dance" });
  const [selected, setSelected] = useState(0);

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Ouverture de bal</p>
          <p className="text-xs text-muted-foreground">Morceau · pas · lumières</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className={`overflow-hidden rounded-3xl bg-gradient-to-br ${tracks[selected].color} p-6 text-white shadow-card`}>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-90">
            <Crown className="h-3.5 w-3.5" /> Morceau sélectionné
          </div>
          <p className="mt-2 font-serif text-3xl leading-tight">{tracks[selected].title}</p>
          <p className="text-sm opacity-90">{tracks[selected].artist}</p>
          <div className="mt-4 flex gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur">
              {tracks[selected].bpm} BPM
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur">
              {tracks[selected].mood}
            </span>
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Suggestions IA
          </p>
          <div className="space-y-2">
            {tracks.map((t, i) => (
              <button
                key={t.title}
                onClick={() => setSelected(i)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                  selected === i ? "border-primary bg-surface shadow-glow" : "border-border bg-surface"
                }`}
              >
                <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${t.color} text-white`}>
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{t.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.artist} · {t.bpm} BPM</p>
                </div>
                <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-semibold">{t.mood}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Chorégraphie · storyboard
          </p>
          <ol className="relative space-y-2 border-l-2 border-primary/20 pl-6">
            {steps.map((s, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[33px] top-3 grid h-6 w-6 place-items-center rounded-full border-2 border-primary bg-background text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                <div className="rounded-2xl bg-surface p-3.5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-base leading-tight">{s.label}</p>
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                      <Clock className="h-2.5 w-2.5" /> {s.at}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-gold" /> {s.light}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <button className="w-full rounded-2xl bg-foreground py-3.5 text-sm font-semibold text-background">
          Réserver un cours (2 séances · 189 €)
        </button>
      </main>
    </div>
  );
}
