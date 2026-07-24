import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEvent, eventTypeIcons } from "@/lib/mock-data";
import {
  MapPin,
  Calendar,
  Share2,
  Heart,
  ChevronLeft,
  Radio,
  BookHeart,
  Camera,
  Gift,
  Users,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/events/$slug")({
  head: ({ params }) => {
    const e = findEvent(params.slug);
    if (!e) return { meta: [{ title: "Événement — Memento Live" }] };
    return {
      meta: [
        { title: `${e.title} — Memento Live` },
        { name: "description", content: e.description },
        { property: "og:title", content: e.title },
        { property: "og:description", content: e.description },
        { property: "og:image", content: e.cover },
        { name: "twitter:image", content: e.cover },
      ],
    };
  },
  loader: ({ params }) => {
    const e = findEvent(params.slug);
    if (!e) throw notFound();
    return { event: e };
  },
  component: EventPage,
});

function useCountdown(iso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(iso).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, done: diff === 0 };
}

function EventPage() {
  const { event } = Route.useLoaderData();
  const cd = useCountdown(event.date);
  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Hero */}
      <header className="relative">
        <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          <img src={event.cover} alt={event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/50" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <Link to="/app" className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex gap-2">
              <button className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur">
                <Heart className="h-4 w-4" />
              </button>
              <Link
                to="/events/$slug/invite"
                params={{ slug: event.slug }}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur"
                aria-label="Partager"
              >
                <Share2 className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <div className="mx-auto max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold">
                  {eventTypeIcons[event.type as keyof typeof eventTypeIcons]} {event.type}
                </span>
                {event.isLive && (
                  <span className="animate-pulse-live rounded-full bg-live px-3 py-1 text-xs font-bold uppercase text-white">
                    ● Live · {event.viewers?.toLocaleString("fr-FR")} spectateurs
                  </span>
                )}
              </div>
              <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground sm:text-6xl">{event.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground/80">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.venue}, {event.city}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />
                  {new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-6">
        {/* Description */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-sm leading-relaxed text-foreground">{event.description}</p>
        </section>

        {/* Live block */}
        {event.livestream && (
          <Link
            to="/events/$slug/live"
            params={{ slug: event.slug }}
            className="block overflow-hidden rounded-3xl bg-gradient-live p-5 text-white shadow-glow"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur">
                <Radio className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest">
                  {event.isLive ? "En direct maintenant" : "Live prévu"}
                </p>
                <p className="mt-0.5 font-serif text-xl">Rejoindre la diffusion</p>
                <p className="mt-0.5 text-xs opacity-90">
                  Via {event.livestream.platform} · Chat, réactions, cagnotte
                </p>
              </div>
              {event.isLive && (
                <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                  <Users className="h-3 w-3" /> {event.viewers?.toLocaleString("fr-FR")}
                </div>
              )}
            </div>
          </Link>
        )}

        {/* Countdown */}
        {!cd.done && !event.isLive && (
          <section className="rounded-3xl bg-gradient-warm p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Compte à rebours</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[
                { v: cd.d, l: "Jours" },
                { v: cd.h, l: "Heures" },
                { v: cd.m, l: "Min" },
                { v: cd.s, l: "Sec" },
              ].map((x) => (
                <div key={x.l} className="rounded-2xl bg-surface p-3 shadow-card">
                  <div className="font-serif text-3xl text-foreground">{String(x.v).padStart(2, "0")}</div>
                  <div className="text-[10px] text-muted-foreground">{x.l}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Money pot */}
        {event.moneyPot && (
          <section className="rounded-3xl bg-surface p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-light text-gold">
                <Gift className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cagnotte via {event.moneyPot.platform}
                </p>
                <p className="font-serif text-xl">{event.moneyPot.title}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-end justify-between">
                <span className="font-serif text-3xl">
                  {event.moneyPot.current.toLocaleString("fr-FR")} {event.moneyPot.currency}
                </span>
                <span className="text-sm text-muted-foreground">
                  sur {event.moneyPot.target.toLocaleString("fr-FR")} {event.moneyPot.currency}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary-light">
                <div
                  className="h-full rounded-full bg-gradient-primary"
                  style={{ width: `${Math.min(100, (event.moneyPot.current / event.moneyPot.target) * 100)}%` }}
                />
              </div>
            </div>
            <a
              href={event.moneyPot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow"
            >
              Participer à la cagnotte <ExternalLink className="h-4 w-4" />
            </a>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Cette cagnotte est gérée par une plateforme externe. Memento Live ne collecte pas et ne conserve pas les fonds.
            </p>
          </section>
        )}

        {/* Quick blocks */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/events/$slug/guestbook"
            params={{ slug: event.slug }}
            className="rounded-3xl bg-surface p-5 shadow-card"
          >
            <BookHeart className="h-6 w-6 text-primary" />
            <p className="mt-3 font-serif text-lg">Livre d'or</p>
            <p className="text-xs text-muted-foreground">{event.guestbookCount} messages</p>
          </Link>
          <Link
            to="/events/$slug/album"
            params={{ slug: event.slug }}
            className="rounded-3xl bg-surface p-5 shadow-card"
          >
            <Camera className="h-6 w-6 text-primary" />
            <p className="mt-3 font-serif text-lg">Album</p>
            <p className="text-xs text-muted-foreground">{event.photosCount} photos</p>
          </Link>
        </div>

        {/* Venue */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lieu</p>
          <p className="mt-1 font-serif text-lg">{event.venue}</p>
          <p className="text-sm text-muted-foreground">{event.city}, {event.country}</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(event.venue + " " + event.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold"
          >
            <MapPin className="h-3.5 w-3.5" /> Voir sur la carte
          </a>
        </section>

        {/* Souvenir / recap */}
        <Link
          to="/events/$slug/souvenir"
          params={{ slug: event.slug }}
          className="relative flex items-center gap-4 overflow-hidden rounded-3xl bg-gradient-primary p-5 text-white shadow-glow"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            ✨
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest opacity-90">Le souvenir</p>
            <p className="font-serif text-xl">Revivez la journée en un clin d'œil</p>
          </div>
          <span className="text-xl">→</span>
        </Link>

        {/* Organizer actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/events/$slug/guests"
            params={{ slug: event.slug }}
            className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold"
          >
            <Users className="h-4 w-4 text-primary" /> Invités
          </Link>
          <Link
            to="/events/$slug/edit"
            params={{ slug: event.slug }}
            className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold"
          >
            <Calendar className="h-4 w-4 text-primary" /> Modifier
          </Link>
        </div>
      </main>
    </div>
  );
}
