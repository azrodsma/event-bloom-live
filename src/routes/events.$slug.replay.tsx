import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Play, Pause, Volume2, Share2, Download, ChevronRight, Bookmark, Sparkles, Clock, Users } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/replay")({
  component: Replay,
  head: () => ({
    meta: [
      { title: "Replay du live · Memento Live" },
      { name: "description", content: "Revivez la diffusion en direct de votre événement avec chapitres, moments forts et téléchargement en HD." },
      { property: "og:title", content: "Replay du live · Memento Live" },
      { property: "og:description", content: "Le direct à revivre à tout moment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface Chapter {
  t: string;
  seconds: number;
  title: string;
  emoji: string;
}

const chapters: Chapter[] = [
  { t: "00:00", seconds: 0, title: "Accueil des invités", emoji: "🥂" },
  { t: "12:34", seconds: 754, title: "Entrée des mariés", emoji: "💍" },
  { t: "24:08", seconds: 1448, title: "Cérémonie laïque", emoji: "🕊️" },
  { t: "42:15", seconds: 2535, title: "Échange des vœux", emoji: "❤️" },
  { t: "58:20", seconds: 3500, title: "Sortie sous les pétales", emoji: "🌸" },
  { t: "1:12:04", seconds: 4324, title: "Vin d'honneur", emoji: "🥂" },
];

const highlights = [
  { t: "42:15", title: "Les vœux de Sarah", duration: "3 min", views: 87, emoji: "❤️" },
  { t: "58:20", title: "Le premier baiser", duration: "42 s", views: 124, emoji: "💋" },
  { t: "1:24:10", title: "Discours du père", duration: "5 min", views: 68, emoji: "🎤" },
];

function fmt(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

function Replay() {
  const { slug } = useParams({ from: "/events/$slug/replay" });
  const total = 5820;
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(1448);
  const [activeChapter, setActiveChapter] = useState(2);

  function jump(idx: number) {
    setActiveChapter(idx);
    setPos(chapters[idx].seconds);
    setPlaying(true);
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Replay du live</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Partager">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        <button
          onClick={() => setPlaying((p) => !p)}
          className="absolute inset-0 grid place-items-center"
          aria-label={playing ? "Pause" : "Lecture"}
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-foreground shadow-2xl transition-transform hover:scale-105">
            {playing ? <Pause className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
          </span>
        </button>

        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
            1080p
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
            <Users className="h-2.5 w-2.5" /> 68 spectateurs à ce moment
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <div className="mb-2 flex items-center justify-between text-[11px] font-mono">
            <span>{fmt(pos)}</span>
            <span className="text-white/70">{fmt(total)}</span>
          </div>
          <div className="relative h-1 rounded-full bg-white/20">
            <div className="absolute left-0 top-0 h-full rounded-full bg-primary" style={{ width: `${(pos / total) * 100}%` }} />
            {chapters.map((c, i) => (
              <button
                key={i}
                onClick={() => jump(i)}
                className={`absolute -top-1 h-3 w-3 -translate-x-1/2 rounded-full ring-2 ring-black/40 ${
                  i === activeChapter ? "bg-primary scale-125" : "bg-white/80"
                }`}
                style={{ left: `${(c.seconds / total) * 100}%` }}
                aria-label={`Aller au chapitre ${c.title}`}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <Volume2 className="h-4 w-4" />
            <span className="text-[11px] font-semibold">{chapters[activeChapter].emoji} {chapters[activeChapter].title}</span>
          </div>
        </div>
      </div>

      <section className="px-4 pt-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-primary" /> Diffusé le 14 juin 2026
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Cérémonie<br />Sarah & Thomas</h1>
        <p className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <span>Durée totale · 1 h 37</span>
          <span>·</span>
          <span>82 spectateurs uniques</span>
          <span>·</span>
          <span>Enregistré en 1080p</span>
        </p>

        <div className="mt-4 flex gap-2">
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-xs font-semibold text-background">
            <Download className="h-3.5 w-3.5" /> Télécharger (HD)
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-semibold">
            <Bookmark className="h-3.5 w-3.5" /> Sauver
          </button>
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-accent" /> Moments forts extraits par l'IA
        </p>
        <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {highlights.map((h) => (
            <button
              key={h.t}
              className="relative w-40 shrink-0 overflow-hidden rounded-2xl ring-1 ring-border/60"
            >
              <div className="relative aspect-[9/12] bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&auto=format&fit=crop"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                <span className="absolute right-1.5 top-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">
                  {h.duration}
                </span>
                <span className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-sm">
                  {h.emoji}
                </span>
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <p className="text-[10px] font-mono opacity-80">{h.t}</p>
                  <p className="text-sm font-semibold leading-tight">{h.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[9px] opacity-80">
                    <Users className="h-2.5 w-2.5" /> {h.views} vues
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Chapitres</p>
        <ul className="space-y-1.5">
          {chapters.map((c, i) => (
            <li key={c.t}>
              <button
                onClick={() => jump(i)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${
                  i === activeChapter ? "bg-primary/10 ring-1 ring-primary/40" : "bg-card ring-1 ring-border/60"
                }`}
              >
                <span className="grid h-10 w-14 shrink-0 place-items-center rounded-xl bg-secondary font-mono text-[11px] font-bold">
                  {c.t}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    <span className="mr-1.5">{c.emoji}</span>
                    {c.title}
                  </p>
                </div>
                <ChevronRight className={`h-4 w-4 ${i === activeChapter ? "text-primary" : "text-muted-foreground"}`} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 px-4">
        <div className="rounded-3xl bg-secondary/60 p-5 text-center">
          <Sparkles className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-2 font-serif text-lg">Un souvenir imprimé ?</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Recevez une clé USB gravée avec tout le replay et les moments forts.
          </p>
          <Link
            to="/events/$slug/souvenir"
            params={{ slug }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
          >
            Commander le souvenir
          </Link>
        </div>
      </div>
    </div>
  );
}
