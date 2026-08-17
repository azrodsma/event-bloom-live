import { Link } from "@tanstack/react-router";
import { Plus, Heart } from "lucide-react";
import type { MockEvent } from "@/lib/mock-data";

function dayLabel(e: MockEvent) {
  const d = e.countdownDays ?? 0;
  return d === 0 ? "J-0" : `J-${d}`;
}

export function EventRail({ events }: { events: MockEvent[] }) {
  return (
    <div className="scrollbar-hide -mx-4 flex items-stretch gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <Link
        to="/app/create"
        className="tap flex w-[5.75rem] shrink-0 flex-col items-center gap-2 rounded-[20px] p-1 sm:w-24"
      >
        <div className="grid aspect-square w-full place-items-center rounded-[18px] bg-gradient-primary text-primary-foreground shadow-glow">
          <Plus className="h-9 w-9" strokeWidth={2.5} />
        </div>
        <span className="w-full text-center text-[11px] font-semibold leading-tight text-foreground">
          Créer un
          <br />
          événement
        </span>
      </Link>

      {events.slice(0, 8).map((e, i) => {
        const highlighted = i === 0 || e.isLive;
        return (
          <Link
            key={e.id}
            to="/events/$slug"
            params={{ slug: e.slug }}
            className={`tap flex w-[5.75rem] shrink-0 flex-col items-center gap-2 rounded-[20px] p-1 sm:w-24 ${
              highlighted ? "border border-primary bg-primary-light/30" : "border border-transparent"
            }`}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-[18px] ring-1 ring-border/70">
              <img src={e.cover} alt={e.title} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />

              {e.isLive && (
                <span className="absolute left-1 top-1 rounded-md bg-primary px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-primary-foreground">
                  Live
                </span>
              )}

              <span
                aria-hidden
                className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-surface/95 shadow-card"
              >
                <Heart className="h-3 w-3 text-foreground" strokeWidth={2.5} />
              </span>

              <span className="absolute inset-x-0 bottom-0 bg-primary py-0.5 text-center text-[11px] font-bold text-primary-foreground">
                {dayLabel(e)}
              </span>
            </div>
            <span className="line-clamp-2 w-full text-center text-[11px] font-semibold leading-tight text-foreground">
              {e.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
