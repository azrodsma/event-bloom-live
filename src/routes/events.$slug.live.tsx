import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEvent } from "@/lib/mock-data";
import { listRegistryItems } from "@/lib/registry.functions";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Share2,
  Send,
  Heart,
  Gift,
  Users,
  ExternalLink,
  LogIn,
  Eye,
  MoreHorizontal,
  MessageCircle,
  Camera,
  Video,
  Plus,
  ChevronRight,
  PiggyBank,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventBySlug } from "@/lib/events.functions";
import { adaptEvent } from "@/lib/event-adapter";
import { listLiveMessages, sendLiveMessage, sendLiveReaction } from "@/lib/live.functions";
import { listAlbumMedia } from "@/lib/album.functions";
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

export const Route = createFileRoute("/events/$slug/live")({
  head: ({ params }) => ({
    meta: [
      { title: `Live · ${params.slug} — MaFeliza` },
      { name: "description", content: "Diffusion en direct, chat et réactions." },
    ],
  }),
  loader: routeLoader,
  component: LivePage,
});

const tabs = ["Chat", "Réactions", "Cadeaux", "Cagnotte", "Photos", "Caméras"] as const;

const cameras = [
  { id: "main", label: "Caméra 1", live: true },
  { id: "cam2", label: "Caméra 2", live: false },
  { id: "drone", label: "Drone", live: false },
  { id: "dj", label: "DJ", live: false },
  { id: "room", label: "Salle", live: false },
] as const;

/** Réactions payantes façon maquette : libellé + prix */
const reactionGifts = [
  { emoji: "❤️", label: "J'aime", price: 0 },
  { emoji: "👏", label: "Applaudir", price: 1 },
  { emoji: "😍", label: "Cœur", price: 2 },
  { emoji: "🎆", label: "Feu d'artifice", price: 5 },
  { emoji: "🍾", label: "Champagne", price: 10 },
] as const;

const reactions = reactionGifts.map((r) => r.emoji);

type LiveMsg = { id: string; author_name: string | null; content: string; created_at: string };

function LivePage() {
  const { event, dbId } = Route.useLoaderData() as RouteLoaderData;
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Chat");
  const [input, setInput] = useState("");
  const [cam, setCam] = useState<string>("main");
  const [hearts, setHearts] = useState<{ id: number; left: number; emoji: string }[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const list = useServerFn(listLiveMessages);
  const send = useServerFn(sendLiveMessage);
  const react = useServerFn(sendLiveReaction);

  const key = ["live-msgs", dbId] as const;
  const { data: msgs = [] } = useQuery({
    queryKey: key,
    enabled: !!dbId,
    queryFn: async () => (await list({ data: { eventId: dbId! } })) as LiveMsg[],
    refetchOnWindowFocus: false,
  });

  const albumList = useServerFn(listAlbumMedia);
  const { data: album = [] } = useQuery({
    queryKey: ["live-album", dbId],
    enabled: !!dbId,
    queryFn: async () => (await albumList({ data: { eventId: dbId! } })) as Array<{ id: string; url: string; media_type: string }>,
  });

  const registryList = useServerFn(listRegistryItems);
  const { data: gifts = [] } = useQuery({
    queryKey: ["live-registry", dbId],
    enabled: !!dbId && tab === "Cadeaux",
    queryFn: async () =>
      (await registryList({ data: { eventId: dbId! } })) as Array<{
        id: string;
        title: string;
        description: string | null;
        price: number | null;
        image_url: string | null;
        external_url: string | null;
        is_reserved: boolean;
      }>,
  });


  // Realtime subscription for chat + reactions
  useEffect(() => {
    if (!dbId) return;
    const channel = supabase
      .channel(`live-${dbId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_messages", filter: `event_id=eq.${dbId}` },
        (payload) => {
          qc.setQueryData<LiveMsg[]>(key, (prev = []) => [...prev, payload.new as LiveMsg]);
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_reactions", filter: `event_id=eq.${dbId}` },
        (payload) => {
          const emoji = (payload.new as { emoji: string }).emoji || "💖";
          const id = Date.now() + Math.random();
          setHearts((h) => [...h, { id, left: 20 + Math.random() * 60, emoji }]);
          setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 2000);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [dbId, qc]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs.length]);

  const colorFor = useMemo(() => {
    const palette = ["#E85D8E", "#D9A441", "#7EC8B8", "#F0A6C0", "#B58BC7", "#F6B26B"];
    const cache = new Map<string, string>();
    return (name: string) => {
      if (cache.has(name)) return cache.get(name)!;
      let h = 0;
      for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
      const color = palette[h % palette.length];
      cache.set(name, color);
      return color;
    };
  }, []);

  const submit = async () => {
    if (!input.trim() || !dbId || !user) return;
    const text = input.trim();
    setInput("");
    try {
      await send({ data: { eventId: dbId, content: text } });
      // realtime will push it back; nothing else to do.
    } catch (e) {
      setInput(text);
      console.error(e);
    }
  };

  const heart = async (emoji = "💖") => {
    if (!dbId || !user) {
      // local-only feedback for guests
      const id = Date.now();
      setHearts((h) => [...h, { id, left: 20 + Math.random() * 60, emoji }]);
      setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 2000);
      return;
    }
    try {
      await react({ data: { eventId: dbId, emoji } });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-dark text-white">
      {/* Player */}
      <div className="relative h-[54dvh] shrink-0 bg-black sm:aspect-[16/9] sm:h-auto">
        {event.livestream ? (
          <iframe
            src={event.livestream.embedUrl}
            className="h-full w-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Live"
          />
        ) : (
          <div className="flex h-full items-center justify-center">Live indisponible</div>
        )}

        {/* Top bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-3 pb-8">
          <Link
            to="/events/$slug"
            params={{ slug: event.slug }}
            className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-black/50 ring-1 ring-white/15 backdrop-blur"
          >
            <X className="h-5 w-5" />
          </Link>
          <div className="pointer-events-auto flex items-center gap-2">
            <span className="animate-pulse-live rounded-full bg-live px-3 py-1 text-[11px] font-bold uppercase tracking-wide">● Live</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-xs ring-1 ring-white/15 backdrop-blur">
              <Users className="h-3 w-3" /> {event.viewers?.toLocaleString("fr-FR") ?? "—"}
            </span>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-black/50 ring-1 ring-white/15 backdrop-blur">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Multi-camera switcher */}
        <div className="scrollbar-hide absolute left-3 right-16 top-16 flex gap-2 overflow-x-auto">
          {cameras.map((c) => (
            <button
              key={c.id}
              onClick={() => setCam(c.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold backdrop-blur transition ${
                cam === c.id
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "bg-black/50 text-white/80 ring-1 ring-white/15"
              }`}
            >
              <Video className="mr-1 inline h-3 w-3" />
              {c.label}
            </button>
          ))}
          <Link
            to="/events/$slug/multicam"
            params={{ slug: event.slug }}
            className="shrink-0 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-semibold text-white/80 ring-1 ring-white/15 backdrop-blur"
          >
            Régie
          </Link>
        </div>

        {/* Cagnotte overlay */}
        {event.moneyPot && (
          <a
            href={event.moneyPot.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 top-28 w-40 rounded-2xl bg-black/55 p-3 ring-1 ring-white/15 backdrop-blur"
          >
            <p className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-gold">
              <Gift className="h-3 w-3" /> Cagnotte
            </p>
            <p className="mt-1 font-serif text-lg leading-none">
              {event.moneyPot.current.toLocaleString("fr-FR")} {event.moneyPot.currency}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-primary"
                style={{ width: `${Math.min(100, (event.moneyPot.current / event.moneyPot.target) * 100)}%` }}
              />
            </div>
          </a>
        )}

        {/* Chat overlay (last messages) */}
        <div className="pointer-events-none absolute bottom-3 left-3 max-w-[55%] space-y-1.5">
          <p className="text-[10px] uppercase tracking-widest text-white/70">{event.type} · {event.city}</p>
          {msgs.slice(-3).map((m) => (
            <p
              key={`ov-${m.id}`}
              className="w-fit max-w-full truncate rounded-full bg-black/45 px-3 py-1 text-xs backdrop-blur"
            >
              <span className="font-semibold" style={{ color: colorFor(m.author_name ?? "Invité") }}>
                {m.author_name ?? "Invité"}
              </span>{" "}
              <span className="text-white/90">{m.content}</span>
            </p>
          ))}
        </div>

        {/* Reaction rail */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2">
          {reactions.map((r) => (
            <button
              key={r}
              onClick={() => heart(r)}
              className="tap grid h-11 w-11 place-items-center rounded-full bg-black/50 text-xl ring-1 ring-white/15 backdrop-blur transition active:scale-90"
              aria-label={`Réagir ${r}`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Floating hearts */}
        {hearts.map((h) => (
          <span
            key={h.id}
            className="pointer-events-none absolute bottom-4 animate-float-up text-3xl"
            style={{ left: `${h.left}%` }}
          >
            {h.emoji}
          </span>
        ))}
      </div>


      {/* Tabs */}
      <div className="flex shrink-0 gap-1 border-b border-white/10 bg-dark px-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 border-b-2 px-2 py-3 text-xs font-semibold transition ${
              tab === t ? "border-primary text-white" : "border-transparent text-white/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="flex min-h-0 flex-1 flex-col">
        {tab === "Chat" && (
          <>
            <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
              {msgs.length === 0 && (
                <p className="mt-6 text-center text-xs text-white/50">Sois le premier à écrire un message ✨</p>
              )}
              {msgs.map((m) => (
                <div key={m.id} className="flex items-start gap-2 text-sm">
                  <span className="font-semibold" style={{ color: colorFor(m.author_name ?? "Invité") }}>
                    {m.author_name ?? "Invité"}
                  </span>
                  <span className="min-w-0 flex-1 break-words text-white/90">{m.content}</span>
                </div>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-2 border-t border-white/10 p-3">
              {user ? (
                <>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    placeholder="Envoyer un message..."
                    className="flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/50"
                  />
                  <button
                    onClick={() => heart("💖")}
                    className="grid h-10 w-10 place-items-center rounded-full bg-live text-white"
                    aria-label="Envoyer un cœur"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                  <button
                    onClick={submit}
                    disabled={!input.trim() || !dbId}
                    className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary disabled:opacity-50"
                    aria-label="Envoyer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-2.5 text-sm font-semibold"
                >
                  <LogIn className="h-4 w-4" /> Se connecter pour discuter
                </Link>
              )}
            </div>
          </>
        )}

        {tab === "Cadeaux" && (
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {gifts.length === 0 ? (
              <p className="rounded-2xl bg-white/5 p-6 text-center text-sm text-white/60">
                Aucune idée cadeau pour le moment.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {gifts.map((g) => (
                  <a
                    key={g.id}
                    href={g.external_url ?? "#"}
                    target={g.external_url ? "_blank" : undefined}
                    rel={g.external_url ? "noopener noreferrer" : undefined}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur transition hover:border-primary"
                  >
                    {g.image_url ? (
                      <img src={g.image_url} alt="" className="aspect-square w-full rounded-xl object-cover" />
                    ) : (
                      <div className="grid aspect-square w-full place-items-center rounded-xl bg-white/5 text-4xl">🎁</div>
                    )}
                    <p className="mt-2 line-clamp-2 text-sm font-semibold">{g.title}</p>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-white/70">
                        {typeof g.price === "number" ? `${g.price.toLocaleString("fr-FR")} €` : "—"}
                      </span>
                      {g.is_reserved ? (
                        <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-gold">Réservé</span>
                      ) : (
                        <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">Disponible</span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
            <Link
              to="/events/$slug/gift-registry"
              params={{ slug: event.slug }}
              className="block rounded-2xl bg-white/10 p-3 text-center text-xs font-semibold text-white/90 backdrop-blur"
            >
              Voir toute la liste de cadeaux →
            </Link>
          </div>
        )}


        {tab === "Cagnotte" && event.moneyPot && (
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="rounded-3xl bg-white/5 p-5">
              <p className="text-xs uppercase tracking-widest text-white/60">Via {event.moneyPot.platform}</p>
              <p className="mt-1 font-serif text-2xl">{event.moneyPot.title}</p>
              <div className="mt-4 flex items-end justify-between">
                <span className="font-serif text-3xl">{event.moneyPot.current.toLocaleString("fr-FR")} {event.moneyPot.currency}</span>
                <span className="text-sm text-white/60">/ {event.moneyPot.target.toLocaleString("fr-FR")}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-primary"
                  style={{ width: `${(event.moneyPot.current / event.moneyPot.target) * 100}%` }}
                />
              </div>
              <a
                href={event.moneyPot.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white"
              >
                <Gift className="h-4 w-4" /> Participer <ExternalLink className="h-3 w-3" />
              </a>
              <p className="mt-2 text-center text-[10px] text-white/50">
                Cagnotte externe. MaFeliza ne conserve pas les fonds.
              </p>
            </div>
          </div>
        )}

        {tab === "Photos" && (
          <div className="grid flex-1 grid-cols-3 gap-1 overflow-y-auto p-1">
            {album.length === 0 && (
              <p className="col-span-3 mt-6 text-center text-xs text-white/50">
                Aucune photo pour l'instant. Invite tes proches à contribuer !
              </p>
            )}
            {album.map((m) =>
              m.media_type === "video" ? (
                <video key={m.id} src={m.url} className="aspect-square h-full w-full object-cover" muted playsInline />
              ) : (
                <div key={m.id} className="aspect-square overflow-hidden">
                  <img src={m.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
