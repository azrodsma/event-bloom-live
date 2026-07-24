import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Search, Play, Pause, Heart, Plus, Music2, Clock } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/playlist")({
  component: Playlist,
  head: () => ({
    meta: [
      { title: "Playlist · Memento Live" },
      { name: "description", content: "Composez ensemble la bande-son de votre événement. Chaque invité peut suggérer ses morceaux favoris." },
      { property: "og:title", content: "Playlist collaborative · Memento Live" },
      { property: "og:description", content: "La bande-son collaborative de votre événement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  addedBy: string;
  votes: number;
  liked: boolean;
  moment: "Cérémonie" | "Cocktail" | "Dîner" | "Ouverture bal" | "Soirée";
}

const initialTracks: Track[] = [
  { id: "s1", title: "At Last", artist: "Etta James", duration: "3:01", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&auto=format&fit=crop", addedBy: "Sarah", votes: 42, liked: true, moment: "Ouverture bal" },
  { id: "s2", title: "Perfect", artist: "Ed Sheeran", duration: "4:23", cover: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=200&auto=format&fit=crop", addedBy: "Camille", votes: 38, liked: true, moment: "Ouverture bal" },
  { id: "s3", title: "September", artist: "Earth, Wind & Fire", duration: "3:35", cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&auto=format&fit=crop", addedBy: "Julien", votes: 51, liked: false, moment: "Soirée" },
  { id: "s4", title: "Blinding Lights", artist: "The Weeknd", duration: "3:20", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&auto=format&fit=crop", addedBy: "Léa", votes: 47, liked: false, moment: "Soirée" },
  { id: "s5", title: "Clair de Lune", artist: "Debussy", duration: "5:04", cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&auto=format&fit=crop", addedBy: "Sarah", votes: 22, liked: true, moment: "Cérémonie" },
  { id: "s6", title: "Fly Me to the Moon", artist: "Frank Sinatra", duration: "2:28", cover: "https://images.unsplash.com/photo-1445375011782-2384686778a0?w=200&auto=format&fit=crop", addedBy: "Thomas", votes: 30, liked: false, moment: "Cocktail" },
  { id: "s7", title: "La Vie en Rose", artist: "Édith Piaf", duration: "3:07", cover: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=200&auto=format&fit=crop", addedBy: "Camille", votes: 35, liked: true, moment: "Dîner" },
  { id: "s8", title: "Uptown Funk", artist: "Bruno Mars", duration: "4:30", cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&auto=format&fit=crop", addedBy: "Julien", votes: 44, liked: false, moment: "Soirée" },
];

const moments = ["Tous", "Cérémonie", "Cocktail", "Dîner", "Ouverture bal", "Soirée"] as const;

function Playlist() {
  const { slug } = useParams({ from: "/events/$slug/playlist" });
  const [tracks, setTracks] = useState(initialTracks);
  const [moment, setMoment] = useState<(typeof moments)[number]>("Tous");
  const [search, setSearch] = useState("");
  const [playing, setPlaying] = useState<string | null>("s1");

  const filtered = useMemo(() => {
    return tracks
      .filter((t) => (moment === "Tous" ? true : t.moment === moment))
      .filter((t) => (search ? (t.title + " " + t.artist).toLowerCase().includes(search.toLowerCase()) : true))
      .sort((a, b) => b.votes - a.votes);
  }, [tracks, moment, search]);

  const totalDuration = tracks.reduce((acc, t) => {
    const [m, s] = t.duration.split(":").map(Number);
    return acc + m * 60 + s;
  }, 0);

  const hrs = Math.floor(totalDuration / 3600);
  const mins = Math.floor((totalDuration % 3600) / 60);

  function toggleLike(id: string) {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, liked: !t.liked, votes: t.liked ? t.votes - 1 : t.votes + 1 } : t)));
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Playlist</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Ajouter un morceau">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/20 to-transparent px-4 pb-8 pt-6">
        <div className="flex items-center gap-4">
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-primary to-accent text-white shadow-glow">
            <Music2 className="h-10 w-10" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Playlist collaborative</p>
            <h1 className="mt-1 font-serif text-2xl leading-tight">Bande-son du Grand Jour</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {tracks.length} titres · {hrs}h{mins.toString().padStart(2, "0")}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-semibold text-background">
            <Play className="h-4 w-4 fill-current" /> Lecture aléatoire
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-full border border-border bg-background" aria-label="Rechercher">
            <Search className="h-4 w-4" />
          </button>
        </div>
      </section>

      <div className="px-4">
        <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un titre ou artiste…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="scrollbar-none mt-4 flex gap-2 overflow-x-auto px-4 pb-4">
        {moments.map((m) => (
          <button
            key={m}
            onClick={() => setMoment(m)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              m === moment ? "bg-foreground text-background" : "border border-border bg-background"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <ul className="space-y-1 px-2">
        {filtered.map((t, idx) => {
          const isPlaying = playing === t.id;
          return (
            <li
              key={t.id}
              className={`flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors ${
                isPlaying ? "bg-primary/5" : "hover:bg-secondary/50"
              }`}
            >
              <span className="w-5 text-center text-xs font-mono text-muted-foreground">{idx + 1}</span>
              <button
                onClick={() => setPlaying(isPlaying ? null : t.id)}
                className="relative shrink-0"
                aria-label={isPlaying ? "Pause" : "Lecture"}
              >
                <img src={t.cover} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <span className="absolute inset-0 grid place-items-center rounded-xl bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                  {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 fill-white text-white" />}
                </span>
              </button>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm ${isPlaying ? "font-semibold text-primary" : "font-medium"}`}>{t.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {t.artist} · Ajouté par {t.addedBy}
                </p>
              </div>
              <span className="hidden shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium sm:inline">{t.moment}</span>
              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {t.duration}
              </span>
              <button onClick={() => toggleLike(t.id)} className="grid h-9 w-9 shrink-0 place-items-center" aria-label="J'aime">
                <Heart className={`h-4 w-4 ${t.liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                <span className="sr-only">{t.votes}</span>
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="py-16 text-center text-sm text-muted-foreground">Aucun morceau ne correspond.</li>
        )}
      </ul>

      <div className="mx-4 mt-8 rounded-3xl border border-dashed border-border p-5 text-center">
        <p className="font-serif text-lg">Vos invités peuvent suggérer</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Activez la contribution ouverte pour que chacun ajoute ses morceaux préférés.
        </p>
        <button className="mt-4 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background">
          Ouvrir aux invités
        </button>
      </div>
    </div>
  );
}
