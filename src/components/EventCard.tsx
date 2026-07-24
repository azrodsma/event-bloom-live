import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Users, Radio } from "lucide-react";
import { useState } from "react";
import type { MockEvent } from "@/lib/mock-data";
import { eventTypeIcons } from "@/lib/mock-data";

export function EventCard({ event }: { event: MockEvent }) {
  const [fav, setFav] = useState(false);
  return (
    <Link
      to="/events/$slug"
      params={{ slug: event.slug }}
      className="group block overflow-hidden rounded-3xl bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-modal"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted sm:aspect-[16/10]">
        <img
          src={event.cover}
          alt={event.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
            {eventTypeIcons[event.type]} {event.type}
          </span>
          {event.isLive ? (
            <span className="animate-pulse-live rounded-full bg-live px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              ● Live
            </span>
          ) : (
            <span className="rounded-full bg-gold-light px-2.5 py-1 text-[11px] font-semibold text-gold">
              J-{event.countdownDays ?? 0}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setFav((v) => !v);
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground backdrop-blur transition hover:scale-105"
          aria-label="Favori"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-primary text-primary" : ""}`} />
        </button>

        <div className="absolute inset-x-3 bottom-3 text-white">
          <h3 className="font-serif text-2xl leading-tight drop-shadow">{event.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-95">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {event.city}
            </span>
            {event.isLive && (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {event.viewers?.toLocaleString("fr-FR")}
              </span>
            )}
            {event.livestream && (
              <span className="inline-flex items-center gap-1">
                <Radio className="h-3.5 w-3.5" /> {event.livestream.platform}
              </span>
            )}
          </div>
        </div>
      </div>

      {event.moneyPot && (
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-muted-foreground">
              🎁 {event.moneyPot.title}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary-light">
                <div
                  className="h-full rounded-full bg-gradient-primary"
                  style={{
                    width: `${Math.min(100, (event.moneyPot.current / event.moneyPot.target) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-[11px] font-semibold text-foreground">
                {event.moneyPot.current.toLocaleString("fr-FR")} {event.moneyPot.currency}
              </span>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
            Rejoindre
          </span>
        </div>
      )}
    </Link>
  );
}
