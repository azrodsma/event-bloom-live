import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Inbox, Star, Reply, Trash2, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/inbox")({
  component: InboxRoute,
  head: () => ({
    meta: [
      { title: "Messages · Memento Live" },
      { name: "description", content: "Conversations privées avec vos proches, prestataires et l'équipe Memento." },
      { property: "og:title", content: "Messages · Memento Live" },
      { property: "og:description", content: "Toutes vos conversations en un seul endroit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Msg = {
  id: string;
  sender: string;
  role: string;
  preview: string;
  time: string;
  unread?: boolean;
  starred?: boolean;
  avatar: string;
  tag: "Invité" | "Prestataire" | "Équipe" | "Famille";
};

const messages: Msg[] = [
  { id: "m1", sender: "Camille (témoin)", role: "Témoin de Sarah", preview: "J'ai commencé mon discours, tu veux le relire ?", time: "il y a 12 min", unread: true, avatar: "https://i.pravatar.cc/80?img=47", tag: "Famille" },
  { id: "m2", sender: "Fleuriste Camille", role: "Prestataire fleurs", preview: "La pivoine blanche est confirmée pour le 25.", time: "il y a 1 h", unread: true, avatar: "https://i.pravatar.cc/80?img=25", tag: "Prestataire" },
  { id: "m3", sender: "Support Memento", role: "Équipe", preview: "Votre replay a bien été archivé, voici le lien…", time: "Hier", starred: true, avatar: "https://i.pravatar.cc/80?img=68", tag: "Équipe" },
  { id: "m4", sender: "Julien & Léa", role: "Invités", preview: "On confirme notre venue avec les enfants !", time: "Hier", avatar: "https://i.pravatar.cc/80?img=12", tag: "Invité" },
  { id: "m5", sender: "Traiteur Épicure", role: "Prestataire repas", preview: "Menu végétarien validé pour 8 personnes.", time: "Lun.", avatar: "https://i.pravatar.cc/80?img=8", tag: "Prestataire" },
  { id: "m6", sender: "Grand-mère Odile", role: "Famille", preview: "Ma chérie, je suis si fière de toi 💐", time: "Dim.", starred: true, avatar: "https://i.pravatar.cc/80?img=1", tag: "Famille" },
];

const tagColor: Record<Msg["tag"], string> = {
  Famille: "bg-primary/15 text-primary",
  Prestataire: "bg-gold/20 text-gold",
  Équipe: "bg-primary-dark/15 text-primary-dark",
  Invité: "bg-success/15 text-success",
};

const filters = ["Tous", "Non lus", "Étoilés"] as const;

function InboxRoute() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tous");
  const list = messages.filter((m) =>
    filter === "Non lus" ? m.unread : filter === "Étoilés" ? m.starred : true
  );
  const unread = messages.filter((m) => m.unread).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <p className="font-serif text-lg leading-tight">Messages</p>
            <p className="text-xs text-muted-foreground">{unread} non lus · {messages.length} conversations</p>
          </div>
          <Inbox className="h-5 w-5 text-primary" />
        </div>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Rechercher un contact, un mot…"
            className="w-full rounded-full bg-surface pl-10 pr-4 py-2.5 text-sm outline-none"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                filter === f ? "bg-primary text-white" : "bg-surface text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-2xl">
        <div className="divide-y divide-border/60">
          {list.map((m) => (
            <button key={m.id} className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-surface">
              <div className="relative flex-shrink-0">
                <img src={m.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                {m.unread && (
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`truncate text-sm ${m.unread ? "font-bold" : "font-semibold"}`}>{m.sender}</p>
                  <span className="flex-shrink-0 text-[11px] text-muted-foreground">{m.time}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{m.role}</p>
                <p className={`mt-1 truncate text-sm ${m.unread ? "text-foreground" : "text-muted-foreground"}`}>
                  {m.preview}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tagColor[m.tag]}`}>
                    {m.tag}
                  </span>
                  {m.starred && <Star className="h-3.5 w-3.5 fill-gold text-gold" />}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-around border-t border-border/60 bg-surface/50 p-3">
          <button className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <Reply className="h-4 w-4" /> Répondre
          </button>
          <button className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <Star className="h-4 w-4" /> Étoiler
          </button>
          <button className="flex items-center gap-1 text-xs font-semibold text-destructive">
            <Trash2 className="h-4 w-4" /> Archiver
          </button>
        </div>
      </main>
    </div>
  );
}
