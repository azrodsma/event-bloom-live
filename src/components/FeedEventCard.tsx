import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Eye,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MapPin,
  Calendar,
  Gift,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Navigation,
  BookHeart,
  Camera,
  ChevronRight as Chevron,
} from "lucide-react";
import type { MockEvent } from "@/lib/mock-data";

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const fmtEur = (n: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " €";

export function FeedEventCard({ event }: { event: MockEvent }) {
  const c = useCountdown(event.date);
  const pot = event.moneyPot;
  const pct = pot ? Math.min(100, Math.round((pot.current / pot.target) * 100)) : 0;
  const dateLabel = new Date(event.date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeLabel = new Date(event.date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="overflow-hidden rounded-[28px] bg-surface shadow-card ring-1 ring-border/60">
      {/* Header */}
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5">
        <img
          src={event.cover}
          alt=""
          className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-border"
        />
        <Link to="/events/$slug" params={{ slug: event.slug }} className="min-w-0">
          <p className="truncate font-semibold leading-tight text-foreground">{event.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {event.type}
            {event.venue ? ` • ${event.venue}` : ""}
          </p>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          {event.isLive && (
            <span className="rounded-md bg-primary px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-primary-foreground">
              Live
            </span>
          )}
          <button aria-label="Plus d'options" className="tap text-muted-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Cover + overlay */}
      <div className="relative">
        <Link to="/events/$slug" params={{ slug: event.slug }} className="block">
          <img
            src={event.cover}
            alt={event.title}
            className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
            loading="lazy"
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />

        {event.isLive && (
          <span className="absolute left-3 top-3 rounded-md bg-primary px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-primary-foreground">
            Live
          </span>
        )}
        <span className="absolute right-14 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          <Eye className="h-3.5 w-3.5" />
          {event.viewers ? `${(event.viewers / 1000).toFixed(1).replace(".", ",")}K` : "—"}
        </span>
        <button
          aria-label="Ajouter aux favoris"
          className="tap absolute right-3 top-2.5 grid h-9 w-9 place-items-center rounded-full bg-white shadow-card"
        >
          <Heart className="h-5 w-5 fill-primary text-primary" />
        </button>

        {/* Cagnotte + countdown panel */}
        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/70 p-3.5 text-white backdrop-blur-md sm:inset-x-8">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
            <ChevronLeft className="h-5 w-5 shrink-0 opacity-60" />
            <div className="min-w-0 text-center">
              <p className="text-[11px] opacity-90">
                {pot ? "Cagnotte des mariés" : "Compte à rebours"}
              </p>
              <p className="flex items-center justify-center gap-2 font-serif text-2xl leading-tight sm:text-3xl">
                {pot && <Gift className="h-6 w-6 text-primary" />}
                {pot ? fmtEur(pot.current) : event.type}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 opacity-60" />
          </div>
          <div className="my-2.5 h-px bg-white/20" />
          <p className="text-center text-[11px] opacity-90">Le grand jour approche !</p>
          <div className="mt-1.5 grid grid-cols-4 divide-x divide-white/15 text-center">
            {[
              [c.days, "Jours"],
              [c.hours, "Heures"],
              [c.minutes, "Min"],
              [c.seconds, "Sec"],
            ].map(([v, l]) => (
              <div key={l as string}>
                <p className="font-serif text-xl font-bold text-primary sm:text-2xl">
                  {String(v).padStart(2, "0")}
                </p>
                <p className="text-[9px] uppercase tracking-[0.12em] opacity-75">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infos grid */}
      <div className="grid gap-4 border-b border-border/60 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-primary" /> Lieu
          </p>
          <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
            {event.venue || event.city || "À préciser"}
          </p>
          {event.venue && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-2.5 py-1 text-[11px] font-medium text-primary">
              <Navigation className="h-3 w-3" /> Voir sur la carte
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Calendar className="h-4 w-4 text-primary" /> Date
          </p>
          <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
            {dateLabel}
            <br />à {timeLabel}
          </p>
        </div>
        {pot ? (
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Gift className="h-4 w-4 text-primary" /> Cagnotte
            </p>
            <p className="mt-1 font-serif text-2xl leading-tight text-foreground">
              {fmtEur(pot.current)}
            </p>
            <p className="text-xs text-muted-foreground">sur {fmtEur(pot.target)}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${pct}%` }} />
              </div>
              <span className="shrink-0 rounded-full border border-primary/40 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {pct}%
              </span>
            </div>
            <a
              href={pot.url}
              target="_blank"
              rel="noreferrer noopener"
              className="tap mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <Gift className="h-4 w-4" /> Participer à la cagnotte
            </a>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Gift className="h-4 w-4 text-primary" /> Cagnotte
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">Aucune cagnotte pour cet événement.</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Heart className="h-5 w-5 fill-primary text-primary" />
          {event.viewers ? `${(event.viewers / 1000).toFixed(1).replace(".", ",")}K` : 0}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageCircle className="h-5 w-5" /> {event.guestbookCount}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Send className="h-5 w-5" /> {event.photosCount}
        </span>
        <Bookmark className="ml-auto h-5 w-5 text-muted-foreground" />
      </div>

      {/* Livre d'or */}
      <Link
        to="/events/$slug/guestbook"
        params={{ slug: event.slug }}
        className="tap mx-3 mb-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-primary/40 bg-primary-light/40 p-3"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary-light text-primary-dark">
          <BookHeart className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold leading-tight text-foreground">Livre d'or</span>
          <span className="block text-xs text-muted-foreground">
            Laissez un message · avant, pendant ou après le live
          </span>
        </span>
        <Chevron className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>

      {/* Espace caméraman */}
      <Link
        to="/events/$slug/vendors-hub"
        params={{ slug: event.slug }}
        className="tap mx-3 mb-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-secondary-light p-3"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-primary-dark">
          <Camera className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold leading-tight text-foreground">Espace Caméraman</span>
          <span className="block text-xs text-muted-foreground">
            Entrez le code de l'événement pour accéder au live et partager vos images.
          </span>
        </span>
        <Chevron className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>
    </article>
  );
}
