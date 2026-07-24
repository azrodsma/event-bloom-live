import { createFileRoute } from "@tanstack/react-router";
import { EventCard } from "@/components/EventCard";
import { mockEvents } from "@/lib/mock-data";
import { Bookmark, Heart } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/favorites")({
  head: () => ({
    meta: [
      { title: "Favoris — Memento Live" },
      { name: "description", content: "Vos événements et souvenirs favoris." },
    ],
  }),
  component: Favorites,
});

const tabs = ["À venir", "En Live", "Passés"] as const;
type Tab = (typeof tabs)[number];

const savedMemories = [
  {
    id: "m1",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    title: "Discours de Marie",
    event: "Sarah & Thomas",
    kind: "Message vocal",
  },
  {
    id: "m2",
    cover: "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600",
    title: "Première danse",
    event: "Sarah & Thomas",
    kind: "Vidéo",
  },
  {
    id: "m3",
    cover: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=600",
    title: "Lettre de Grand-mère",
    event: "Baptême Gabriel",
    kind: "Photo",
  },
];

function Favorites() {
  const [tab, setTab] = useState<Tab>("À venir");

  const filtered = mockEvents.filter((e) => {
    if (tab === "En Live") return e.isLive;
    if (tab === "À venir") return !e.isLive && (e.countdownDays ?? 0) > 0;
    return !e.isLive && (e.countdownDays ?? 0) === 0;
  });

  return (
    <div className="space-y-6 px-4 py-4">
      <div>
        <h1 className="font-serif text-3xl">Favoris</h1>
        <p className="text-sm text-muted-foreground">
          Vos événements sauvegardés et vos plus beaux souvenirs.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              tab === t
                ? "bg-primary text-white shadow-glow"
                : "bg-surface text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-center gap-2 text-primary">
          <Heart className="h-4 w-4" fill="currentColor" />
          <h2 className="font-serif text-xl text-foreground">Événements suivis</h2>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface p-8 text-center">
            <p className="font-serif text-lg">Rien pour l'instant</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Aucun événement dans cette catégorie.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2 text-gold">
          <Bookmark className="h-4 w-4" fill="currentColor" />
          <h2 className="font-serif text-xl text-foreground">Souvenirs sauvegardés</h2>
        </div>
        <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {savedMemories.map((m) => (
            <div
              key={m.id}
              className="w-40 shrink-0 overflow-hidden rounded-2xl bg-surface shadow-card"
            >
              <div className="relative aspect-[3/4]">
                <img src={m.cover} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                  {m.kind}
                </span>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold">{m.title}</p>
                <p className="truncate text-[11px] text-muted-foreground">{m.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
