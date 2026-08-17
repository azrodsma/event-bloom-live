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
    enabled: !!dbId,
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const goTo = (t: (typeof tabs)[number]) => {
    setTab(t);
    const el = sectionRefs.current[t];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join("");

  const viewers = event.viewers ?? 0;
  const compactViewers =
    viewers >= 1000 ? `${(viewers / 1000).toFixed(1).replace(".", ",")}K` : viewers.toLocaleString("fr-FR");

  const tabIcons: Record<(typeof tabs)[number], typeof Heart> = {
    Chat: MessageCircle,
    Réactions: Heart,
    Cadeaux: Gift,
    Cagnotte: PiggyBank,
    Photos: Camera,
    Caméras: Video,
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-dark text-white">
      {/* Barre supérieure : LIVE · vues · titre · partage · … · fermer */}
      <header className="flex shrink-0 items-center gap-2 px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <span className="animate-pulse-live rounded-lg bg-live px-2.5 py-1 text-[12px] font-extrabold uppercase leading-none tracking-wide">
          Live
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-white/90">
          <Eye className="h-4 w-4" /> {viewers.toLocaleString("fr-FR")}
        </span>
        <h1 className="min-w-0 flex-1 truncate text-center text-[15px] font-semibold">{event.title}</h1>
        <button className="tap grid h-8 w-8 shrink-0 place-items-center text-white/90" aria-label="Partager">
          <Share2 className="h-[18px] w-[18px]" />
        </button>
        <button className="tap grid h-8 w-8 shrink-0 place-items-center text-white/90" aria-label="Plus d'options">
          <MoreHorizontal className="h-5 w-5" />
        </button>
        <Link
          to="/events/$slug"
          params={{ slug: event.slug }}
          className="tap grid h-8 w-8 shrink-0 place-items-center text-white/90"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </Link>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {/* Lecteur */}
        <div className="relative h-[52dvh] min-h-[300px] bg-black sm:h-auto sm:aspect-video">
          {event.livestream ? (
            <iframe
              src={event.livestream.embedUrl}
              className="h-full w-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Live"
            />
          ) : (
            <img src={event.cover} alt="" className="h-full w-full object-cover opacity-90" />
          )}

          {/* Cagnotte en surimpression (haut droite) */}
          {event.moneyPot && (
            <a
              href={event.moneyPot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-2 top-2 flex items-center gap-2 rounded-2xl bg-black/70 px-3 py-2 ring-1 ring-white/10 backdrop-blur"
            >
              <span className="text-2xl leading-none">🎁</span>
              <span>
                <span className="block text-[20px] font-bold leading-tight">
                  {event.moneyPot.current.toLocaleString("fr-FR")} {event.moneyPot.currency}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-white/80">
                  Cagnotte des mariés <ChevronRight className="h-3 w-3" />
                </span>
              </span>
            </a>
          )}

          {/* Chat flottant */}
          <div className="pointer-events-none absolute bottom-14 left-2 max-w-[62%] space-y-2">
            {msgs.slice(-5).map((m) => {
              const name = m.author_name ?? "Invité";
              return (
                <div key={`ov-${m.id}`} className="flex items-center gap-2">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white ring-2 ring-white/25"
                    style={{ background: colorFor(name) }}
                  >
                    {initials(name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold leading-tight">{name}</span>
                    <span className="block truncate text-[13px] leading-tight text-white/90">{m.content}</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Colonne de réactions */}
          <div className="absolute bottom-14 right-2 flex flex-col items-center gap-3">
            {reactions.map((r, i) => (
              <button
                key={`${r}-${i}`}
                onClick={() => heart(r)}
                className="tap text-[26px] leading-none drop-shadow-lg transition active:scale-90"
                aria-label={`Réagir ${r}`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Pastille spectateurs */}
          <div className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-lg bg-black/65 px-2.5 py-1.5 text-[12px] font-semibold ring-1 ring-white/10 backdrop-blur">
            <Users className="h-3.5 w-3.5" /> {compactViewers}
          </div>

          {/* Cœurs flottants */}
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

        {/* Champ de message */}
        <section
          ref={(el) => {
            sectionRefs.current.Chat = el;
          }}
          className="px-3 pt-3"
        >
          {user ? (
            <div className="flex items-center gap-2 rounded-2xl bg-white/[0.08] px-4 py-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Écrire un message..."
                className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-white/50"
              />
              <button
                onClick={submit}
                disabled={!input.trim() || !dbId}
                className="tap shrink-0 text-white/90 disabled:opacity-40"
                aria-label="Envoyer"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-3 text-sm font-semibold"
            >
              <LogIn className="h-4 w-4" /> Se connecter pour discuter
            </Link>
          )}
        </section>

        {/* Réactions & cadeaux express */}
        <section
          ref={(el) => {
            sectionRefs.current.Réactions = el;
          }}
          className="mt-3 px-3"
        >
          <div className="flex items-stretch gap-2 rounded-2xl bg-white/[0.06] p-2">
            <div className="scrollbar-hide flex min-w-0 flex-1 gap-1 overflow-x-auto">
              {reactionGifts.map((g) => (
                <button
                  key={g.label}
                  onClick={() => heart(g.emoji)}
                  className="tap flex w-[72px] shrink-0 flex-col items-center gap-1 rounded-xl px-0.5 py-1.5 transition active:scale-95"
                >
                  <span className="text-[24px] leading-none">{g.emoji}</span>
                  <span className="whitespace-nowrap text-[10px] font-semibold leading-none">{g.label}</span>
                  <span className="text-[11px] leading-none text-white/60">{g.price === 0 ? "Gratuit" : `${g.price} €`}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => goTo("Cadeaux")}
              className="tap grid w-14 shrink-0 place-items-center rounded-2xl bg-live text-white"
              aria-label="Plus de cadeaux"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </section>

        {/* Changer de caméra */}
        <section
          ref={(el) => {
            sectionRefs.current.Caméras = el;
          }}
          className="mt-5"
        >
          <div className="flex items-center justify-between px-3">
            <h2 className="text-[17px] font-semibold">Changer de caméra</h2>
            <Link
              to="/events/$slug/multicam"
              params={{ slug: event.slug }}
              className="text-[13px] font-medium text-live"
            >
              Voir toutes
            </Link>
          </div>
          <div className="scrollbar-hide mt-2 flex gap-2 overflow-x-auto px-3 pb-1">
            {cameras.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setCam(c.id)}
                className={`relative h-[86px] w-[112px] shrink-0 overflow-hidden rounded-xl ring-2 transition ${
                  cam === c.id ? "ring-live" : "ring-white/10"
                }`}
              >
                <img
                  src={album[i]?.url ?? event.cover}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {c.live && (
                  <span className="absolute left-1.5 top-1.5 rounded-md bg-live px-1.5 py-0.5 text-[9px] font-bold uppercase">
                    Live
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 bg-black/55 py-1 text-[12px] font-medium">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Photos des invités */}
        <section
          ref={(el) => {
            sectionRefs.current.Photos = el;
          }}
          className="mt-5"
        >
          <div className="flex items-center justify-between px-3">
            <h2 className="text-[17px] font-semibold">
              Photos des invités <span className="text-live">{album.length}</span>
            </h2>
            <Link
              to="/events/$slug/album"
              params={{ slug: event.slug }}
              className="text-[13px] font-medium text-live"
            >
              Voir toutes
            </Link>
          </div>
          <div className="scrollbar-hide mt-2 flex gap-2 overflow-x-auto px-3 pb-1">
            {album.slice(0, 8).map((m) => (
              <div key={m.id} className="h-[86px] w-[86px] shrink-0 overflow-hidden rounded-xl bg-white/5">
                {m.media_type === "video" ? (
                  <video src={m.url} className="h-full w-full object-cover" muted playsInline />
                ) : (
                  <img src={m.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                )}
              </div>
            ))}
            <Link
              to="/events/$slug/album"
              params={{ slug: event.slug }}
              className="tap grid h-[86px] w-[86px] shrink-0 place-items-center rounded-xl bg-live"
              aria-label="Ajouter une photo"
            >
              <Plus className="h-6 w-6" />
            </Link>
          </div>
        </section>

        {/* Cadeaux */}
        <section
          ref={(el) => {
            sectionRefs.current.Cadeaux = el;
          }}
          className="mt-6 px-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold">Cadeaux</h2>
            <Link
              to="/events/$slug/gift-registry"
              params={{ slug: event.slug }}
              className="text-[13px] font-medium text-live"
            >
              Voir toute la liste
            </Link>
          </div>
          {gifts.length === 0 ? (
            <p className="mt-2 rounded-2xl bg-white/5 p-5 text-center text-sm text-white/60">
              Aucune idée cadeau pour le moment.
            </p>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-3">
              {gifts.slice(0, 4).map((g) => (
                <a
                  key={g.id}
                  href={g.external_url ?? "#"}
                  target={g.external_url ? "_blank" : undefined}
                  rel={g.external_url ? "noopener noreferrer" : undefined}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left"
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
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        Disponible
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Cagnotte */}
        {event.moneyPot && (
          <section
            ref={(el) => {
              sectionRefs.current.Cagnotte = el;
            }}
            className="mt-6 px-3 pb-6"
          >
            <div className="rounded-3xl bg-white/[0.06] p-5">
              <p className="text-xs uppercase tracking-widest text-white/60">Via {event.moneyPot.platform}</p>
              <p className="mt-1 font-serif text-2xl">{event.moneyPot.title}</p>
              <div className="mt-4 flex items-end justify-between">
                <span className="font-serif text-3xl">
                  {event.moneyPot.current.toLocaleString("fr-FR")} {event.moneyPot.currency}
                </span>
                <span className="text-sm text-white/60">/ {event.moneyPot.target.toLocaleString("fr-FR")}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-primary"
                  style={{ width: `${Math.min(100, (event.moneyPot.current / event.moneyPot.target) * 100)}%` }}
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
          </section>
        )}
      </div>

      {/* Barre d'onglets inférieure */}
      <nav className="grid shrink-0 grid-cols-6 border-t border-white/10 bg-dark pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-2">
        {tabs.map((t) => {
          const Icon = tabIcons[t];
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => goTo(t)}
              className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition ${
                active ? "text-live" : "text-white/70"
              }`}
            >
              <Icon className="h-5 w-5" />
              {t}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
