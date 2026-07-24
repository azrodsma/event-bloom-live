import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEvent, liveChatMessages, paidInteractions } from "@/lib/mock-data";
import { useState } from "react";
import { X, Share2, Send, Heart, Gift, Users, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/events/$slug/live")({
  head: ({ params }) => {
    const e = findEvent(params.slug);
    return {
      meta: [
        { title: e ? `Live · ${e.title} — Memento Live` : "Live — Memento Live" },
        { name: "description", content: e?.description ?? "" },
      ],
    };
  },
  loader: ({ params }) => {
    const e = findEvent(params.slug);
    if (!e) throw notFound();
    return { event: e };
  },
  component: LivePage,
});

const tabs = ["Chat", "Cadeaux", "Cagnotte", "Photos"] as const;

function LivePage() {
  const { event } = Route.useLoaderData();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Chat");
  const [msgs, setMsgs] = useState(liveChatMessages);
  const [input, setInput] = useState("");
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { id: `n${Date.now()}`, user: "Vous", color: "#E85D8E", text: input, time: "maintenant" }]);
    setInput("");
  };

  const heart = () => {
    const id = Date.now();
    setHearts((h) => [...h, { id, left: 20 + Math.random() * 60 }]);
    setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 2000);
  };

  return (
    <div className="flex h-screen flex-col bg-dark text-white">
      {/* Player */}
      <div className="relative aspect-video shrink-0 bg-black sm:aspect-[16/9]">
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
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Link
            to="/events/$slug"
            params={{ slug: event.slug }}
            className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-black/60 backdrop-blur"
          >
            <X className="h-5 w-5" />
          </Link>
          <div className="pointer-events-auto flex items-center gap-2">
            <span className="animate-pulse-live rounded-full bg-live px-3 py-1 text-[11px] font-bold uppercase">● Live</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs backdrop-blur">
              <Users className="h-3 w-3" /> {event.viewers?.toLocaleString("fr-FR") ?? "—"}
            </span>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-black/60 backdrop-blur">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 right-3">
          <p className="text-xs uppercase tracking-widest opacity-80">{event.type} · {event.city}</p>
          <p className="font-serif text-2xl">{event.title}</p>
        </div>

        {/* Floating hearts */}
        {hearts.map((h) => (
          <span
            key={h.id}
            className="pointer-events-none absolute bottom-4 animate-float-up text-3xl"
            style={{ left: `${h.left}%` }}
          >
            💖
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
            <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
              {msgs.map((m) => (
                <div key={m.id} className="flex items-start gap-2 text-sm">
                  <span className="font-semibold" style={{ color: m.color }}>{m.user}</span>
                  <span className="min-w-0 flex-1 break-words text-white/90">{m.text}</span>
                </div>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-2 border-t border-white/10 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Envoyer un message..."
                className="flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/50"
              />
              <button onClick={heart} className="grid h-10 w-10 place-items-center rounded-full bg-live text-white">
                <Heart className="h-4 w-4 fill-current" />
              </button>
              <button onClick={send} className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        )}

        {tab === "Cadeaux" && (
          <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-4">
            {paidInteractions.map((p) => (
              <button
                key={p.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur transition hover:border-primary"
              >
                <div className="text-4xl">{p.emoji}</div>
                <p className="mt-2 text-sm font-semibold">{p.label}</p>
                <p className="text-xs text-white/60">{p.price} €</p>
              </button>
            ))}
            <p className="col-span-2 mt-2 rounded-2xl bg-white/5 p-3 text-center text-[11px] text-white/60">
              Interactions payantes — paiement sécurisé (Stripe). Une partie soutient les créateurs.
            </p>
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
                Cagnotte externe. Memento Live ne conserve pas les fonds.
              </p>
            </div>
          </div>
        )}

        {tab === "Photos" && (
          <div className="grid flex-1 grid-cols-3 gap-1 overflow-y-auto p-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/live${i}/300/300`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
