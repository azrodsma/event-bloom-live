import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listActiveStories } from "@/lib/events.functions";
import { Plus, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/stories")({
  head: () => ({
    meta: [
      { title: "Stories — Memento Live" },
      { name: "description", content: "Les stories éphémères de vos événements, visibles 24 h." },
      { property: "og:title", content: "Stories — Memento Live" },
      { property: "og:description", content: "Les stories éphémères de vos événements, visibles 24 h." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StoriesPage,
});

type Story = {
  id: string;
  media_url: string;
  media_type: string | null;
  author_name: string | null;
  events: { slug: string; title: string; status: string };
};

function StoriesPage() {
  const fetchStories = useServerFn(listActiveStories);
  const { data, isLoading } = useQuery({ queryKey: ["stories", "active"], queryFn: () => fetchStories() });
  const stories = (data ?? []) as Story[];

  return (
    <div className="w-full min-w-0 space-y-6 py-6 lg:py-8">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate font-serif text-3xl tracking-tight lg:text-4xl">Stories</h1>
          <p className="mt-1 max-w-[48ch] text-sm text-muted-foreground">
            Les instants éphémères de vos événements, visibles 24 h.
          </p>
        </div>
        <Link
          to="/app/story/new"
          className="tap inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Ajouter</span>
        </Link>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[9/16] animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="rounded-3xl bg-surface p-10 text-center ring-1 ring-border">
          <Sparkles className="mx-auto h-6 w-6 text-primary" />
          <p className="mt-3 font-serif text-xl">Aucune story active</p>
          <p className="mt-1 text-sm text-muted-foreground">Publiez la première, elle restera visible 24 h.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {stories.map((s) => (
            <Link
              key={s.id}
              to="/events/$slug"
              params={{ slug: s.events.slug }}
              className="tap group relative aspect-[9/16] overflow-hidden rounded-3xl bg-foreground shadow-card transition hover:-translate-y-1 hover:shadow-glow active:scale-[0.98]"
            >
              <img
                src={s.media_url}
                alt={s.events.title}
                loading="lazy"
                className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="truncate font-serif text-sm text-white">{s.events.title}</p>
                <p className="truncate text-[11px] text-white/70">{s.author_name ?? "Invité"}</p>
              </div>
              {s.events.status === "live" && (
                <span className="absolute left-2 top-2 rounded-full bg-live px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  Live
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
