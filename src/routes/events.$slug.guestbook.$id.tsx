import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { X, Heart, Send, Play, Flag } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getEventBySlug } from "@/lib/events.functions";
import { listGuestbookEntries } from "@/lib/guestbook.functions";

export const Route = createFileRoute("/events/$slug/guestbook/$id")({
  component: GuestbookEntry,
  head: () => ({
    meta: [
      { title: "Message du livre d'or · MaFeliza" },
      {
        name: "description",
        content: "Un message précieux laissé dans le livre d'or : texte, photo, vidéo ou vocal.",
      },
      { property: "og:title", content: "Message du livre d'or · MaFeliza" },
      { property: "og:description", content: "Un mot pour la vie." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Entry = {
  id: string;
  author_name: string;
  kind: "text" | "photo" | "video" | "audio";
  content: string | null;
  media_url: string | null;
  created_at: string;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `Il y a ${Math.max(1, Math.floor(diff / 60000))} min`;
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  return d < 7 ? `Il y a ${d} j` : new Date(iso).toLocaleDateString("fr-FR", { dateStyle: "medium" });
}

function likesFor(id: string) {
  let n = 0;
  for (const ch of id) n = (n * 31 + ch.charCodeAt(0)) % 97;
  return 8 + (n % 32);
}

function GuestbookEntry() {
  const { slug, id } = useParams({ from: "/events/$slug/guestbook/$id" });
  const [liked, setLiked] = useState(false);

  const fetchEvent = useServerFn(getEventBySlug);
  const list = useServerFn(listGuestbookEntries);

  const { data: event } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEvent({ data: { slug } }),
  });
  const dbId = event?.id ?? null;

  const { data: entries = [] } = useQuery({
    queryKey: ["guestbook", dbId],
    enabled: !!dbId,
    queryFn: async () => (await list({ data: { eventId: dbId! } })) as Entry[],
  });

  const entry = entries.find((e) => e.id === id);
  const others = entries.filter((e) => e.id !== id).slice(0, 5);
  const hearts = entry ? likesFor(entry.id) : 0;

  return (
    <div className="module-page min-h-dvh bg-gradient-to-b from-primary-light/60 via-background to-primary-light/40">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-3 py-2.5 safe-top">
        <Link
          to="/events/$slug/guestbook"
          params={{ slug }}
          aria-label="Fermer"
          className="tap grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-surface/70"
        >
          <X className="h-5 w-5" />
        </Link>
        <button
          aria-label="Signaler"
          className="tap inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-muted-foreground hover:bg-surface/70"
        >
          <Flag className="h-3 w-3" /> Signaler
        </button>
      </div>

      <main className="mx-auto max-w-2xl px-5 pb-36">
        {/* Auteur */}
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-primary font-serif text-lg text-primary-foreground">
            {(entry?.author_name ?? "?").slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[17px] font-bold text-foreground">
              {entry?.author_name ?? "Message"}
            </span>
            <span className="block truncate text-[13px] text-muted-foreground">Invité·e</span>
          </span>
          <span className="shrink-0 text-[12px] text-muted-foreground">
            {entry ? timeAgo(entry.created_at) : ""}
          </span>
        </div>

        {/* Message plein écran */}
        {entry?.content && (
          <p className="mt-5 whitespace-pre-wrap text-[21px] font-medium leading-[1.45] text-foreground sm:text-2xl">
            {entry.content}
          </p>
        )}

        {/* Média */}
        {entry?.media_url && entry.kind === "photo" && (
          <img
            src={entry.media_url}
            alt=""
            className="mt-5 aspect-[3/4] w-full rounded-[22px] object-cover shadow-card"
          />
        )}
        {entry?.media_url && entry.kind === "video" && (
          <video src={entry.media_url} controls className="mt-5 w-full rounded-[22px] shadow-card" />
        )}
        {entry?.media_url && entry.kind === "audio" && (
          <div className="mt-5 flex items-center gap-3 rounded-[22px] bg-surface p-4 shadow-card">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground">
              <Play className="h-5 w-5" />
            </span>
            <audio src={entry.media_url} controls className="min-w-0 flex-1" />
          </div>
        )}

        {/* Likes + avatars */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setLiked((l) => !l)}
            className="tap inline-flex items-center gap-1.5 text-[15px] font-bold text-foreground"
          >
            <Heart
              className={`h-6 w-6 transition-transform ${liked ? "scale-110 fill-primary text-primary" : "fill-primary text-primary"}`}
            />
            {hearts + (liked ? 1 : 0)}
          </button>
          {others.length > 0 && (
            <span className="ml-auto flex items-center">
              <span className="flex -space-x-2">
                {others.slice(0, 5).map((o) => (
                  <span
                    key={o.id}
                    className="grid h-7 w-7 place-items-center rounded-full bg-gradient-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background"
                  >
                    {o.author_name.slice(0, 1).toUpperCase()}
                  </span>
                ))}
              </span>
              <span className="ml-1.5 rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-foreground shadow-card">
                +{entries.length}
              </span>
            </span>
          )}
        </div>

        {/* Autres messages */}
        {others.length > 0 && (
          <section className="mt-8">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              D'autres mots précieux
            </p>
            <ul className="mt-3 space-y-2">
              {others.map((o) => (
                <li key={o.id}>
                  <Link
                    to="/events/$slug/guestbook/$id"
                    params={{ slug, id: o.id }}
                    className="tap grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] bg-surface p-3 shadow-card ring-1 ring-border/60"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-light text-[12px] font-bold text-primary">
                      {o.author_name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {o.author_name}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {o.content ? `« ${o.content} »` : "Média partagé"}
                      </span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-foreground">
                      <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
                      {likesFor(o.id)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* Barre de réponse */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border/50 bg-background/85 px-4 py-3 backdrop-blur-2xl"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto flex max-w-2xl items-center gap-2 rounded-full bg-surface px-4 py-2 shadow-card ring-1 ring-border/60"
        >
          <input
            placeholder="Répondre à ce message..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label="Envoyer"
            className="tap grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
