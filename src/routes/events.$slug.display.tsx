import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Play, Pause, QrCode, Heart, MessageCircle, Sparkles, Settings, Maximize2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getEventBySlug } from "@/lib/events.functions";
import { adaptEvent } from "@/lib/event-adapter";
import { listAlbumMedia } from "@/lib/album.functions";
import { listGuestbookEntries } from "@/lib/guestbook.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/events/$slug/display")({
  head: () => ({
    meta: [
      { title: "Mode écran de salle · Memento Live" },
      { name: "description", content: "Diffusez un diaporama immersif sur l'écran de votre salle : photos, messages, QR code d'invitation." },
      { property: "og:title", content: "Mode écran de salle · Memento Live" },
      { property: "og:description", content: "Un diaporama en direct pour votre événement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ params }) => {
    const db = await getEventBySlug({ data: { slug: params.slug } });
    if (!db) throw notFound();
    return { event: adaptEvent(db), eventId: db.id };
  },
  component: Display,
});

const fallbackSlides = [
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop", caption: null, uploader_name: "" },
  { url: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600&auto=format&fit=crop", caption: null, uploader_name: "" },
  { url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&auto=format&fit=crop", caption: null, uploader_name: "" },
];

function Display() {
  const { event, eventId } = Route.useLoaderData();
  const listAlbum = useServerFn(listAlbumMedia);
  const listGb = useServerFn(listGuestbookEntries);

  const { data: media = [] } = useQuery({
    queryKey: ["display-album", eventId],
    queryFn: () => listAlbum({ data: { eventId } }),
    refetchInterval: 30_000,
  });
  const { data: entries = [] } = useQuery({
    queryKey: ["display-guestbook", eventId],
    queryFn: () => listGb({ data: { eventId } }),
    refetchInterval: 20_000,
  });

  const slides = useMemo(() => {
    const pics = media
      .filter((m) => m.media_type === "image" && m.url)
      .map((m) => ({ url: m.url, caption: m.caption, uploader_name: m.uploader_name ?? "" }));
    return pics.length ? pics : event.cover ? [{ url: event.cover, caption: null, uploader_name: "" }, ...fallbackSlides] : fallbackSlides;
  }, [media, event.cover]);

  const notes = useMemo(() => {
    const list = entries
      .filter((e) => (e.content ?? "").trim().length > 0)
      .map((e) => ({ author: e.author_name, note: e.content as string }));
    return list.length ? list : [{ author: event.title, note: "Bienvenue et merci d'être là ✨" }];
  }, [entries, event.title]);

  const ticker = useMemo(() => {
    return entries.slice(0, 8).map((e) => {
      const kindLabel: Record<string, string> = {
        text: "a laissé un message",
        photo: "a partagé une photo",
        video: "a partagé une vidéo",
        audio: "a laissé un message vocal 🎙",
      };
      return { name: e.author_name || "Un invité", action: kindLabel[e.kind] ?? "a participé" };
    });
  }, [entries]);

  const [slideIdx, setSlideIdx] = useState(0);
  const [noteIdx, setNoteIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);

  useEffect(() => {
    if (!playing || slides.length < 2) return;
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [playing, slides.length]);

  useEffect(() => {
    if (notes.length < 2) return;
    const t = setInterval(() => setNoteIdx((i) => (i + 1) % notes.length), 7000);
    return () => clearInterval(t);
  }, [notes.length]);

  useEffect(() => {
    if (!ticker.length) return;
    const t = setInterval(() => setTickerIdx((i) => (i + 1) % ticker.length), 3500);
    return () => clearInterval(t);
  }, [ticker.length]);

  // Realtime heart animations driven by live_reactions
  useEffect(() => {
    const ch = supabase
      .channel(`display-reactions-${eventId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_reactions", filter: `event_id=eq.${eventId}` },
        () => {
          setHearts((h) => [...h.slice(-8), { id: Date.now() + Math.random(), left: 10 + Math.random() * 80 }]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [eventId]);

  const slide = slides[slideIdx] ?? slides[0];
  const note = notes[noteIdx] ?? notes[0];
  const joinUrl = typeof window !== "undefined" ? `${window.location.origin}/join/${event.slug}` : `/join/${event.slug}`;
  const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}`;

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      {slides.map((s, i) => (
        <div
          key={s.url + i}
          className="absolute inset-0 transition-opacity duration-[1500ms]"
          style={{ opacity: i === slideIdx ? 1 : 0 }}
        >
          <img src={s.url} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ transform: "scale(1.06)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
        </div>
      ))}

      {hearts.map((h) => (
        <span
          key={h.id}
          className="pointer-events-none absolute bottom-24 text-3xl"
          style={{ left: `${h.left}%`, animation: "float-up 4s ease-out forwards" }}
        >
          💗
        </span>
      ))}

      <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-4 sm:p-6">
        <Link
          to="/events/$slug"
          params={{ slug: event.slug }}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur-xl"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/70">Bienvenue au</p>
          <p className="font-serif text-2xl leading-tight sm:text-3xl">{event.title}</p>
          {event.venue && <p className="mt-1 text-[11px] text-white/60">{event.venue}</p>}
        </div>

        <button
          onClick={() => {
            if (document.fullscreenElement) document.exitFullscreen();
            else document.documentElement.requestFullscreen?.();
          }}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur-xl"
          aria-label="Plein écran"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute bottom-32 left-1/2 max-w-md -translate-x-1/2 px-6 text-center sm:bottom-40">
        <p key={noteIdx} className="font-serif text-3xl italic leading-snug animate-in fade-in duration-700 sm:text-4xl">« {note.note} »</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">— {note.author}</p>
      </div>

      <div className="absolute bottom-6 left-4 flex items-center gap-3 sm:bottom-8 sm:left-6">
        <div className="rounded-2xl bg-white p-2.5 shadow-2xl">
          <img src={qrImg} alt="QR d'invitation" className="h-16 w-16 sm:h-20 sm:w-20" />
          <QrCode className="hidden" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">Rejoignez la fête</p>
          <p className="font-serif text-xl leading-tight">memento.live<br /><span className="text-accent">/{event.slug}</span></p>
        </div>
      </div>

      <div className="absolute bottom-6 right-4 flex flex-col items-end gap-3 sm:bottom-8 sm:right-6">
        {ticker.length > 0 && (
          <div className="rounded-full bg-white/15 px-4 py-2 backdrop-blur-xl">
            <p key={tickerIdx} className="text-xs sm:text-sm animate-in fade-in slide-in-from-right duration-500">
              <span className="font-bold">{ticker[tickerIdx].name}</span> {ticker[tickerIdx].action}
            </p>
          </div>
        )}
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs backdrop-blur">
            <Heart className="h-3.5 w-3.5 text-primary" /> {entries.length}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs backdrop-blur">
            <MessageCircle className="h-3.5 w-3.5 text-accent" /> {entries.filter((e) => e.kind === "text").length}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> {media.length}
          </span>
        </div>
      </div>

      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col items-center gap-3 sm:right-6">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 backdrop-blur-xl"
          aria-label={playing ? "Pause" : "Lecture"}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <button className="grid h-11 w-11 place-items-center rounded-full bg-white/10 backdrop-blur-xl" aria-label="Réglages">
          <Settings className="h-5 w-5" />
        </button>
        <div className="mt-2 flex flex-col gap-1.5">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-all ${i === slideIdx ? "h-6 bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
