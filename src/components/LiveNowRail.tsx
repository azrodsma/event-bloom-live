import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Eye, Heart } from "lucide-react";
import { listPublicEvents } from "@/lib/events.functions";
import { adaptEvent, type DbEvent } from "@/lib/event-adapter";

function viewersLabel(n?: number) {
  if (!n) return "0";
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(".", ",")}K` : String(n);
}

export function LiveNowRail() {
  const fetchEvents = useServerFn(listPublicEvents);
  const { data } = useQuery({ queryKey: ["events", "public"], queryFn: () => fetchEvents() });
  const events = (data ?? []).map((e) => adaptEvent(e as DbEvent));
  const live = events.filter((e) => e.isLive).slice(0, 6);
  if (live.length === 0) return null;

  return (
    <section className="mt-7">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-[12px] font-bold uppercase tracking-[0.14em] text-foreground">
          En direct actuellement
        </h2>
        <Link to="/events" className="text-[12px] font-medium text-muted-foreground hover:text-primary">
          Voir tout
        </Link>
      </div>

      <div className="scrollbar-hide -mx-4 mt-3 flex gap-3 overflow-x-auto px-4">
        {live.map((e) => (
          <Link
            key={e.id}
            to="/events/$slug"
            params={{ slug: e.slug }}
            className="tap relative w-[9.5rem] shrink-0 overflow-hidden rounded-[18px] ring-1 ring-border/60"
          >
            <img src={e.cover} alt={e.title} loading="lazy" className="h-32 w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-primary-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" /> Live
            </span>
            <div className="absolute inset-x-0 bottom-0 p-2">
              <p className="line-clamp-1 text-[12px] font-semibold leading-tight text-white">{e.title}</p>
              <p className="line-clamp-1 text-[10px] text-white/75">{e.city ?? e.venue ?? ""}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-white/90">
                  <Eye className="h-3 w-3" /> {viewersLabel(e.viewers)}
                </span>
                <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
