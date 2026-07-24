import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { X, ChevronLeft, ChevronRight, Send, Heart } from "lucide-react";
import { findEvent, stories } from "@/lib/mock-data";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/stories/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Story — ${params.slug} — Memento Live` },
      { name: "description", content: "Story de l'événement." },
    ],
  }),
  loader: ({ params }) => {
    const event = findEvent(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  component: Story,
});

const slides = [
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200", caption: "Le grand jour est arrivé ✨" },
  { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200", caption: "La cérémonie commence" },
  { url: "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1200", caption: "Les premiers mots" },
  { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1200", caption: "Le cocktail 🥂" },
];

function Story() {
  const { event } = Route.useLoaderData();
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      if (i < slides.length - 1) setI(i + 1);
      else {
        const idx = stories.findIndex((s) => s.event === event.slug);
        const next = stories[(idx + 1) % stories.length];
        navigate({ to: "/stories/$slug", params: { slug: next.event } });
      }
    }, 4000);
    return () => clearTimeout(t);
  }, [i, paused, event.slug, navigate]);

  const slide = slides[i];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="absolute inset-x-3 top-3 z-20 flex gap-1">
        {slides.map((_, idx) => (
          <div key={idx} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full bg-white transition-all"
              style={{
                width: idx < i ? "100%" : idx === i ? (paused ? "50%" : "100%") : "0%",
                transitionDuration: idx === i && !paused ? "4000ms" : "0ms",
              }}
            />
          </div>
        ))}
      </div>

      <header className="absolute inset-x-0 top-6 z-20 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <img src={event.cover} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
          <div>
            <p className="text-sm font-semibold">{event.title}</p>
            <p className="text-[11px] text-white/70">{event.type} · il y a 2 h</p>
          </div>
        </div>
        <Link to="/app" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur" aria-label="Fermer">
          <X className="h-5 w-5" />
        </Link>
      </header>

      <div
        className="relative flex flex-1 select-none items-center justify-center"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        <img src={slide.url} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-x-6 bottom-28 text-center">
          <p className="font-serif text-2xl text-white drop-shadow">{slide.caption}</p>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setI(Math.max(0, i - 1)); }}
          className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setI(Math.min(slides.length - 1, i + 1)); }}
          className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur"
          aria-label="Suivant"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 backdrop-blur">
          <input
            placeholder="Envoyer un message…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
          />
          <button className="text-white" aria-label="Envoyer"><Send className="h-4 w-4" /></button>
        </div>
        <button className="grid h-11 w-11 place-items-center rounded-full bg-primary text-white shadow-glow" aria-label="J'aime">
          <Heart className="h-5 w-5" fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
