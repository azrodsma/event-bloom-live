import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listRecentGuestbookEntries } from "@/lib/guestbook.functions";
import { BookHeart, Image as ImageIcon, Mic, Video } from "lucide-react";

export const Route = createFileRoute("/app/guestbook")({
  head: () => ({
    meta: [
      { title: "Livre d'or — Memento Live" },
      { name: "description", content: "Tous les messages, photos et vocaux laissés par vos invités." },
      { property: "og:title", content: "Livre d'or — Memento Live" },
      { property: "og:description", content: "Tous les messages, photos et vocaux laissés par vos invités." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuestbookPage,
});

type Entry = {
  id: string;
  author_name: string | null;
  kind: string;
  content: string | null;
  media_url: string | null;
  created_at: string;
  events: { slug: string; title: string };
};

const kindIcon: Record<string, typeof Mic> = { photo: ImageIcon, video: Video, audio: Mic };

function GuestbookPage() {
  const fetchEntries = useServerFn(listRecentGuestbookEntries);
  const { data, isLoading } = useQuery({ queryKey: ["guestbook", "recent"], queryFn: () => fetchEntries() });
  const entries = (data ?? []) as Entry[];

  return (
    <div className="w-full min-w-0 space-y-6 py-6 lg:py-8">
      <header className="min-w-0">
        <h1 className="truncate font-serif text-3xl tracking-tight lg:text-4xl">Livre d'or</h1>
        <p className="mt-1 max-w-[48ch] text-sm text-muted-foreground">
          Les mots, photos et vocaux laissés par vos invités.
        </p>
      </header>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-3xl bg-surface p-10 text-center ring-1 ring-border">
          <BookHeart className="mx-auto h-6 w-6 text-primary" />
          <p className="mt-3 font-serif text-xl">Le livre d'or est vide</p>
          <p className="mt-1 text-sm text-muted-foreground">Les messages de vos invités apparaîtront ici.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {entries.map((e) => {
            const Icon = kindIcon[e.kind] ?? BookHeart;
            return (
              <Link
                key={e.id}
                to="/events/$slug/guestbook"
                params={{ slug: e.events.slug }}
                className="tap group flex min-w-0 flex-col rounded-3xl bg-surface p-5 shadow-card ring-1 ring-border transition hover:-translate-y-1 hover:shadow-glow active:scale-[0.99]"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-light text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="truncate text-sm font-semibold">{e.author_name ?? "Invité"}</p>
                </div>
                {e.media_url && e.kind === "photo" && (
                  <img
                    src={e.media_url}
                    alt=""
                    loading="lazy"
                    className="mt-3 h-36 w-full rounded-2xl object-cover"
                  />
                )}
                {e.content && (
                  <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">{e.content}</p>
                )}
                <p className="mt-auto pt-4 truncate text-[11px] uppercase tracking-widest text-muted-foreground">
                  {e.events.title}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
