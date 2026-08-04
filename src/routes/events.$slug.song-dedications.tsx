import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Music2, Heart, Play, Sparkles, Volume2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/song-dedications")({
  component: SongDedications,
  head: () => ({
    meta: [
      { title: "Dédicaces musicales · MaFeliza" },
      { name: "description", content: "Offrez une chanson à quelqu'un que vous aimez, avec un mot personnel." },
      { property: "og:title", content: "Dédicaces musicales · MaFeliza" },
      { property: "og:description", content: "Un morceau, une émotion, une personne." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Dedication = { id: string; song: string; artist: string; from: string; to: string; note: string; hearts: number; art: string };

const initial: Dedication[] = [
  { id: "d1", song: "La vie en rose", artist: "Édith Piaf", from: "Papa Michel", to: "Sarah, ma fille", note: "Depuis que tu es petite, cette chanson me rappelle tes yeux qui pétillent.", hearts: 42, art: "bg-gradient-to-br from-primary to-primary-dark" },
  { id: "d2", song: "Perfect", artist: "Ed Sheeran", from: "Thomas", to: "Ma future femme", note: "La chanson de notre premier voyage. À nous deux, pour toujours.", hearts: 87, art: "bg-gradient-to-br from-gold to-primary" },
  { id: "d3", song: "September", artist: "Earth Wind & Fire", from: "Les témoins", to: "Les mariés", note: "Préparez-vous à danser toute la nuit !", hearts: 31, art: "bg-gradient-to-br from-primary-dark to-gold" },
];

function SongDedications() {
  const { slug } = useParams({ from: "/events/$slug/song-dedications" });
  const [items, setItems] = useState(initial);
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const like = (id: string) => {
    if (liked[id]) return;
    setLiked((l) => ({ ...l, [id]: true }));
    setItems((arr) => arr.map((d) => (d.id === id ? { ...d, hearts: d.hearts + 1 } : d)));
  };

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Dédicaces musicales</p>
          <p className="text-xs text-muted-foreground">{items.length} chansons offertes</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <Music2 className="h-6 w-6" />
          <p className="mt-3 font-serif text-2xl leading-tight">Offrez une chanson</p>
          <p className="mt-2 text-sm opacity-90">
            Le DJ la jouera durant la soirée avec votre message annoncé au micro.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Nouvelle dédicace
          </button>
        </section>

        <div className="space-y-3">
          {items.map((d) => (
            <article key={d.id} className="overflow-hidden rounded-3xl bg-surface shadow-soft">
              <div className={`${d.art} flex items-center gap-3 p-4 text-white`}>
                <button className="grid h-12 w-12 place-items-center rounded-full bg-white/25 backdrop-blur transition hover:bg-white/40">
                  <Play className="h-5 w-5 fill-current" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-serif text-lg leading-tight">{d.song}</p>
                  <p className="truncate text-xs opacity-90">{d.artist}</p>
                </div>
                <Volume2 className="h-5 w-5 opacity-80" />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full bg-cream px-2.5 py-1">
                    De <span className="font-semibold">{d.from}</span>
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                    Pour <span className="font-semibold">{d.to}</span>
                  </span>
                </div>
                <p className="font-serif text-sm italic leading-relaxed text-foreground">« {d.note} »</p>
                <button
                  onClick={() => like(d.id)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  <Heart className={`h-4 w-4 ${liked[d.id] ? "fill-current" : ""}`} />
                  {d.hearts}
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <div className="fixed bottom-20 left-1/2 z-30 -translate-x-1/2">
        <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow">
          <Music2 className="h-4 w-4" /> Ajouter une dédicace
        </button>
      </div>
    </div>
  );
}
