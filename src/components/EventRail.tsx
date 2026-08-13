import { Link } from "@tanstack/react-router";
import { Plus, Heart } from "lucide-react";
import type { MockEvent } from "@/lib/mock-data";

function dayLabel(e: MockEvent) {
  if (e.isLive) return "LIVE";
  const d = e.countdownDays ?? 0;
  return d === 0 ? "J-0" : `J-${d}`;
}

export function EventRail({ events }: { events: MockEvent[] }) {
  return (
    <div className="scrollbar-hide -mx-4 flex items-start gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <Link
        to="/app/create"
        className="tap flex w-[5.5rem] shrink-0 flex-col items-center gap-2 sm:w-24"
      >
        <div className="grid aspect-square w-full place-items-center rounded-[22px] bg-gradient-primary text-white shadow-glow">
          <Plus className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <span className="text-center text-[11px] font-semibold leading-tight text-foreground">
          Créer un<br />événement
        </span>
      </Link>

      {events.slice(0, 8).map((e, i) => (
        <Link
          key={e.id}
          to="/events/$slug"
          params={{ slug: e.slug }}
          className={`tap flex w-[5.5rem] shrink-0 flex-col items-center gap-2 sm:w-24 ${
            i === 0 ? "rounded-[26px] ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
          }`}
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-[22px]">
            <img src={e.cover} alt={e.title} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            {e.isLive && (
              <span className="absolute left-1.5 top-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-primary-foreground">
                Live
              </span>
            )}
            <span className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/90">
              <Heart className="h-3.5 w-3.5 text-foreground" />
            </span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-md bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
              {dayLabel(e)}
            </span>
          </div>
          <span className="line-clamp-2 text-center text-[11px] font-semibold leading-tight text-foreground">
            {e.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
