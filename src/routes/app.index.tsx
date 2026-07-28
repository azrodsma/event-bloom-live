import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StoryRail } from "@/components/StoryRail";
import { EventCard } from "@/components/EventCard";
import { listPublicEvents } from "@/lib/events.functions";
import { adaptEvent, type DbEvent } from "@/lib/event-adapter";
import { useState } from "react";

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

  return (
    <div className="space-y-6 px-4 py-4">
      <StoryRail />
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === t
                ? "bg-foreground text-background"
                : "bg-surface text-muted-foreground hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl bg-surface p-8 text-center shadow-card">
          <p className="font-serif text-xl">Aucun événement</p>
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
