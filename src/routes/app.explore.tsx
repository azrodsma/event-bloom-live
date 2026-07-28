import { createFileRoute, Link } from "@tanstack/react-router";
import { EventCard } from "@/components/EventCard";
import { eventTypes, eventTypeIcons } from "@/lib/mock-data";
import { Search, Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPublicEvents } from "@/lib/events.functions";
import { adaptEvent, type DbEvent } from "@/lib/event-adapter";

export const Route = createFileRoute("/app/explore")({
  head: () => ({
    meta: [
      { title: "Explorer — Memento Live" },
      { name: "description", content: "Découvrez des événements en direct et à venir." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const fetchEvents = useServerFn(listPublicEvents);
  const { data } = useQuery({
    queryKey: ["events", "public"],
    queryFn: () => fetchEvents(),
  });
  const events = (data ?? []).map((e) => adaptEvent(e as DbEvent));

  const filtered = events.filter((e) => {
    if (filter && e.type !== filter) return false;
    if (q && !`${e.title} ${e.city} ${e.type}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5 px-4 py-4">
      <h1 className="font-serif text-3xl">Explorer</h1>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un événement, une ville..."
          className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>
      <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4">
        <button
          onClick={() => setFilter(null)}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium ${
            !filter ? "bg-foreground text-background" : "bg-surface text-muted-foreground"
          }`}
        >
          Tous
        </button>
        {eventTypes.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t === filter ? null : t)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium ${
              t === filter ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"
            }`}
          >
            {eventTypeIcons[t]} {t}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/app/inspirations"
          className="flex items-center gap-4 rounded-3xl border border-border/60 bg-gradient-to-r from-accent/20 via-primary/10 to-background p-4 transition-colors hover:border-primary/40"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-lg leading-tight">Inspirations</p>
            <p className="text-xs text-muted-foreground">Moodboards & thèmes visuels</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
        <Link
          to="/app/vendors"
          className="flex items-center gap-4 rounded-3xl border border-border/60 bg-gradient-to-r from-primary/10 via-accent/10 to-background p-4 transition-colors hover:border-primary/40"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-lg leading-tight">Prestataires recommandés</p>
            <p className="text-xs text-muted-foreground">Photographes, DJs, traiteurs vérifiés</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-16 text-center text-sm text-muted-foreground">
            Aucun événement trouvé.
          </p>
        )}
      </div>
    </div>
  );
}
