import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEvent } from "@/lib/mock-data";
import { ChevronLeft, Heart, MessageCircle, Star, Image as ImageIcon, Mic, Video, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventBySlug } from "@/lib/events.functions";
import { adaptEvent } from "@/lib/event-adapter";
import { listGuestbookEntries, createGuestbookEntry } from "@/lib/guestbook.functions";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const routeLoader = async ({ params }: { params: { slug: string } }) => {
    const db = await getEventBySlug({ data: { slug: params.slug } });
    if (!db) {
      const e = findEvent(params.slug);
      if (!e) throw notFound();
      return { event: e, dbId: null as string | null };
    }
    return { event: adaptEvent(db), dbId: db.id };
  };
type RouteLoaderData = Awaited<ReturnType<typeof routeLoader>>;

export const Route = createFileRoute("/events/$slug/guestbook")({
  head: ({ params }) => ({
    meta: [
      { title: `Livre d'or · ${params.slug} — MaFeliza` },
      { name: "description", content: "Laissez un message, une photo, une vidéo ou un vocal pour créer un souvenir inoubliable." },
    ],
  }),
  loader: routeLoader,
  component: Guestbook,
});

const filters = ["Tous", "Photos", "Vidéos", "Vocaux", "Favoris"] as const;

type Entry = {
  id: string;
  author_name: string;
  kind: "text" | "photo" | "video" | "audio";
  content: string | null;
  media_url: string | null;
  created_at: string;
};

function Guestbook() {
  const { event, dbId } = Route.useLoaderData() as RouteLoaderData;
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tous");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const list = useServerFn(listGuestbookEntries);
  const create = useServerFn(createGuestbookEntry);

  const key = ["guestbook", dbId] as const;
  const { data: entries = [] } = useQuery({
    queryKey: key,
    enabled: !!dbId,
    queryFn: async () => (await list({ data: { eventId: dbId! } })) as Entry[],
  });

  useEffect(() => {
    if (!dbId) return;
    const ch = supabase
      .channel(`guestbook-${dbId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "guestbook_entries", filter: `event_id=eq.${dbId}` },
        (payload) => {
          qc.setQueryData<Entry[]>(key, (prev = []) => [payload.new as Entry, ...prev]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [dbId, qc]);

  const filtered = entries.filter((m) => {
    if (filter === "Photos") return m.kind === "photo";
    if (filter === "Vidéos") return m.kind === "video";
    if (filter === "Vocaux") return m.kind === "audio";
    if (filter === "Favoris") return false;
    return true;
  });

  const publish = async () => {
    if (!text.trim() || !dbId || !user) return;
    setSending(true);
    const content = text.trim();
    setText("");
    try {
      await create({ data: { eventId: dbId, kind: "text", content } });
    } catch (e) {
      setText(content);
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="module-page">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link
            to="/events/$slug"
            params={{ slug: event.slug }}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-xl">Livre d'or</p>
            <p className="truncate text-xs text-muted-foreground">
              {event.title} · {entries.length} messages
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-4">
        {/* Compose */}
        <div className="rounded-3xl bg-surface p-4 shadow-card">
          {user ? (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Laissez un message pour ${event.title.split(" & ")[0]}...`}
                rows={3}
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-1">
                  {[
                    { icon: ImageIcon, label: "Photo" },
                    { icon: Video, label: "Vidéo" },
                    { icon: Mic, label: "Vocal" },
                  ].map((a) => (
                    <Link
                      key={a.label}
                      to="/events/$slug/guestbook/new"
                      params={{ slug: event.slug }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      <a.icon className="h-3.5 w-3.5" /> {a.label}
                    </Link>
                  ))}
                </div>
                <button
                  onClick={publish}
                  disabled={!text.trim() || sending || !dbId}
                  className="rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
                >
                  {sending ? "Envoi…" : "Publier"}
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-3 text-sm font-semibold text-white shadow-glow"
            >
              <LogIn className="h-4 w-4" /> Se connecter pour laisser un message
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium ${
                f === filter ? "bg-foreground text-background" : "bg-surface text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="rounded-3xl bg-surface p-6 text-center text-sm text-muted-foreground">
              Aucun message pour le moment. Sois le premier à écrire ✨
            </p>
          )}
          {filtered.map((m) => (
            <article key={m.id} className="rounded-3xl bg-surface p-4 shadow-card">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-primary font-serif text-lg text-white">
                  {m.author_name.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <p className="font-semibold">{m.author_name}</p>
                    <Star className="hidden h-3.5 w-3.5 fill-gold text-gold" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
              </div>
              {m.content && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{m.content}</p>}
              {m.kind === "photo" && m.media_url && (
                <img src={m.media_url} alt="" className="mt-3 aspect-video w-full rounded-2xl object-cover" />
              )}
              {m.kind === "video" && m.media_url && (
                <video src={m.media_url} controls className="mt-3 w-full rounded-2xl" />
              )}
              {m.kind === "audio" && m.media_url && (
                <audio src={m.media_url} controls className="mt-3 w-full" />
              )}
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <button className="inline-flex items-center gap-1 hover:text-primary">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center gap-1 hover:text-primary">
                  <MessageCircle className="h-4 w-4" /> Répondre
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
