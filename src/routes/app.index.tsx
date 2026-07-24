import { createFileRoute } from "@tanstack/react-router";
import { StoryRail } from "@/components/StoryRail";
import { EventCard } from "@/components/EventCard";
import { mockEvents } from "@/lib/mock-data";
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
  const filtered =
    tab === "En direct"
      ? mockEvents.filter((e) => e.isLive)
      : tab === "À venir"
        ? mockEvents.filter((e) => !e.isLive)
        : mockEvents;

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
      <div className="space-y-4">
        {filtered.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}
