import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Edit3 } from "lucide-react";
import { mockEvents } from "@/lib/mock-data";

export const Route = createFileRoute("/app/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Memento Live" },
      { name: "description", content: "Vos conversations privées et de groupe." },
    ],
  }),
  component: Messages,
});

const threads = [
  {
    id: "t1",
    kind: "group",
    name: "Témoins Sarah & Thomas",
    avatars: ["https://i.pravatar.cc/80?img=47", "https://i.pravatar.cc/80?img=12", "https://i.pravatar.cc/80?img=25"],
    last: "Emma : Le discours est prêt ! 💌",
    time: "20:14",
    unread: 3,
    event: "sarah-thomas",
  },
  {
    id: "t2",
    kind: "dm",
    name: "Marie Laurent",
    avatars: ["https://i.pravatar.cc/80?img=47"],
    last: "On se retrouve à 15h à la mairie ?",
    time: "19:52",
    unread: 1,
  },
  {
    id: "t3",
    kind: "group",
    name: "Famille — Baptême Gabriel",
    avatars: ["https://i.pravatar.cc/80?img=32", "https://i.pravatar.cc/80?img=15"],
    last: "Papa : J'ai récupéré la robe 🕊️",
    time: "17:30",
    unread: 0,
    event: "bapteme-gabriel",
  },
  {
    id: "t4",
    kind: "dm",
    name: "Julien Roux",
    avatars: ["https://i.pravatar.cc/80?img=15"],
    last: "Merci pour l'invitation ❤️",
    time: "hier",
    unread: 0,
  },
  {
    id: "t5",
    kind: "group",
    name: "Cousins Clara 30",
    avatars: ["https://i.pravatar.cc/80?img=44", "https://i.pravatar.cc/80?img=11"],
    last: "Léa : On prépare la surprise 🎂",
    time: "mardi",
    unread: 0,
    event: "clara-30",
  },
];

function Messages() {
  const liveEvents = mockEvents.filter((e) => e.isLive);

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="font-serif text-3xl">Messages</h1>
        <button className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-white shadow-glow" aria-label="Nouveau message">
          <Edit3 className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 shadow-card">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Rechercher une conversation…"
          className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {liveEvents.length > 0 && (
        <section className="mb-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Chats live en cours</p>
          <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4">
            {liveEvents.map((e) => (
              <Link
                key={e.id}
                to="/events/$slug/live"
                params={{ slug: e.slug }}
                className="flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl bg-gradient-live text-white shadow-glow"
              >
                <img src={e.cover} alt="" className="h-20 w-full object-cover" />
                <div className="p-3">
                  <span className="animate-pulse-live inline-block rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold uppercase">● Live</span>
                  <p className="mt-1.5 truncate text-sm font-semibold">{e.title}</p>
                  <p className="truncate text-[11px] text-white/80">{e.viewers?.toLocaleString("fr-FR")} spectateurs</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conversations</p>
        <div className="space-y-1">
          {threads.map((t) => (
            <div
              key={t.id}
              className="flex cursor-pointer items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-surface"
            >
              <div className="relative shrink-0">
                {t.avatars.length === 1 ? (
                  <img src={t.avatars[0]} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="relative h-12 w-12">
                    <img src={t.avatars[0]} alt="" className="absolute left-0 top-0 h-8 w-8 rounded-full border-2 border-background object-cover" />
                    <img src={t.avatars[1]} alt="" className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-2 border-background object-cover" />
                  </div>
                )}
                {t.unread > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                    {t.unread}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{t.time}</span>
                </div>
                <p className={`truncate text-xs ${t.unread > 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>{t.last}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
