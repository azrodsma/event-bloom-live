import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Timer, Play, Pause, Volume2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/entrance")({
  component: Entrance,
  head: () => ({
    meta: [
      { title: "Entrées des mariés · Memento Live" },
      { name: "description", content: "Chorégraphiez l'entrée en salle : musique, éclairage, effets, timing seconde par seconde." },
      { property: "og:title", content: "Entrée · Memento Live" },
      { property: "og:description", content: "Une entrée mémorable, minutée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Cue = {
  t: number;
  role: "dj" | "light" | "effect" | "mc" | "video";
  action: string;
  detail: string;
};

const cues: Cue[] = [
  { t: 0, role: "mc", action: "Silence dans la salle", detail: "MC prend le micro : « Mesdames et messieurs… »" },
  { t: 8, role: "light", action: "Lumières tamisées", detail: "Baisser à 20% · projecteurs porte d'entrée" },
  { t: 15, role: "dj", action: "Intro musicale", detail: "Fade-in ‘‘Signed, Sealed, Delivered’’ – Stevie Wonder" },
  { t: 22, role: "mc", action: "Annonce", detail: "« Accueillons Sarah & Thomas Bernard ! »" },
  { t: 25, role: "effect", action: "Machine à confettis", detail: "Rafale de 3 sec · confettis rose & or" },
  { t: 26, role: "light", action: "Poursuites", detail: "2 poursuites blanches sur les mariés" },
  { t: 28, role: "video", action: "Écran LED", detail: "Prénoms animés + hashtag #SarahThomas26" },
  { t: 45, role: "dj", action: "Montée du son", detail: "80% · basses activées" },
  { t: 60, role: "mc", action: "Invitation à danser", detail: "« Levez-vous, la piste est à eux ! »" },
];

const roleStyle = {
  mc: "bg-primary text-primary-foreground",
  dj: "bg-amber-100 text-amber-800",
  light: "bg-sky-100 text-sky-800",
  effect: "bg-rose-100 text-rose-800",
  video: "bg-emerald-100 text-emerald-800",
} as const;

const roleLabel = { mc: "MC", dj: "DJ", light: "Lumière", effect: "Effet", video: "Vidéo" } as const;

function Entrance() {
  const { slug } = useParams({ from: "/events/$slug/entrance" });
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(15);

  const active = cues.filter((c) => c.t <= t).slice(-3).reverse();
  const next = cues.find((c) => c.t > t);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Entrée en salle</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Timer className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-foreground via-foreground/95 to-primary/70 px-4 pb-8 pt-8 text-background">
        <p className="text-[10px] uppercase tracking-[0.25em] text-background/70">Timing seconde par seconde</p>
        <h1 className="mt-3 font-serif text-3xl leading-tight">
          Les portes s'ouvrent<br /><em className="not-italic text-primary">à 21h35 précises</em>
        </h1>

        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="font-serif text-5xl leading-none tabular-nums">
              {String(Math.floor(t / 60)).padStart(2, "0")}:{String(t % 60).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-background/60">temps écoulé</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
            aria-label={playing ? "Pause" : "Lire"}
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 translate-x-0.5" />}
          </button>
          <input
            type="range"
            min={0}
            max={90}
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="w-10 text-right font-mono text-[11px] text-background/70">1:30</span>
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">Cue-sheet</h2>
          <span className="text-[11px] text-muted-foreground">{cues.length} cues · 1:30</span>
        </div>
        <ol className="relative">
          <span className="absolute left-6 top-2 bottom-2 w-px bg-border" />
          {cues.map((c) => {
            const past = c.t < t;
            const now = c.t === t || (c.t < t && t - c.t < 3);
            return (
              <li key={c.t} className="relative mb-2 flex gap-3">
                <span
                  className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full text-[10px] font-bold ring-4 ring-background ${
                    now ? "bg-primary text-primary-foreground animate-pulse" : past ? "bg-emerald-500 text-white" : "bg-secondary text-foreground"
                  }`}
                >
                  {String(Math.floor(c.t / 60)).padStart(2, "0")}:{String(c.t % 60).padStart(2, "0")}
                </span>
                <div className={`flex-1 rounded-2xl border p-3 ${now ? "border-primary bg-primary/5" : past ? "border-border/60 bg-card opacity-70" : "border-border/60 bg-card"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-serif text-[14px] leading-tight">{c.action}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${roleStyle[c.role]}`}>
                      {roleLabel[c.role]}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{c.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {next && (
        <section className="mx-4 mt-4 rounded-3xl border border-primary/40 bg-primary/5 p-4">
          <p className="text-[10px] uppercase tracking-wider text-primary">Prochain cue · dans {next.t - t}s</p>
          <p className="mt-1 font-serif text-lg leading-tight">{next.action}</p>
          <p className="text-[11px] text-muted-foreground">{next.detail}</p>
        </section>
      )}

      <section className="mx-4 mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-border/60 bg-card p-4">
          <p className="text-[10px] uppercase tracking-wider text-primary">Volume max</p>
          <p className="mt-1 flex items-center gap-1.5 font-serif text-lg leading-none">
            <Volume2 className="h-4 w-4" /> 82 dB
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">Respect voisinage 22h → 80 dB</p>
        </div>
        <div className="rounded-3xl border border-border/60 bg-card p-4">
          <p className="text-[10px] uppercase tracking-wider text-primary">Sécurité</p>
          <p className="mt-1 font-serif text-lg leading-none">Confettis papier</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Compostables · autorisés</p>
        </div>
      </section>

      <section className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Répétition sèche</p>
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Envoyer aux techniciens</p>
        <p className="mt-1 text-[12px] text-muted-foreground">DJ, régie lumière et MC reçoivent la même piste de conduite avec timecodes.</p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Partager le cue-sheet
        </button>
      </section>
    </div>
  );
}
