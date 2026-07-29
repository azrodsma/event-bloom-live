import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Music, Play, Pause, Vote, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/dj-requests")({
  component: DJRequests,
  head: () => ({
    meta: [
      { title: "Demandes au DJ · Memento Live" },
      { name: "description", content: "Les invités votent en direct pour les prochains morceaux — le DJ pilote sa piste en temps réel." },
      { property: "og:title", content: "Demandes au DJ · Memento Live" },
      { property: "og:description", content: "La foule choisit, la piste s'enflamme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Track = {
  id: string;
  title: string;
  artist: string;
  requestedBy: string;
  votes: number;
  duration: string;
  mood: "chill" | "dancefloor" | "slow" | "sing";
  cover: string;
  played?: boolean;
};

const initialTracks: Track[] = [
  { id: "t1", title: "September", artist: "Earth, Wind & Fire", requestedBy: "Léa", votes: 42, duration: "3:35", mood: "dancefloor", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200" },
  { id: "t2", title: "L'Été indien", artist: "Joe Dassin", requestedBy: "Michel (père)", votes: 38, duration: "4:35", mood: "sing", cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200" },
  { id: "t3", title: "Perfect", artist: "Ed Sheeran", requestedBy: "Julie", votes: 35, duration: "4:23", mood: "slow", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200" },
  { id: "t4", title: "Freed From Desire", artist: "Gala", requestedBy: "Cousins", votes: 34, duration: "3:44", mood: "dancefloor", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200" },
  { id: "t5", title: "Alors on danse", artist: "Stromae", requestedBy: "Antoine", votes: 28, duration: "3:26", mood: "dancefloor", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200" },
  { id: "t6", title: "Cœur de pirate", artist: "Comme des enfants", requestedBy: "Camille", votes: 12, duration: "3:03", mood: "chill", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200", played: true },
];

const moodStyle = {
  dancefloor: "bg-primary text-primary-foreground",
  slow: "bg-rose-50 text-rose-700",
  sing: "bg-amber-50 text-amber-700",
  chill: "bg-sky-50 text-sky-700",
} as const;

function DJRequests() {
  const { slug } = useParams({ from: "/events/$slug/dj-requests" });
  const [tracks, setTracks] = useState(initialTracks);
  const [voted, setVoted] = useState<Set<string>>(new Set(["t3"]));
  const [playing, setPlaying] = useState<string | null>(null);

  const vote = (id: string) => {
    setTracks((p) =>
      p.map((t) => (t.id === id ? { ...t, votes: t.votes + (voted.has(id) ? -1 : 1) } : t))
    );
    setVoted((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const queue = [...tracks].filter((t) => !t.played).sort((a, b) => b.votes - a.votes);
  const next = queue[0];

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-col items-center">
          <p className="font-serif text-base leading-none">Demandes au DJ</p>
          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live · 22h41
          </p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Music className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/70 to-foreground px-4 pb-6 pt-6 text-primary-foreground">
        <p className="text-[10px] uppercase tracking-widest text-primary-foreground/70">Prochainement</p>
        <div className="mt-3 flex items-center gap-3">
          <img src={next.cover} alt="" className="h-16 w-16 rounded-2xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-lg leading-tight">{next.title}</p>
            <p className="truncate text-[12px] text-primary-foreground/80">{next.artist}</p>
            <p className="mt-1 text-[10px] text-primary-foreground/70">
              Demandé par {next.requestedBy} · {next.votes} votes
            </p>
          </div>
          <button
            onClick={() => setPlaying((p) => (p === next.id ? null : next.id))}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-primary"
            aria-label="Lire"
          >
            {playing === next.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
          </button>
        </div>
        <div className="mt-4 flex h-6 items-end gap-[3px]">
          {Array.from({ length: 42 }).map((_, i) => (
            <span
              key={i}
              className="flex-1 rounded-sm bg-primary-foreground/60"
              style={{ height: `${20 + Math.abs(Math.sin(i * 0.5)) * 80}%` }}
            />
          ))}
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">File d'attente</h2>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <TrendingUp className="h-3 w-3" /> Trié par votes
          </span>
        </div>
        <ul className="space-y-2">
          {queue.map((t, i) => {
            const on = voted.has(t.id);
            return (
              <li key={t.id} className={`rounded-2xl border p-3 transition ${i === 0 ? "border-primary bg-primary/5" : "border-border/60 bg-card"}`}>
                <div className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-foreground text-[10px] font-bold text-background">
                    {i + 1}
                  </span>
                  <img src={t.cover} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-serif text-[14px] leading-tight">{t.title}</p>
                      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${moodStyle[t.mood]}`}>
                        {t.mood}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">{t.artist} · {t.duration}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Par {t.requestedBy}
                    </p>
                  </div>
                  <button
                    onClick={() => vote(t.id)}
                    className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                      on ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                    }`}
                  >
                    <Vote className="h-3 w-3" /> {t.votes}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Suggestion</p>
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Proposer un morceau</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Recherchez dans le catalogue — le DJ valide chaque demande avant de la mettre en file.
        </p>
        <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          + Ajouter un titre
        </button>
      </section>
    </div>
  );
}
