import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search, Radio, ArrowLeft, Sparkles, ArrowUpRight } from "lucide-react";
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
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link
            to="/"
            aria-label="Retour à l'accueil"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface ring-1 ring-border/70 transition-colors hover:text-primary sm:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link to="/" className="hidden shrink-0 sm:block">
            <Logo />
          </Link>
          <p className="min-w-0 flex-1 truncate font-serif text-lg sm:hidden">Événements</p>
          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
            <Link
              to="/"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary-light hover:text-primary"
            >
              Accueil
            </Link>
            <Link
              to="/events"
              className="rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary"
            >
              Événements
            </Link>
            <Link
              to="/join"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary-light hover:text-primary"
            >
              J'ai une invitation
            </Link>
          </nav>
          <Link
            to="/app"
            className="ml-auto shrink-0 rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-white shadow-glow sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Mon espace
          </Link>
        </div>

      </header>

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-gradient-warm opacity-70" />
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-gold/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-end gap-8 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Découvrir</p>
            <h1 className="mt-2 font-serif text-3xl leading-[1.05] sm:text-5xl">
              Événements en direct
              <span className="block text-primary">et à venir</span>
            </h1>
            <div className="rule-gold mt-5 w-24" />
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Rejoignez les célébrations publiques, suivez le live et déposez un mot dans le livre d'or.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs md:hidden">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-live px-3 py-1.5 font-bold uppercase tracking-wider text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" /> {liveCount} en direct
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 font-semibold text-muted-foreground ring-1 ring-border/70">
                <Sparkles className="h-3.5 w-3.5 text-gold" /> {events.length} célébrations
              </span>
            </div>
          </div>

          <div className="hidden w-full max-w-[260px] rounded-[28px] bg-surface/85 p-5 shadow-card ring-1 ring-border/60 backdrop-blur md:block">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-live px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> {liveCount} en direct
            </span>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="font-serif text-3xl leading-none">{events.length}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Célébrations
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl leading-none text-primary">
                  {new Set(events.map((e) => e.city)).size}
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Villes</p>
              </div>
            </div>
            <div className="rule-gold mt-4 w-12" />
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold" /> Album souvenir & livre d'or inclus
            </p>
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

        <div className="scrollbar-hide -mx-4 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-24px),transparent)] sm:mx-0 sm:flex-wrap sm:px-0 sm:[mask-image:none] [&>button]:snap-start">
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

        {!isLoading && (
          <p className="mt-5 text-xs text-muted-foreground">
            {filtered.length} événement{filtered.length > 1 ? "s" : ""}
            {filter ? ` · ${filter}` : ""}
          </p>
        )}

        <div className="mt-4 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">

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

        <section className="relative mt-10 overflow-hidden rounded-[36px] bg-gradient-to-br from-foreground to-primary-dark px-6 py-10 text-white shadow-modal sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-gold/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative sm:flex sm:items-end sm:justify-between sm:gap-8">
            <div className="max-w-xl">
              <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-white/95">
                <Sparkles className="h-3.5 w-3.5 text-gold" /> Votre tour
              </span>
              <h2 className="mt-3 font-serif text-3xl leading-[1.05] sm:text-4xl">
                Créez le cadre de votre prochain événement.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                Live, livre d'or multimédia, album collaboratif et cagnotte externe — en quelques minutes, invités inclus.
              </p>
            </div>
            <Link
              to="/app/create"
              className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-foreground shadow-card transition-transform hover:-translate-y-0.5 sm:mt-0"
            >
              Créer mon événement <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
