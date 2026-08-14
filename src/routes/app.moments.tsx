import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Share2, Heart, Download, Play, Wand2, Clock, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/moments")({
  component: Moments,
  head: () => ({
    meta: [
      { title: "Mes moments · MaFeliza" },
      { name: "description", content: "Un pêle-mêle intelligent de vos plus beaux instants extraits automatiquement de tous vos événements." },
      { property: "og:title", content: "Mes moments · MaFeliza" },
      { property: "og:description", content: "Vos plus beaux instants, remontés automatiquement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Moment = {
  id: string;
  emoji: string;
  title: string;
  event: string;
  date: string;
  score: number;
  reason: string;
  media: "photo" | "video" | "audio";
  duration?: string;
  image: string;
  emotions: string[];
  span: "sm" | "md" | "lg";
};

const moments: Moment[] = [
  {
    id: "m1",
    emoji: "💍",
    title: "Le baiser sous les pétales",
    event: "Mariage Sarah & Thomas",
    date: "14 juin 2026",
    score: 98,
    reason: "156 cœurs · 42 commentaires",
    media: "photo",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    emotions: ["Émouvant", "Iconique"],
    span: "lg",
  },
  {
    id: "m2",
    emoji: "🎂",
    title: "Camille souffle ses bougies",
    event: "40 ans de Camille",
    date: "22 sept. 2025",
    score: 92,
    reason: "Pic d'engagement live",
    media: "video",
    duration: "0:14",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800",
    emotions: ["Joyeux"],
    span: "md",
  },
  {
    id: "m3",
    emoji: "🎤",
    title: "Le discours de Papa",
    event: "Mariage Sarah & Thomas",
    date: "14 juin 2026",
    score: 89,
    reason: "18 rires détectés",
    media: "audio",
    duration: "3:24",
    image: "https://images.unsplash.com/photo-1544928147-40e88b3caa7d?w=800",
    emotions: ["Drôle", "Émouvant"],
    span: "sm",
  },
  {
    id: "m4",
    emoji: "🕊️",
    title: "Gabriel s'endort sur l'épaule de mamie",
    event: "Baptême de Gabriel",
    date: "5 mai 2026",
    score: 87,
    reason: "Cadrage & lumière optimaux",
    media: "photo",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800",
    emotions: ["Tendre"],
    span: "md",
  },
  {
    id: "m5",
    emoji: "🎉",
    title: "Cœur des invités sur la piste",
    event: "Mariage Sarah & Thomas",
    date: "14 juin 2026",
    score: 84,
    reason: "Plan drone, moment fort",
    media: "video",
    duration: "0:22",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800",
    emotions: ["Festif"],
    span: "sm",
  },
  {
    id: "m6",
    emoji: "🥂",
    title: "Le toast des témoins",
    event: "Mariage Sarah & Thomas",
    date: "14 juin 2026",
    score: 81,
    reason: "12 mentions dans le chat",
    media: "photo",
    image: "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?w=800",
    emotions: ["Convivial"],
    span: "md",
  },
];

const filters = ["Tout", "Photos", "Vidéos", "Vocaux", "Drôles", "Émouvants"];
const spans = { sm: "row-span-1", md: "row-span-2", lg: "row-span-3" } as const;

function Moments() {
  const [filter, setFilter] = useState("Tout");
  const [saved, setSaved] = useState<Set<string>>(new Set(["m1", "m3"]));

  const toggle = (id: string) =>
    setSaved((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const filtered = moments.filter((m) => {
    if (filter === "Tout") return true;
    if (filter === "Photos") return m.media === "photo";
    if (filter === "Vidéos") return m.media === "video";
    if (filter === "Vocaux") return m.media === "audio";
    return m.emotions.some((e) => filter.startsWith(e));
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Mes moments</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Filtrer">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-primary/10 via-accent/30 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Wand2 className="h-3.5 w-3.5 text-primary" /> Sélection intelligente
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Vos plus beaux<br />instants, remontés</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Nous scrutons chaque événement pour extraire vos moments à conserver.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { v: "24", l: "Moments" },
            { v: "6", l: "Événements" },
            { v: "12 h", l: "Souvenirs" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border/60 bg-card px-2 py-3 text-center">
              <p className="font-serif text-2xl leading-none">{s.v}</p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky top-14 z-10 border-b border-border/60 bg-background/95 px-4 py-2 backdrop-blur">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                filter === f ? "bg-foreground text-background" : "bg-secondary text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <section className="px-4 pt-4">
        <div className="grid auto-rows-[110px] grid-cols-2 gap-2">
          {filtered.map((m) => (
            <article
              key={m.id}
              className={`group relative overflow-hidden rounded-3xl bg-card ${spans[m.span]}`}
            >
              <img src={m.image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-foreground backdrop-blur">
                {m.emoji} {m.score}
              </span>

              {m.media !== "photo" && (
                <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">
                  {m.media === "video" ? <Play className="h-2.5 w-2.5 fill-current" /> : <Clock className="h-2.5 w-2.5" />}
                  {m.duration}
                </span>
              )}

              <button
                onClick={() => toggle(m.id)}
                className="absolute right-2 bottom-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 backdrop-blur"
                aria-label="Sauvegarder"
              >
                <Heart className={`h-4 w-4 ${saved.has(m.id) ? "fill-primary text-primary" : "text-foreground"}`} />
              </button>

              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <p className="line-clamp-2 font-serif text-sm leading-tight">{m.title}</p>
                <p className="mt-0.5 truncate text-[10px] text-white/80">{m.event}</p>
                <p className="mt-1 text-[9px] italic text-white/60">✨ {m.reason}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-4 mt-8 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-accent/30 to-background p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Films automatiques
        </div>
        <h2 className="mt-2 font-serif text-2xl leading-tight">Un montage vidéo<br />prêt en 30 secondes</h2>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Nous assemblons vos meilleurs moments en un mini-film avec musique et transitions.
        </p>
        <div className="mt-4 flex gap-2">
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground py-3 text-xs font-bold text-background">
            <Play className="h-3.5 w-3.5" /> Générer mon film
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-3 text-xs font-semibold">
            <Download className="h-3.5 w-3.5" />
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-3 text-xs font-semibold">
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
