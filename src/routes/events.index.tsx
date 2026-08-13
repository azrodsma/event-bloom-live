import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search, Radio, ArrowLeft, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { EventCard } from "@/components/EventCard";
import { eventTypes, mockEvents } from "@/lib/mock-data";
import { eventIcon } from "@/lib/event-icons";
import { listPublicEvents } from "@/lib/events.functions";
import { adaptEvent, type DbEvent } from "@/lib/event-adapter";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Événements en direct & à venir — MaFeliza" },
      {
        name: "description",
        content:
          "Découvrez les mariages, baptêmes et anniversaires diffusés en direct sur MaFeliza, et rejoignez les albums souvenirs.",
      },
      { property: "og:title", content: "Événements MaFeliza" },
      {
        property: "og:description",
        content: "Mariages, baptêmes, anniversaires : en direct et en souvenirs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EventsIndex,
});

function EventsIndex() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const fetchPublic = useServerFn(listPublicEvents);
  const { data, isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      try {
        return await fetchPublic();
      } catch {
        return [];
      }
    },
    retry: false,
  });

  const events = useMemo(() => {
    const real = (data ?? []).map((e) => adaptEvent(e as unknown as DbEvent));
    return real.length > 0 ? real : mockEvents;
  }, [data]);

  const filtered = events.filter((e) => {
    if (filter && e.type !== filter) return false;
    if (q && !`${e.title} ${e.city} ${e.type}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const liveCount = events.filter((e) => e.isLive).length;

  return (
    <div className="min-h-dvh bg-background">
      <header className="glass sticky top-0 z-30 border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/"
            aria-label="Retour à l'accueil"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface ring-1 ring-border/70 transition-colors hover:text-primary sm:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link to="/" className="hidden sm:block">
            <Logo />
          </Link>
          <p className="min-w-0 flex-1 truncate font-serif text-lg sm:hidden">Événements</p>
          <Link
            to="/app"
            className="shrink-0 rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-white shadow-glow"
          >
            Mon espace
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-gradient-warm opacity-70" />
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-gold/25 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Découvrir</p>
          <h1 className="mt-2 font-serif text-3xl leading-[1.05] sm:text-5xl">
            Événements en direct
            <span className="block text-primary">et à venir</span>
          </h1>
          <div className="rule-gold mt-5 w-24" />
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Rejoignez les célébrations publiques, suivez le live et déposez un mot dans le livre d'or.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-live px-3 py-1.5 font-bold uppercase tracking-wider text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> {liveCount} en direct
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 font-semibold text-muted-foreground ring-1 ring-border/70">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> {events.length} célébrations
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un événement, une ville..."
            className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm shadow-card outline-none transition-colors focus:border-primary"
          />
        </div>

        <div className="scrollbar-hide -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-24px),transparent)] sm:mx-0 sm:flex-wrap sm:px-0 sm:[mask-image:none]">
          <button
            onClick={() => setFilter(null)}
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              !filter ? "bg-foreground text-background" : "bg-surface text-muted-foreground ring-1 ring-border/70"
            }`}
          >
            Tous
          </button>
          {eventTypes.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t === filter ? null : t)}
              className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                t === filter
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-surface text-muted-foreground ring-1 ring-border/70"
              }`}
            >
              {(() => {
                const I = eventIcon(t);
                return <I className="h-3.5 w-3.5" />;
              })()}{" "}
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-[32px] border border-border/60 bg-surface shadow-card"
                >
                  <div className="aspect-[4/3] w-full animate-pulse bg-gradient-to-br from-primary/15 via-muted to-gold/15" />
                  <div className="space-y-2.5 p-5">
                    <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-3/4 animate-pulse rounded-full bg-muted" />
                    <div className="h-3 w-1/2 animate-pulse rounded-full bg-muted" />
                    <div className="mt-3 h-9 w-28 animate-pulse rounded-full bg-muted" />
                  </div>
                </div>
              ))

            : filtered.map((e) => (
                <div key={e.id} className="h-full">
                  <EventCard event={e} />
                </div>
              ))}
          {!isLoading && filtered.length === 0 && (
            <div className="col-span-full rounded-[32px] border border-dashed border-border bg-surface/70 px-6 py-16 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10">
                <Radio className="h-6 w-6 text-primary" />
              </span>
              <p className="mt-4 font-serif text-xl">Aucun événement trouvé</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Essayez un autre filtre, ou créez votre propre célébration.
              </p>
              <Link
                to="/app/create"
                className="mt-5 inline-flex rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
              >
                Créer un événement
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
