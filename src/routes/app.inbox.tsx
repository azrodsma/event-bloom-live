import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, AtSign, Heart, Users, Sparkles, CheckCheck, Filter, Search, Archive } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/inbox")({
  component: Inbox,
  head: () => ({
    meta: [
      { title: "Boîte de réception · Memento Live" },
      { name: "description", content: "Invitations, mentions, réponses et messages : tout au même endroit." },
      { property: "og:title", content: "Boîte de réception · Memento Live" },
      { property: "og:description", content: "Toute votre vie sociale, réunie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Filter = "all" | "invites" | "mentions" | "replies" | "cagnottes";

const filters: { id: Filter; label: string; count?: number }[] = [
  { id: "all", label: "Tout", count: 24 },
  { id: "invites", label: "Invitations", count: 3 },
  { id: "mentions", label: "Mentions", count: 8 },
  { id: "replies", label: "Réponses", count: 12 },
  { id: "cagnottes", label: "Cagnottes", count: 1 },
];

type Message = {
  id: string;
  type: "invite" | "mention" | "reply" | "cagnotte" | "like";
  avatar: string;
  from: string;
  action: string;
  target?: string;
  time: string;
  preview?: string;
  eventLabel?: string;
  unread?: boolean;
  cta?: string;
};

const messages: Message[] = [
  {
    id: "1",
    type: "invite",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    from: "Sarah & Thomas",
    action: "vous ont invité·e à leur mariage",
    eventLabel: "12 sept. · Domaine des Roses",
    time: "il y a 12 min",
    unread: true,
    cta: "Répondre",
  },
  {
    id: "2",
    type: "cagnotte",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
    from: "Baptême de Gabriel",
    action: "a atteint 78 % de la cagnotte",
    eventLabel: "Objectif 1 200 €",
    time: "il y a 45 min",
    unread: true,
    cta: "Contribuer",
  },
  {
    id: "3",
    type: "mention",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100",
    from: "Camille Vidal",
    action: "vous a mentionné·e",
    target: "dans le livre d'or",
    preview: "« @louise tu te souviens du fou rire à Bandol ? Faut absolument le raconter aux mariés ! »",
    time: "il y a 1 h",
    unread: true,
    eventLabel: "Mariage Sarah & Thomas",
  },
  {
    id: "4",
    type: "reply",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100",
    from: "Julien Roux",
    action: "a répondu à votre message",
    preview: "« Franchement magique, merci pour l'ambiance. On remet ça à la crémaillère ? »",
    time: "il y a 3 h",
    eventLabel: "EVJF Léa",
  },
  {
    id: "5",
    type: "like",
    avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100",
    from: "Anaïs Dubois + 8 autres",
    action: "ont aimé votre photo",
    time: "il y a 5 h",
    eventLabel: "Album — 30 ans de Clara",
  },
  {
    id: "6",
    type: "mention",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    from: "Léa Moreau",
    action: "vous a taggé·e dans un moment",
    preview: "Photo du toast · 22 h 45",
    time: "hier",
    eventLabel: "Mariage Sarah & Thomas",
  },
  {
    id: "7",
    type: "invite",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    from: "Emma & Paul",
    action: "vous ont invité·e à leur baby-shower",
    eventLabel: "5 oct. · À la maison",
    time: "hier",
    cta: "Répondre",
  },
];

const typeMeta = {
  invite: { icon: Mail, tint: "bg-primary/10 text-primary" },
  mention: { icon: AtSign, tint: "bg-sky-50 text-sky-700" },
  reply: { icon: Mail, tint: "bg-secondary text-foreground" },
  cagnotte: { icon: Sparkles, tint: "bg-amber-50 text-amber-700" },
  like: { icon: Heart, tint: "bg-rose-50 text-rose-700" },
} as const;

function Inbox() {
  const [filter, setFilter] = useState<Filter>("all");
  const [readAll, setReadAll] = useState(false);

  const filtered = messages.filter((m) => {
    if (filter === "all") return true;
    if (filter === "invites") return m.type === "invite";
    if (filter === "mentions") return m.type === "mention";
    if (filter === "replies") return m.type === "reply" || m.type === "like";
    if (filter === "cagnottes") return m.type === "cagnotte";
    return true;
  });

  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Boîte de réception</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Recherche">
          <Search className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-primary/10 to-transparent px-4 pb-5 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Users className="h-3.5 w-3.5 text-primary" /> {unreadCount} non lus · 5 événements actifs
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Toute votre vie<br />sociale, réunie</h1>
      </section>

      <div className="sticky top-14 z-10 space-y-3 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  active ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                }`}
              >
                {f.label}
                {f.count ? <span className={`ml-1 ${active ? "text-background/70" : "text-primary"}`}>{f.count}</span> : null}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <button
            onClick={() => setReadAll(true)}
            className="inline-flex items-center gap-1 font-semibold text-primary"
          >
            <CheckCheck className="h-3 w-3" /> Tout marquer comme lu
          </button>
          <button className="inline-flex items-center gap-1 font-semibold">
            <Filter className="h-3 w-3" /> Trier
          </button>
        </div>
      </div>

      <ul className="divide-y divide-border/60">
        {filtered.map((m) => {
          const meta = typeMeta[m.type];
          const Icon = meta.icon;
          const unread = m.unread && !readAll;
          return (
            <li key={m.id} className={`relative px-4 py-3 transition-colors ${unread ? "bg-primary/[0.03]" : ""}`}>
              {unread && <span className="absolute left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />}
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img src={m.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                  <span className={`absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full ring-2 ring-background ${meta.tint}`}>
                    <Icon className="h-2.5 w-2.5" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug">
                    <span className="font-bold">{m.from}</span> {m.action}
                    {m.target ? <span className="text-muted-foreground"> {m.target}</span> : null}
                  </p>
                  {m.preview && (
                    <p className="mt-1 line-clamp-2 rounded-xl bg-secondary/50 px-2.5 py-1.5 font-serif text-[11px] italic text-muted-foreground">
                      {m.preview}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{m.time}</span>
                    {m.eventLabel && (
                      <>
                        <span>·</span>
                        <span className="truncate">{m.eventLabel}</span>
                      </>
                    )}
                  </div>
                  {m.cta && (
                    <div className="mt-2 flex gap-2">
                      <button className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground">
                        {m.cta}
                      </button>
                      <button className="rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold">
                        Plus tard
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mx-4 mt-6 flex items-center justify-between rounded-3xl bg-card p-4 ring-1 ring-border/60">
        <div className="min-w-0">
          <p className="text-sm font-semibold">Voir les archives</p>
          <p className="text-[10px] text-muted-foreground">Messages plus anciens qu'un mois</p>
        </div>
        <Archive className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
