import { createFileRoute, Link } from "@tanstack/react-router";
import { EventCard } from "@/components/EventCard";
import { adaptEvent, type DbEvent } from "@/lib/event-adapter";
import { listMyFavorites } from "@/lib/favorites.functions";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
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

const tabs = ["Tous", "À venir", "En Live", "Passés"] as const;
type Tab = (typeof tabs)[number];

function Favorites() {
  const [tab, setTab] = useState<Tab>("Tous");
  const { user, loading } = useAuth();
  const fetchFavs = useServerFn(listMyFavorites);
  const { data, isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: () => fetchFavs(),
    enabled: !!user,
  });

  const events = (data ?? []).map((e) => adaptEvent(e as unknown as DbEvent));
  const filtered = events.filter((e) => {
    if (tab === "En Live") return e.isLive;
    if (tab === "À venir") return !e.isLive && (e.countdownDays ?? 0) > 0;
    if (tab === "Passés") return !e.isLive && (e.countdownDays ?? 0) === 0;
    return true;
  });

  return (
    <div className="space-y-6 px-4 py-4">
      <div>
        <h1 className="font-serif text-3xl">Favoris</h1>
        <p className="text-sm text-muted-foreground">
          Vos événements sauvegardés et vos plus beaux souvenirs.
        </p>
      </div>

      {!user && !loading ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface p-8 text-center">
          <Heart className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 font-serif text-lg">Connectez-vous pour retrouver vos favoris</p>
          <Link
            to="/auth"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-glow"
          >
            Se connecter
          </Link>
        </div>
      ) : (
        <>
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
            {isLoading ? (
              <div className="rounded-3xl bg-surface p-8 text-center text-sm text-muted-foreground">
                Chargement…
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-surface p-8 text-center">
                <p className="font-serif text-lg">Aucun favori</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Touchez le cœur d'un événement pour l'ajouter ici.
                </p>
                <Link
                  to="/app/explore"
                  className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white"
                >
                  Explorer
                </Link>
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
            <div className="rounded-3xl border border-dashed border-border bg-surface p-6 text-center text-xs text-muted-foreground">
              Bientôt : épinglez vos moments préférés du livre d'or et de l'album.
            </div>
          </section>
        </>
      )}
    </div>
  );
}
