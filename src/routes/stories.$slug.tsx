import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { X, ChevronLeft, ChevronRight, Send, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getEventBySlug, listEventStories } from "@/lib/events.functions";

export const Route = createFileRoute("/stories/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Story — ${params.slug} — Memento Live` },
      { name: "description", content: "Story de l'événement." },
          { name: "robots", content: "noindex" },
],
  }),
  component: Story,
});

type Slide = { id: string; url: string; media_type: string; author_name: string | null; author_avatar: string | null; created_at: string };

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
}

function Story() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const fetchEvent = useServerFn(getEventBySlug);
  const fetchStories = useServerFn(listEventStories);

  const [event, setEvent] = useState<Awaited<ReturnType<typeof getEventBySlug>> | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const ev = await fetchEvent({ data: { slug } });
      if (!alive) return;
      setEvent(ev);
      if (ev) {
        const rows = await fetchStories({ data: { eventId: ev.id } });
        if (!alive) return;
        setSlides(rows.map((r) => ({
          id: r.id,
          url: r.media_url,
          media_type: r.media_type,
          author_name: r.author_name,
          author_avatar: r.author_avatar,
          created_at: r.created_at,
        })));
      }
      setI(0);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [slug, fetchEvent, fetchStories]);

  useEffect(() => {
    if (paused || slides.length === 0) return;
    const t = setTimeout(() => {
      if (i < slides.length - 1) setI(i + 1);
      else navigate({ to: "/app" });
    }, 4000);
    return () => clearTimeout(t);
  }, [i, paused, slides.length, navigate]);

  if (loading) {
    return <div className="fixed inset-0 z-50 grid place-items-center bg-black text-white">Chargement…</div>;
  }
  if (!event) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-black text-white">
        <div className="text-center">
          <p>Événement introuvable.</p>
          <Link to="/app" className="mt-4 inline-block text-primary underline">Retour</Link>
        </div>
      </div>
    );
  }
  if (slides.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
        <p className="font-serif text-2xl">Aucune story pour le moment</p>
        <p className="mt-2 text-sm text-white/70">Les stories apparaissent ici pendant 24h.</p>
        <Link to="/events/$slug" params={{ slug }} className="mt-6 rounded-full bg-primary px-6 py-2 text-sm">Voir l'événement</Link>
      </div>
    );
  }

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
          {slide.author_avatar ? (
            <img src={slide.author_avatar} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-white/10 text-xs font-semibold">
              {(slide.author_name ?? "?").slice(0, 1)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{slide.author_name ?? event.title}</p>
            <p className="text-[11px] text-white/70">{event.type} · {timeAgo(slide.created_at)}</p>
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
        {slide.media_type === "video" ? (
          <video src={slide.url} className="h-full w-full object-cover" autoPlay muted playsInline />
        ) : (
          <img src={slide.url} alt="" className="h-full w-full object-cover" />
        )}

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
        <Link
          to="/events/$slug"
          params={{ slug }}
          className="flex flex-1 items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white/80 backdrop-blur"
        >
          Répondre sur l'événement…
          <Send className="ml-auto h-4 w-4" />
        </Link>
        <button className="grid h-11 w-11 place-items-center rounded-full bg-primary text-white shadow-glow" aria-label="J'aime">
          <Heart className="h-5 w-5" fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
