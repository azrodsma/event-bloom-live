import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StoryRail } from "@/components/StoryRail";
import { EventCard } from "@/components/EventCard";
import { listPublicEvents } from "@/lib/events.functions";
import { adaptEvent, type DbEvent } from "@/lib/event-adapter";
import { useState } from "react";
import { Sparkles, Radio, Calendar, Camera, Heart, ArrowUpRight, Compass, Plus } from "lucide-react";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Accueil — Memento Live" },
      { name: "description", content: "Vos événements, vos proches, en un fil unique." },
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
    <div className="w-full min-w-0 space-y-8 py-6 sm:space-y-10 lg:py-10">
      {/* Hero bento */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">

        <div className="col-span-2 relative overflow-hidden rounded-[32px] bg-foreground p-6 text-background md:col-span-4 md:p-8 lg:col-span-4 lg:row-span-2 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-primary opacity-70 blur-2xl animate-blob lg:h-72 lg:w-72" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-gold opacity-40 blur-3xl animate-blob lg:h-64 lg:w-64" style={{ animationDelay: "3s" }} />
          <div className="relative flex h-full flex-col">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-background/90 backdrop-blur">
              <Sparkles className="h-3 w-3" /> Bonjour
            </span>
            <h1 className="mt-4 max-w-[15ch] text-balance font-serif text-[clamp(2rem,7vw,2.75rem)] leading-[1.02] tracking-tight md:text-5xl xl:text-6xl">
              Vos souvenirs,<br /><span className="italic text-primary">en direct</span>.
            </h1>
            <p className="mt-3 max-w-[48ch] text-sm text-background/70 lg:text-base">
              {events.length} événement{events.length > 1 ? "s" : ""} · {liveCount} en live maintenant.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 lg:mt-auto lg:pt-8">
              <Link to="/app/create" className="tap inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5">
                Créer un événement <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/app/explore" className="tap inline-flex items-center gap-1.5 rounded-full border border-background/20 bg-background/5 px-5 py-3 text-sm font-medium text-background backdrop-blur hover:bg-background/10">
                Explorer
              </Link>
            </div>
          </div>
        </div>

        <Link to="/app/ai-story" className="tap group col-span-2 relative overflow-hidden rounded-[28px] bg-gradient-primary p-5 text-white shadow-glow md:col-span-2 lg:col-span-2 lg:p-6">
          <Sparkles className="h-6 w-6 lg:h-7 lg:w-7" />
          <p className="mt-4 font-serif text-2xl leading-tight lg:text-3xl">IA<br/>Story</p>
          <p className="mt-1 text-[11px] opacity-90 lg:text-xs">Composez votre highlight reel</p>
          <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 opacity-80 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>

        <Link to="/app/favorites" className="tap col-span-1 rounded-[28px] bg-cream p-5 shadow-card transition hover:-translate-y-1 hover:shadow-glow md:col-span-2 lg:col-span-2 lg:p-6">
          <Heart className="h-5 w-5 text-primary" />
          <p className="mt-3 font-serif text-lg leading-tight lg:text-xl">Favoris</p>
          <p className="text-[11px] text-muted-foreground">Vos moments sauvegardés</p>
        </Link>

        <Link to="/app/create" className="tap col-span-1 rounded-[28px] bg-surface p-5 shadow-card ring-1 ring-border transition hover:-translate-y-1 hover:shadow-glow md:col-span-2 lg:col-span-1 lg:p-6">
          <Calendar className="h-5 w-5 text-gold" />
          <p className="mt-3 font-serif text-lg leading-tight lg:text-xl">Nouveau</p>
          <p className="text-[11px] text-muted-foreground">Créer en 8 étapes</p>
        </Link>

        <Link to="/app/explore" className="tap col-span-2 rounded-[28px] bg-secondary-light p-5 shadow-card transition hover:-translate-y-1 hover:shadow-glow md:col-span-2 lg:col-span-1 lg:p-6">
          <Camera className="h-5 w-5 text-primary-dark" />
          <p className="mt-3 font-serif text-lg leading-tight lg:text-xl">Explorer</p>
          <p className="text-[11px] text-muted-foreground">Événements publics</p>
        </Link>
      </section>

      {/* Stories */}
      <StoryRail />

      {/* Feed + aside */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl lg:text-3xl">Votre fil</h2>
              <p className="text-xs text-muted-foreground">Les événements que vous suivez</p>
            </div>
            {liveCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-live/10 px-3 py-1 text-[11px] font-semibold text-live">
                <Radio className="h-3 w-3 animate-pulse" /> {liveCount} live
              </span>
            )}
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`tap shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  tab === t
                    ? "bg-foreground text-background shadow-card"
                    : "border border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="relative h-72 overflow-hidden rounded-[32px] bg-muted">
                  <div className="animate-shimmer absolute inset-0" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-[32px] bg-surface p-10 text-center shadow-card ring-1 ring-border">
              <p className="font-serif text-2xl">Aucun événement</p>
              <p className="mt-2 text-sm text-muted-foreground">Créez le premier depuis le bouton +.</p>
              <Link to="/app/create" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow">
                <Plus className="h-4 w-4" /> Nouvel événement
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {filtered.map((e) => (
                <EventCard key={e.id} event={e} />
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
