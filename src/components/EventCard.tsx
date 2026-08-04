import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Users, Radio, ArrowUpRight, Gift } from "lucide-react";
import { useState } from "react";
import type { MockEvent } from "@/lib/mock-data";
import { eventIcon } from "@/lib/event-icons";

export function EventCard({ event }: { event: MockEvent }) {
  const [fav, setFav] = useState(false);
  return (
    <Link
      to="/events/$slug"
      params={{ slug: event.slug }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[32px] bg-surface shadow-card ring-1 ring-border/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-modal hover:ring-primary/30"
    >
      <div className="relative aspect-[4/5] w-full flex-1 overflow-hidden bg-muted sm:aspect-[16/10]">

        <img
          src={event.cover}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="pointer-events-none absolute -inset-1 bg-gradient-to-tr from-primary/0 via-primary/0 to-primary/20 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-foreground">
            {(() => { const I = eventIcon(event.type); return <I className="h-3 w-3 text-primary" />; })()} {event.type}
          </span>
          {event.isLive ? (
            <span className="animate-pulse-live inline-flex items-center gap-1.5 rounded-full bg-live px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> Live
            </span>
          ) : (
            <span className="rounded-full bg-gold-light px-2.5 py-1 text-[11px] font-semibold text-gold shadow-gold">
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
          className="glass absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-foreground transition-transform hover:scale-110"
          aria-label="Favori"
        >
          <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-primary text-primary" : ""}`} />
        </button>

        <div className="absolute inset-x-4 bottom-4 text-white">
          <h3 className="font-serif text-3xl leading-[1.05] drop-shadow-md">{event.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-95">
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

      {event.moneyPot ? (
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 truncate text-xs font-medium text-muted-foreground">
              <Gift className="h-3.5 w-3.5 shrink-0 text-gold" /> <span className="truncate">{event.moneyPot.title}</span>
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary-light">
                <div
                  className="h-full rounded-full bg-gradient-primary transition-[width] duration-700"
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
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-foreground px-3.5 py-2 text-[11px] font-semibold text-background transition-transform group-hover:translate-x-0.5">
            Rejoindre <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-xs font-medium text-muted-foreground">
              {(() => { const I = eventIcon(event.type); return <I className="h-3.5 w-3.5 shrink-0 text-gold" />; })()}
              <span className="truncate">{event.isLive ? "En direct maintenant" : "Bientôt en direct"}</span>
            </p>
            <p className="mt-2 truncate text-[11px] text-muted-foreground/80">Page événement · souvenirs partagés</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-foreground px-3.5 py-2 text-[11px] font-semibold text-background transition-transform group-hover:translate-x-0.5">
            Rejoindre <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      )}

    </Link>
  );
}
