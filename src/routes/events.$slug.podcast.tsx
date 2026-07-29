import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Mic, Play, Pause, Download, Star, Radio } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/podcast")({
  component: Podcast,
  head: () => ({
    meta: [
      { title: "Podcast de l'événement · Memento Live" },
      { name: "description", content: "Écoutez et partagez les moments audio marquants sous forme d'épisodes." },
      { property: "og:title", content: "Podcast · Memento Live" },
      { property: "og:description", content: "Vos souvenirs à réécouter, comme une émission." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Episode = {
  id: string;
  n: number;
  title: string;
  duration: string;
  speaker: string;
  chapters: string[];
  emoji: string;
  featured?: boolean;
};

const episodes: Episode[] = [
  { id: "e1", n: 1, title: "Discours du père de la mariée", duration: "6:42", speaker: "Michel", chapters: ["Enfance", "Rencontre", "Bénédiction"], emoji: "🎩", featured: true },
  { id: "e2", n: 2, title: "Toast du témoin — Julie", duration: "4:18", speaker: "Julie", chapters: ["Fac d'histoire", "Le voyage à Rome", "Promesse"], emoji: "🥂" },
  { id: "e3", n: 3, title: "Vœux échangés en tête-à-tête", duration: "8:05", speaker: "Sarah & Thomas", chapters: ["Sarah", "Thomas", "Silences complices"], emoji: "💍" },
  { id: "e4", n: 4, title: "Chœur surprise des cousins", duration: "3:22", speaker: "Les 6 cousins", chapters: ["Intro a cappella", "Refrain", "Ovation"], emoji: "🎤" },
  { id: "e5", n: 5, title: "Grand-mère raconte 1962", duration: "5:47", speaker: "Yvette", chapters: ["Le bal du village", "La rencontre", "Le conseil"], emoji: "👵" },
  { id: "e6", n: 6, title: "Ambiance piste — 23h33", duration: "2:11", speaker: "Foule", chapters: ["Introduction DJ", "Chœur spontané", "Rires"], emoji: "🎶" },
];

function Podcast() {
  const { slug } = useParams({ from: "/events/$slug/podcast" });
  const [playing, setPlaying] = useState<string | null>(null);
  const featured = episodes.find((e) => e.featured)!;

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Podcast</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-secondary" aria-label="Télécharger">
          <Download className="h-4 w-4" />
        </button>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-foreground via-foreground/90 to-primary/70 px-4 pb-8 pt-8 text-background">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-background/70">
          <Radio className="h-3.5 w-3.5" /> Saison 1 · 6 épisodes
        </div>
        <h1 className="mt-3 font-serif text-3xl leading-tight">Sarah & Thomas<br /><span className="text-primary">Le podcast</span></h1>
        <p className="mt-2 max-w-md text-sm text-background/80">
          Une émission privée composée des moments audio les plus marquants — vœux, discours, chœurs improvisés.
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-3xl bg-background/10 p-3 backdrop-blur">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-3xl">
            {featured.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wider text-background/60">Épisode {featured.n} · Mis en avant</p>
            <p className="truncate font-serif text-base">{featured.title}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-background/70">
              <Star className="h-3 w-3 fill-primary text-primary" /> {featured.duration} · {featured.speaker}
            </p>
          </div>
          <button
            onClick={() => setPlaying((p) => (p === featured.id ? null : featured.id))}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
            aria-label="Lire"
          >
            {playing === featured.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
          </button>
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">Tous les épisodes</h2>
          <span className="text-[11px] text-muted-foreground">{episodes.length} · 30 min</span>
        </div>
        <ul className="space-y-2">
          {episodes.map((e) => {
            const on = playing === e.id;
            return (
              <li key={e.id} className={`rounded-2xl border p-3 transition ${on ? "border-primary bg-primary/5" : "border-border/60 bg-card"}`}>
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-lg">{e.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Ép. {e.n}</p>
                    <p className="truncate font-serif text-[15px] leading-tight">{e.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{e.speaker} · {e.duration}</p>
                  </div>
                  <button
                    onClick={() => setPlaying((p) => (p === e.id ? null : e.id))}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${on ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                    aria-label={on ? "Pause" : "Lire"}
                  >
                    {on ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5" />}
                  </button>
                </div>
                {on && (
                  <>
                    <div className="mt-3 flex h-8 items-end gap-[2px]">
                      {Array.from({ length: 42 }).map((_, i) => (
                        <span
                          key={i}
                          className="flex-1 rounded-sm bg-primary/70"
                          style={{ height: `${20 + Math.abs(Math.sin(i * 0.7 + e.n)) * 80}%` }}
                        />
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {e.chapters.map((c, i) => (
                        <span key={c} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                          {String(i + 1).padStart(2, "0")} · {c}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Ajouter un épisode</p>
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Enregistrez un mot post-événement</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Ouvert 30 jours après la date — laissez une bande son inédite à vos proches.</p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Enregistrer maintenant
        </button>
      </section>
    </div>
  );
}
