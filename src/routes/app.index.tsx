import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { EventRail } from "@/components/EventRail";
import { FeedEventCard } from "@/components/FeedEventCard";
import { listPublicEvents } from "@/lib/events.functions";
import { adaptEvent, type DbEvent } from "@/lib/event-adapter";
import { useState } from "react";
import { Sparkles, Radio, Heart, ArrowUpRight, Compass, Plus } from "lucide-react";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Accueil — MaFeliza" },
      { name: "description", content: "Vos événements, vos proches, en un fil unique." },
      { property: "og:title", content: "Accueil — MaFeliza" },
      { property: "og:description", content: "Vos événements, vos proches, en un fil unique." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const tabs = ["Pour vous", "En direct", "À venir", "Favoris"] as const;

function Home() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Pour vous");
  const fetchEvents = useServerFn(listPublicEvents);
  const { data, isLoading } = useQuery({
    queryKey: ["events", "public"],
    queryFn: () => fetchEvents(),
  });

  const events = (data ?? []).map((e) => adaptEvent(e as DbEvent));
  const filtered =
    tab === "En direct"
      ? events.filter((e) => e.isLive)
      : tab === "À venir"
        ? events.filter((e) => !e.isLive)
        : events;

  const liveCount = events.filter((e) => e.isLive).length;

  return (
    <div className="w-full min-w-0 space-y-5 py-4 sm:space-y-7 lg:py-8">
      {/* Rail d'événements */}
      <EventRail events={events} />

      {/* Filtres */}
      <div className="scrollbar-hide grid grid-cols-4 gap-2 sm:flex sm:gap-2.5 sm:overflow-x-auto">
        {tabs.map((t) => {
          const active = tab === t;
          const isFav = t === "Favoris";
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`tap relative inline-flex min-w-0 items-center justify-center gap-1 rounded-[14px] px-2 py-3 text-[13px] font-semibold transition-colors sm:shrink-0 sm:gap-1.5 sm:px-5 sm:text-sm ${
                active
                  ? "bg-primary-light text-primary"
                  : isFav
                    ? "bg-primary-light/60 text-primary"
                    : "bg-muted text-foreground/85 hover:bg-muted/70"
              }`}
              aria-pressed={active}
            >
              {isFav && <Heart className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" />}
              <span className="truncate">{t}</span>
            </button>
          );
        })}
      </div>


      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-5">
          {liveCount > 0 && (
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl lg:text-2xl">Votre fil</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-live/10 px-3 py-1 text-[11px] font-semibold text-live">
                <Radio className="h-3 w-3 animate-pulse" /> {liveCount} live
              </span>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-6">
              {[0, 1].map((i) => (
                <div key={i} className="overflow-hidden rounded-[28px] bg-surface shadow-card ring-1 ring-border/60">
                  <div className="flex items-center gap-3 p-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-3 w-1/2 rounded-full bg-muted" />
                      <div className="h-2.5 w-1/3 rounded-full bg-muted" />
                    </div>
                  </div>
                  <div className="relative h-64 bg-muted">
                    <div className="animate-shimmer absolute inset-0" />
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="h-3 w-2/3 rounded-full bg-muted" />
                    <div className="h-2.5 w-1/2 rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-[28px] bg-surface p-10 text-center shadow-card ring-1 ring-border">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-light text-primary">
                <Sparkles className="h-7 w-7" />
              </div>
              <p className="mt-4 font-serif text-2xl">Aucun événement</p>
              <p className="mt-2 text-sm text-muted-foreground">Créez le premier depuis le bouton +.</p>
              <Link to="/app/create" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
                <Plus className="h-4 w-4" /> Nouvel événement
              </Link>
            </div>
          ) : (

            <div className="space-y-6">
              {filtered.map((e) => (
                <FeedEventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </div>

        {/* Aside — desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <section className="rounded-3xl bg-gradient-warm p-6 shadow-card">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Aperçu</p>
              <p className="mt-3 font-serif text-3xl leading-tight">{events.length}</p>
              <p className="text-xs text-muted-foreground">événements suivis</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-surface p-3 shadow-card">
                  <p className="font-serif text-2xl text-live">{liveCount}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">En live</p>
                </div>
                <div className="rounded-2xl bg-surface p-3 shadow-card">
                  <p className="font-serif text-2xl text-primary">{events.length - liveCount}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">À venir</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-surface p-6 shadow-card ring-1 ring-border/60">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Raccourcis</p>
              <div className="mt-4 space-y-2">
                <Link to="/app/create" className="tap flex items-center gap-3 rounded-2xl bg-cream p-3 transition hover:-translate-y-0.5 hover:shadow-glow">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary"><Plus className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-sm">Créer</p>
                    <p className="text-[10px] text-muted-foreground">Nouvel événement</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link to="/app/explore" className="tap flex items-center gap-3 rounded-2xl bg-secondary-light p-3 transition hover:-translate-y-0.5 hover:shadow-glow">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-primary-dark"><Compass className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-sm">Explorer</p>
                    <p className="text-[10px] text-muted-foreground">Découvrir des événements</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link to="/app/ai-story" className="tap flex items-center gap-3 rounded-2xl bg-gradient-primary p-3 text-white shadow-glow transition hover:-translate-y-0.5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur"><Sparkles className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-sm">IA Story</p>
                    <p className="text-[10px] opacity-90">Highlight reel automatique</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 opacity-90" />
                </Link>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
