import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Share2, Bell, Sparkles, Calendar, MapPin, Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getEventBySlug } from "@/lib/events.functions";
import { adaptEvent } from "@/lib/event-adapter";
import { getEventStats } from "@/lib/stats.functions";

export const Route = createFileRoute("/events/$slug/countdown")({
  head: () => ({
    meta: [
      { title: "Compte à rebours · Memento Live" },
      { name: "description", content: "Compte à rebours immersif plein écran vers votre événement, à partager avec vos proches." },
      { property: "og:title", content: "Compte à rebours · Memento Live" },
      { property: "og:description", content: "Le grand jour approche." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ params }) => {
    const db = await getEventBySlug({ data: { slug: params.slug } });
    if (!db) throw notFound();
    const stats = await getEventStats({ data: { eventId: db.id } });
    return { event: adaptEvent(db), targetIso: db.event_date, stats };
  },
  component: Countdown,
});

type Theme = "rose" | "gold" | "night";

const themes: Record<Theme, { bg: string; accent: string; text: string; subtext: string }> = {
  rose: {
    bg: "linear-gradient(160deg, #FFF8F4 0%, #FFE4EC 45%, #E85D8E 100%)",
    accent: "#D9A441",
    text: "text-foreground",
    subtext: "text-foreground/70",
  },
  gold: {
    bg: "linear-gradient(160deg, #1a1408 0%, #4a3620 50%, #D9A441 100%)",
    accent: "#FFF8F4",
    text: "text-white",
    subtext: "text-white/70",
  },
  night: {
    bg: "linear-gradient(160deg, #0a0a1a 0%, #2a1a3d 50%, #E85D8E 100%)",
    accent: "#D9A441",
    text: "text-white",
    subtext: "text-white/70",
  },
};

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

function Countdown() {
  const { event, targetIso, stats } = Route.useLoaderData();
  const target = useMemo(() => (targetIso ? new Date(targetIso) : new Date(Date.now() + 86_400_000 * 30)), [targetIso]);
  const { days, hours, minutes, seconds } = useCountdown(target);
  const [theme, setTheme] = useState<Theme>("rose");
  const t = themes[theme];

  const dateLabel = targetIso
    ? target.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      + " · " + target.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : "Date à confirmer";

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.origin + "/events/" + event.slug : "";
    if (navigator.share) {
      try { await navigator.share({ title: event.title, url }); } catch {}
    } else {
      navigator.clipboard?.writeText(url);
    }
  };


  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: t.bg }}>
      <div className={`absolute inset-0 flex flex-col ${t.text}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            to="/events/$slug"
            params={{ slug: event.slug }}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <button onClick={share} className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur" aria-label="Partager">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: t.accent }}>
            <Sparkles className="h-3 w-3" /> Save the date
          </div>
          <h1 className="mt-4 font-serif text-4xl leading-tight">
            {event.title}
          </h1>
          <div className={`mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs ${t.subtext}`}>
            <span className="inline-flex items-center gap-1 capitalize">
              <Calendar className="h-3 w-3" /> {dateLabel}
            </span>
            {event.venue && (
              <>
                <span className="hidden sm:inline">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {event.venue}
                </span>
              </>
            )}
          </div>

          <div className="mt-10 grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { v: days, l: "Jours" },
              { v: hours, l: "Heures" },
              { v: minutes, l: "Minutes" },
              { v: seconds, l: "Secondes" },
            ].map((u) => (
              <div key={u.l} className="rounded-3xl bg-white/15 px-3 py-5 backdrop-blur-md">
                <p className="font-serif text-4xl leading-none tabular-nums sm:text-6xl">{String(u.v).padStart(2, "0")}</p>
                <p className={`mt-2 text-[10px] font-bold uppercase tracking-[0.25em] ${t.subtext}`}>{u.l}</p>
              </div>
            ))}
          </div>

          {event.description && (
            <p className={`mt-8 max-w-xs text-sm italic ${t.subtext}`}>« {event.description} »</p>
          )}

          <div className="mt-8 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold backdrop-blur">
              <Heart className="h-3 w-3" style={{ color: t.accent }} /> {stats.guestsConfirmed} invités confirmés
            </span>
          </div>
        </div>

        <div className="px-4 pb-6">
          <div className="mb-3 flex justify-center gap-2">
            {(["rose", "gold", "night"] as Theme[]).map((k) => (
              <button
                key={k}
                onClick={() => setTheme(k)}
                aria-label={`Thème ${k}`}
                className={`h-8 w-8 rounded-full ring-2 transition-transform ${
                  theme === k ? "ring-white scale-110" : "ring-white/30"
                }`}
                style={{ background: themes[k].bg }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-bold text-foreground shadow-glow">
              <Share2 className="h-4 w-4" /> Partager
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black/40 py-3 text-sm font-semibold text-white backdrop-blur">
              <Bell className="h-4 w-4" /> Me rappeler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
