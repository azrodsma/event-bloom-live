import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Camera, Sparkles, RotateCcw, Timer, Download, Share2, Grid3x3 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/photobooth")({
  component: Photobooth,
  head: () => ({
    meta: [
      { title: "Photobooth · Memento Live" },
      { name: "description", content: "Capturez des instants avec des filtres et accessoires virtuels — vos photos rejoignent instantanément l'album." },
      { property: "og:title", content: "Photobooth · Memento Live" },
      { property: "og:description", content: "Un photobooth intégré à votre événement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface Filter {
  id: string;
  name: string;
  emoji: string;
  overlay: string;
}

const filters: Filter[] = [
  { id: "none", name: "Original", emoji: "✨", overlay: "" },
  { id: "gold", name: "Doré", emoji: "🌟", overlay: "linear-gradient(135deg, rgba(217,164,65,0.35), transparent 60%)" },
  { id: "rose", name: "Rose poudré", emoji: "🌸", overlay: "linear-gradient(135deg, rgba(232,93,142,0.28), transparent 65%)" },
  { id: "vintage", name: "Vintage", emoji: "📸", overlay: "linear-gradient(135deg, rgba(139,58,58,0.35), rgba(217,164,65,0.15))" },
  { id: "noir", name: "Noir & or", emoji: "🖤", overlay: "linear-gradient(180deg, rgba(0,0,0,0.4), rgba(217,164,65,0.15))" },
  { id: "confetti", name: "Confettis", emoji: "🎉", overlay: "" },
];

const stickers = ["💐", "💍", "🎂", "🎊", "💖", "🥂", "👰", "🤵", "🕊️", "✨"];

const gallery = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519690889869-e705e59f72e1?w=400&auto=format&fit=crop",
];

const scenePhoto = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop";

function Photobooth() {
  const { slug } = useParams({ from: "/events/$slug/photobooth" });
  const [filter, setFilter] = useState<Filter>(filters[2]);
  const [timer, setTimer] = useState<0 | 3 | 5>(0);
  const [gridMode, setGridMode] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [captured, setCaptured] = useState(false);

  function capture() {
    if (timer === 0) {
      flash();
      return;
    }
    setCountdown(timer);
    const iv = setInterval(() => {
      setCountdown((c) => {
        if (c === null) return null;
        if (c <= 1) {
          clearInterval(iv);
          flash();
          return null;
        }
        return c - 1;
      });
    }, 1000);
  }

  function flash() {
    setCaptured(true);
    setTimeout(() => setCaptured(false), 900);
  }

  return (
    <div className="min-h-screen bg-foreground pb-24 text-background">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-foreground/80 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Photobooth</p>
        <button onClick={() => setGridMode((g) => !g)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10" aria-label="Grille">
          <Grid3x3 className={`h-4 w-4 ${gridMode ? "text-primary" : ""}`} />
        </button>
      </div>

      <div className="px-4 pt-4">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl bg-black shadow-2xl">
          <img src={scenePhoto} alt="Aperçu photobooth" className="h-full w-full object-cover" />

          {filter.overlay && (
            <div className="absolute inset-0 mix-blend-overlay" style={{ background: filter.overlay }} />
          )}

          {gridMode && (
            <div className="pointer-events-none absolute inset-0">
              <div className="h-full w-full grid grid-cols-3 grid-rows-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 text-xs">
            <span className="rounded-full bg-black/50 px-3 py-1 backdrop-blur">● En direct</span>
            <span className="rounded-full bg-black/50 px-3 py-1 backdrop-blur">
              {filter.emoji} {filter.name}
            </span>
          </div>

          {countdown !== null && (
            <div className="absolute inset-0 grid place-items-center bg-black/40 backdrop-blur-sm">
              <span className="font-serif text-9xl text-white drop-shadow-2xl">{countdown}</span>
            </div>
          )}

          {captured && <div className="absolute inset-0 animate-pulse bg-white" />}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
            <div className="rounded-2xl bg-black/50 px-3 py-2 text-[10px] backdrop-blur">
              <p className="font-serif text-sm leading-none">Mariage Sarah & Thomas</p>
              <p className="mt-0.5 opacity-70">24.07.2026</p>
            </div>
            <span className="text-3xl drop-shadow-lg">💐</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            onClick={() => setTimer(timer === 0 ? 3 : timer === 3 ? 5 : 0)}
            className="flex flex-col items-center gap-1 text-xs opacity-80"
            aria-label="Minuterie"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5">
              <Timer className="h-5 w-5" />
            </span>
            {timer === 0 ? "Off" : `${timer}s`}
          </button>

          <button
            onClick={capture}
            className="relative grid h-20 w-20 place-items-center rounded-full border-4 border-white/30"
            aria-label="Prendre une photo"
          >
            <span className="h-16 w-16 rounded-full bg-white transition-transform active:scale-90" />
          </button>

          <button className="flex flex-col items-center gap-1 text-xs opacity-80" aria-label="Retourner la caméra">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5">
              <RotateCcw className="h-5 w-5" />
            </span>
            Retourner
          </button>
        </div>
      </div>

      <section className="mt-8 px-4">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] opacity-70">Filtres</p>
        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f)}
              className={`flex flex-col items-center gap-1.5 ${filter.id === f.id ? "opacity-100" : "opacity-60"}`}
            >
              <span
                className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${
                  filter.id === f.id ? "ring-2 ring-primary ring-offset-2 ring-offset-foreground" : "bg-white/5"
                }`}
                style={f.overlay ? { background: f.overlay } : undefined}
              >
                {f.emoji}
              </span>
              <span className="text-[10px]">{f.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] opacity-70">Accessoires virtuels</p>
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
          {stickers.map((s, i) => (
            <button
              key={i}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/5 text-2xl transition-transform hover:scale-110"
              aria-label="Ajouter accessoire"
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 px-4">
        <div className="flex items-baseline justify-between">
          <p className="font-serif text-lg">Mes photos</p>
          <span className="text-xs opacity-60">{gallery.length} clichés</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {gallery.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-white/5">
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">
            <Share2 className="h-4 w-4" /> Ajouter à l'album
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-full border border-white/20" aria-label="Télécharger">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="mx-4 mt-8 flex items-center gap-3 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-4">
        <Sparkles className="h-6 w-6 text-primary" />
        <div className="flex-1">
          <p className="font-serif text-sm">Cadres animés Premium</p>
          <p className="text-[11px] opacity-70">Débloquez des filtres exclusifs avec Memento Premium</p>
        </div>
        <Link to="/app/premium" className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-foreground">
          Voir
        </Link>
      </section>
    </div>
  );
}
