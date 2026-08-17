import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEvent } from "@/lib/mock-data";
import {
  ChevronLeft,
  Heart,
  Star,
  Image as ImageIcon,
  Mic,
  Video,
  LogIn,
  MoreHorizontal,
  MessageCircle,
  Search,
  Play,
  Send,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
      {
        name: "description",
        content:
          "Laissez un message, une photo, une vidéo ou un vocal pour créer un souvenir inoubliable.",
      },
      { property: "og:title", content: "Livre d'or — MaFeliza" },
      { property: "og:description", content: "Les plus beaux messages de vos invités." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: routeLoader,
  component: Guestbook,
});

const filters = [
  { label: "Tous", icon: MessageCircle },
  { label: "Photos", icon: ImageIcon },
  { label: "Vidéos", icon: Video },
  { label: "Vocaux", icon: Mic },
  { label: "Favoris", icon: Star },
] as const;

type FilterLabel = (typeof filters)[number]["label"];

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

function Guestbook() {
  const { event, dbId } = Route.useLoaderData() as RouteLoaderData;
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<FilterLabel>("Tous");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
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

  const isMediaView = filter === "Photos" || filter === "Vidéos";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((m) => {
      if (filter === "Photos" && m.kind !== "photo") return false;
      if (filter === "Vidéos" && m.kind !== "video") return false;
      if (filter === "Vocaux" && m.kind !== "audio") return false;
      if (filter === "Favoris" && likesFor(m.id) < 24) return false;
      if (!q) return true;
      return (
        (m.content ?? "").toLowerCase().includes(q) || m.author_name.toLowerCase().includes(q)
      );
    });
  }, [entries, filter, search]);

  const highlights = useMemo(() => {
    const sorted = [...entries].sort((a, b) => likesFor(b.id) - likesFor(a.id));
    const bestMsg = sorted.find((e) => e.kind === "text" || !!e.content);
    const bestPhoto = sorted.find((e) => e.kind === "photo" && e.media_url);
    const bestVideo = sorted.find((e) => e.kind === "video" && e.media_url);
    return [
      { label: "Message le plus aimé", icon: Heart, entry: bestMsg },
      { label: "Plus belle photo", icon: ImageIcon, entry: bestPhoto },
      { label: "Plus belle vidéo", icon: Play, entry: bestVideo },
    ].filter((h) => !!h.entry);
  }, [entries]);

  const dateLabel = new Date(event.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
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
      {/* Header — titre centré comme la maquette */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-2xl">
        <div className="mx-auto grid max-w-2xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5">
          <Link
            to="/events/$slug"
            params={{ slug: event.slug }}
            aria-label="Retour"
            className="tap grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 text-center">
            <p className="truncate text-[17px] font-bold leading-tight text-foreground">Livre d'or</p>
            <p className="truncate text-[13px] font-medium text-muted-foreground">{event.title}</p>
            <p className="truncate text-[11px] text-muted-foreground/80">
              {event.type} · {dateLabel}
              {event.city ? ` · ${event.city}` : ""}
            </p>
          </div>
          <button
            aria-label="Plus d'options"
            className="tap grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-muted"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-4">
        {/* Compteur pilule */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-2 text-[13px] font-semibold text-foreground">
            <Heart className="h-4 w-4 fill-primary text-primary" />
            {entries.length} message{entries.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Recherche (vues média) */}
        {isMediaView && (
          <label className="flex items-center gap-2 rounded-2xl bg-surface px-4 py-3 shadow-card ring-1 ring-border/60">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un message..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          </label>
        )}

        {/* Composer */}
        <section className="rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-border/60">
          <p className="text-sm font-bold text-foreground">Écrire un message</p>
          {user ? (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Écrivez quelques mots pour les mariés..."
                rows={2}
                maxLength={500}
                className="mt-3 w-full resize-none rounded-2xl bg-muted/60 px-4 py-3 text-sm outline-none ring-1 ring-border/60 focus:ring-primary/60"
              />
              <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_auto] items-stretch gap-2">
                {[
                  { icon: ImageIcon, label: "Photo", hint: "" },
                  { icon: Video, label: "Vidéo", hint: "30s" },
                  { icon: Mic, label: "Vocal", hint: "2 min" },
                ].map((a) => (
                  <Link
                    key={a.label}
                    to="/events/$slug/guestbook/new"
                    params={{ slug: event.slug }}
                    className="tap flex flex-col items-center justify-center gap-1 rounded-[14px] bg-surface px-2 py-2.5 text-[11px] font-semibold text-foreground ring-1 ring-border hover:bg-muted/50"
                  >
                    <a.icon className="h-5 w-5 text-foreground" strokeWidth={1.8} />
                    <span className="leading-none">{a.label}</span>
                    {a.hint && (
                      <span className="text-[9px] font-medium leading-none text-muted-foreground">
                        {a.hint}
                      </span>
                    )}
                  </Link>
                ))}
                <button
                  onClick={publish}
                  disabled={!text.trim() || sending || !dbId}
                  className="tap inline-flex items-center justify-center gap-1.5 rounded-[14px] bg-gradient-primary px-4 text-[13px] font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
                >
                  <Heart className="h-4 w-4 fill-current" />
                  {sending ? "Envoi…" : "Envoyer"}
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              className="tap mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <LogIn className="h-4 w-4" /> Se connecter pour laisser un message
            </Link>
          )}
        </section>

        {/* Filtres */}
        <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4">
          {filters.map((f) => {
            const active = f.label === filter;
            const Icon = f.icon;
            return (
              <button
                key={f.label}
                onClick={() => setFilter(f.label)}
                aria-pressed={active}
                className={`tap inline-flex shrink-0 items-center gap-1.5 rounded-[12px] px-3 py-2 text-[13px] font-semibold transition-colors ${
                  active
                    ? "bg-primary-light text-primary ring-1 ring-primary/50"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.9} />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Les plus beaux messages */}
        {filter === "Tous" && highlights.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-foreground">Les plus beaux messages</h2>
            <div className="scrollbar-hide -mx-4 mt-2 flex gap-2.5 overflow-x-auto px-4 pb-1">
              {highlights.map((h) => {
                const e = h.entry!;
                const Icon = h.icon;
                const isFirst = h.label === "Message le plus aimé";
                return (
                  <Link
                    key={h.label}
                    to="/events/$slug/guestbook/$id"
                    params={{ slug: event.slug, id: e.id }}
                    className={`tap w-[9.5rem] shrink-0 overflow-hidden rounded-[16px] p-2 ${
                      isFirst ? "bg-primary-light/70 ring-1 ring-primary/40" : "bg-surface ring-1 ring-border/60"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                        isFirst ? "text-primary" : "text-foreground"
                      }`}
                    >
                      <Icon className="h-3 w-3" /> {h.label}
                    </span>
                    <span className="relative mt-1.5 block aspect-[4/3] w-full overflow-hidden rounded-[12px] bg-muted">
                      {e.media_url ? (
                        <img src={e.media_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <span className="grid h-full w-full place-items-center px-2 text-center text-[10px] leading-snug text-muted-foreground">
                          {(e.content ?? "").slice(0, 60)}
                        </span>
                      )}
                      {h.label === "Plus belle vidéo" && (
                        <span className="absolute inset-0 grid place-items-center bg-black/25">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/90">
                            <Play className="h-3.5 w-3.5 fill-foreground text-foreground" />
                          </span>
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Grille média */}
        {isMediaView ? (
          filtered.length === 0 ? (
            <p className="rounded-3xl bg-surface p-6 text-center text-sm text-muted-foreground">
              Aucun média pour ce filtre.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((m) => (
                <Link
                  key={m.id}
                  to="/events/$slug/guestbook/$id"
                  params={{ slug: event.slug, id: m.id }}
                  className="tap min-w-0"
                >
                  <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-[16px] bg-muted">
                    {m.media_url ? (
                      m.kind === "video" ? (
                        <video src={m.media_url} className="h-full w-full object-cover" muted />
                      ) : (
                        <img src={m.media_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                      )
                    ) : null}
                    {m.kind === "video" && (
                      <span className="absolute inset-0 grid place-items-center bg-black/20">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/90">
                          <Play className="h-4 w-4 fill-foreground text-foreground" />
                        </span>
                      </span>
                    )}
                  </span>
                  <span className="mt-1.5 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-primary text-[10px] font-bold text-primary-foreground">
                      {m.author_name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-semibold text-foreground">
                        {m.author_name}
                      </span>
                      <span className="block truncate text-[10px] text-muted-foreground">
                        {timeAgo(m.created_at)}
                      </span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-foreground">
                      <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
                      {likesFor(m.id)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-3">
            {filtered.length === 0 && (
              <p className="rounded-3xl bg-surface p-6 text-center text-sm text-muted-foreground">
                Aucun message pour le moment. Soyez le premier à écrire ✨
              </p>
            )}
            {filtered.map((m) => (
              <article
                key={m.id}
                className="overflow-hidden rounded-[20px] bg-surface p-4 shadow-card ring-1 ring-border/60"
              >
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-primary font-serif text-base text-primary-foreground">
                    {m.author_name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-foreground">
                      {m.author_name}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {timeAgo(m.created_at)}
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-foreground">
                    <Heart className="h-4 w-4 fill-primary text-primary" />
                    {likesFor(m.id)}
                  </span>
                </div>

                {m.content && (
                  <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-foreground">
                    {m.content}
                  </p>
                )}
                {m.kind === "photo" && m.media_url && (
                  <img
                    src={m.media_url}
                    alt=""
                    className="mt-3 aspect-[4/3] w-full rounded-[16px] object-cover"
                    loading="lazy"
                  />
                )}
                {m.kind === "video" && m.media_url && (
                  <video src={m.media_url} controls className="mt-3 w-full rounded-[16px]" />
                )}
                {m.kind === "audio" && m.media_url && (
                  <audio src={m.media_url} controls className="mt-3 w-full" />
                )}

                <Link
                  to="/events/$slug/guestbook/$id"
                  params={{ slug: event.slug, id: m.id }}
                  className="tap mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary"
                >
                  <Send className="h-3.5 w-3.5" /> Répondre à ce message
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
