import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Play, Pause, QrCode, Heart, MessageCircle, Sparkles, Settings, Maximize2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { findEvent } from "@/lib/mock-data";

export const Route = createFileRoute("/events/$slug/display")({
  component: Display,
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
});

const slides = [
  { img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop", author: "Léa", note: "Vous êtes magnifiques ✨" },
  { img: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600&auto=format&fit=crop", author: "Papa", note: "Fier de toi ma fille." },
  { img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&auto=format&fit=crop", author: "Camille", note: "Que la fête commence ! 🥂" },
  { img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&auto=format&fit=crop", author: "Julien", note: "Vive les mariés !" },
  { img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&auto=format&fit=crop", author: "Sophie", note: "Un jour inoubliable, merci ❤️" },
];

const liveTicker = [
  { name: "Marie", action: "vient d'ajouter 3 photos" },
  { name: "Thomas", action: "a laissé un message vocal 🎙" },
  { name: "Anna", action: "a envoyé un cœur 💗" },
  { name: "Lucas", action: "a rejoint la salle" },
  { name: "Jade", action: "a réservé une danse" },
];

function Display() {
  const { slug } = useParams({ from: "/events/$slug/display" });
  const event = useMemo(() => findEvent(slug), [slug]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [playing]);

  useEffect(() => {
    const t = setInterval(() => setTickerIdx((i) => (i + 1) % liveTicker.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setHearts((h) => [
        ...h.slice(-5),
        { id: Date.now() + Math.random(), left: 10 + Math.random() * 80 },
      ]);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[idx];
  const nextSlide = slides[(idx + 1) % slides.length];

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1500ms]"
          style={{ opacity: i === idx ? 1 : 0 }}
        >
          <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ transform: "scale(1.06)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
        </div>
      ))}

      <img src={nextSlide.img} alt="" className="hidden" />

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
          params={{ slug }}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur-xl"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/70">Bienvenue au</p>
          <p className="font-serif text-2xl leading-tight sm:text-3xl">{event?.title ?? "Mariage Sarah & Thomas"}</p>
          <p className="mt-1 text-[11px] text-white/60">14 juin 2026 · {event?.venue ?? "Château de Villette"}</p>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur-xl"
          aria-label="Plein écran"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute bottom-32 left-1/2 max-w-md -translate-x-1/2 px-6 text-center sm:bottom-40">
        <p className="font-serif text-3xl italic leading-snug sm:text-4xl">« {slide.note} »</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">— {slide.author}</p>
      </div>

      <div className="absolute bottom-6 left-4 flex items-center gap-3 sm:bottom-8 sm:left-6">
        <div className="rounded-2xl bg-white p-2.5 shadow-2xl">
          <QrCode className="h-16 w-16 text-black sm:h-20 sm:w-20" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">Rejoignez la fête</p>
          <p className="font-serif text-xl leading-tight">memento.live<br /><span className="text-accent">/sarah-thomas</span></p>
          <p className="mt-0.5 text-[11px] text-white/60">Code : <span className="font-mono font-bold">STH-2026</span></p>
        </div>
      </div>

      <div className="absolute bottom-6 right-4 flex flex-col items-end gap-3 sm:bottom-8 sm:right-6">
        <div className="rounded-full bg-white/15 px-4 py-2 backdrop-blur-xl">
          <p key={tickerIdx} className="text-xs sm:text-sm animate-in fade-in slide-in-from-right duration-500">
            <span className="font-bold">{liveTicker[tickerIdx].name}</span> {liveTicker[tickerIdx].action}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs backdrop-blur">
            <Heart className="h-3.5 w-3.5 text-primary" /> 1 284
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs backdrop-blur">
            <MessageCircle className="h-3.5 w-3.5 text-accent" /> 96
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> {event?.photosCount ?? 428}
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
              className={`h-1.5 w-1.5 rounded-full transition-all ${i === idx ? "h-6 bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
