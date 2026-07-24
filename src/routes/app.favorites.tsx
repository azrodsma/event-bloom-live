import { createFileRoute } from "@tanstack/react-router";
import { EventCard } from "@/components/EventCard";
import { mockEvents } from "@/lib/mock-data";

export const Route = createFileRoute("/app/favorites")({
  head: () => ({
    meta: [
      { title: "Favoris — Memento Live" },
      { name: "description", content: "Vos événements favoris." },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const favs = mockEvents.slice(0, 3);
  return (
    <div className="space-y-4 px-4 py-4">
      <h1 className="font-serif text-3xl">Favoris</h1>
      <p className="text-sm text-muted-foreground">
        Retrouvez ici tous les événements que vous avez sauvegardés.
      </p>
      <div className="space-y-4">
        {favs.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}
