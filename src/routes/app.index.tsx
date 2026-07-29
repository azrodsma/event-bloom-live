import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StoryRail } from "@/components/StoryRail";
import { EventCard } from "@/components/EventCard";
import { listPublicEvents } from "@/lib/events.functions";
import { adaptEvent, type DbEvent } from "@/lib/event-adapter";
import { useState } from "react";
import { Sparkles, Radio, Calendar, Camera, Heart, ArrowUpRight } from "lucide-react";

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
    <div className="space-y-8 px-4 py-6">
      {/* Hero bento */}
      <section className="grid grid-cols-4 gap-3">
        <div className="col-span-4 relative overflow-hidden rounded-[32px] bg-foreground p-6 text-background sm:col-span-3">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-primary opacity-70 blur-2xl animate-blob" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-gold opacity-40 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-background/90 backdrop-blur">
              <Sparkles className="h-3 w-3" /> Bonjour
            </span>
            <h1 className="mt-4 font-serif text-[2.5rem] leading-[1] tracking-tight sm:text-5xl">
              Vos souvenirs, <span className="italic text-primary">en direct</span>.
            </h1>
            <p className="mt-3 max-w-md text-sm text-background/70">
              {events.length} événement{events.length > 1 ? "s" : ""} · {liveCount} en live maintenant.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/app/create" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5">
                Créer un événement <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/app/explore" className="inline-flex items-center gap-1.5 rounded-full border border-background/20 bg-background/5 px-4 py-2.5 text-xs font-medium text-background backdrop-blur hover:bg-background/10">
                Explorer
              </Link>
            </div>
          </div>
        </div>

        <Link to="/app/ai-story" className="col-span-2 relative overflow-hidden rounded-[28px] bg-gradient-primary p-5 text-white shadow-glow sm:col-span-1">
          <Sparkles className="h-6 w-6" />
          <p className="mt-4 font-serif text-2xl leading-tight">IA<br/>Story</p>
          <p className="mt-1 text-[11px] opacity-90">Composez votre highlight reel</p>
          <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 opacity-80" />
        </Link>

        <Link to="/app/favorites" className="col-span-2 rounded-[28px] bg-cream p-5 shadow-card sm:col-span-1">
          <Heart className="h-5 w-5 text-primary" />
          <p className="mt-3 font-serif text-lg leading-tight">Favoris</p>
          <p className="text-[11px] text-muted-foreground">Vos moments sauvegardés</p>
        </Link>

        <Link to="/app/create" className="col-span-2 rounded-[28px] bg-surface p-5 shadow-card ring-1 ring-border sm:col-span-1">
          <Calendar className="h-5 w-5 text-gold" />
          <p className="mt-3 font-serif text-lg leading-tight">Nouveau</p>
          <p className="text-[11px] text-muted-foreground">Créer en 8 étapes</p>
        </Link>

        <Link to="/app/explore" className="col-span-2 rounded-[28px] bg-secondary-light p-5 shadow-card sm:col-span-1">
          <Camera className="h-5 w-5 text-primary-dark" />
          <p className="mt-3 font-serif text-lg leading-tight">Explorer</p>
          <p className="text-[11px] text-muted-foreground">Événements publics</p>
        </Link>
      </section>

      {/* Stories */}
      <StoryRail />

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl">Votre fil</h2>
        {liveCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-live/10 px-3 py-1 text-[11px] font-semibold text-live">
            <Radio className="h-3 w-3 animate-pulse" /> {liveCount} live
          </span>
        )}
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
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
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative h-72 overflow-hidden rounded-[32px] bg-muted">
              <div className="animate-shimmer absolute inset-0" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[32px] bg-surface p-10 text-center shadow-card ring-1 ring-border">
          <p className="font-serif text-2xl">Aucun événement</p>
          <p className="mt-2 text-sm text-muted-foreground">Créez le premier depuis le bouton +.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
