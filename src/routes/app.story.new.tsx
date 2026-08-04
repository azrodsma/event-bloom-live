import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ChevronLeft, Sparkles, Calendar } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listMyEvents } from "@/lib/events.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/story/new")({
  head: () => ({
    meta: [
      { title: "Nouvelle story — MaFeliza" },
      { name: "description", content: "Choisissez l'événement pour lequel publier une story éphémère." },
    ],
  }),
  component: PickEvent,
});

type Ev = { id: string; slug: string; title: string; cover_url: string | null; event_date: string | null; status: string };

function PickEvent() {
  const { user, loading } = useAuth();
  const fetch = useServerFn(listMyEvents);
  const { data = [] } = useQuery({
    queryKey: ["my-events"],
    queryFn: () => fetch() as Promise<Ev[]>,
    enabled: !!user,
  });

  if (loading) return null;
  if (!user) {
    throw redirect({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-xl leading-tight">Nouvelle story</h1>
            <p className="text-[11px] text-muted-foreground">Choisissez un événement</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-3 px-4 py-4">
        {data.length === 0 ? (
          <div className="rounded-3xl bg-surface p-8 text-center shadow-card">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="font-serif text-lg">Aucun événement</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Créez un événement pour partager vos premières stories.
            </p>
            <Link
              to="/app/create"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-white shadow-glow"
            >
              Créer un événement
            </Link>
          </div>
        ) : (
          data.map((e) => (
            <Link
              key={e.id}
              to="/events/$slug/story/new"
              params={{ slug: e.slug }}
              className="flex items-center gap-3 rounded-3xl bg-surface p-3 shadow-card transition-colors hover:bg-primary-light/60"
            >
              {e.cover_url ? (
                <img src={e.cover_url} alt="" className="h-16 w-16 rounded-2xl object-cover" />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-lg leading-tight">{e.title}</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {e.event_date
                    ? new Date(e.event_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                    : "Date à définir"}
                </p>
              </div>
              {e.status === "live" && (
                <span className="rounded-full bg-live px-2 py-1 text-[10px] font-bold uppercase text-white">Live</span>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
