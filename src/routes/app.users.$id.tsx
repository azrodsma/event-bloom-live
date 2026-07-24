import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, MapPin, Calendar, MoreHorizontal, MessageCircle, UserPlus, UserCheck, Grid3x3, Heart, Bookmark, Sparkles } from "lucide-react";
import { useState } from "react";
import { mockEvents } from "@/lib/mock-data";

export const Route = createFileRoute("/app/users/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Profil — Memento Live` },
      { name: "description", content: `Découvrez le profil ${params.id}.` },
    ],
  }),
  component: UserProfile,
});

const users: Record<string, { name: string; handle: string; avatar: string; cover: string; bio: string; location: string; joined: string; badge?: string }> = {
  emma: {
    name: "Emma Laurent",
    handle: "@emma.laurent",
    avatar: "https://i.pravatar.cc/200?img=12",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
    bio: "Témoin de mariage certifiée 💌 · Amoureuse des jolis moments · Paris ↔ Lisbonne",
    location: "Paris, France",
    joined: "juin 2025",
    badge: "Ambassadrice",
  },
  lucas: {
    name: "Lucas Martin",
    handle: "@lucas.m",
    avatar: "https://i.pravatar.cc/200?img=25",
    cover: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1200",
    bio: "Photographe d'événements · Capture ce qui compte 📸",
    location: "Lyon, France",
    joined: "mai 2025",
  },
};

function UserProfile() {
  const { id } = Route.useParams();
  const [tab, setTab] = useState<"posts" | "events" | "saved">("posts");
  const [following, setFollowing] = useState(false);
  const user = users[id] ?? users.emma;

  const posts = [
    "photo-1519741497674-611481863552",
    "photo-1511285560929-80b456fea0bc",
    "photo-1465495976277-4387d4b0e4a6",
    "photo-1519225421980-715cb0215aed",
    "photo-1520854221256-17451cc331bf",
    "photo-1478146896981-b80fe463b330",
    "photo-1583939003579-730e3918a45a",
    "photo-1519671482749-fd09be7ccebf",
    "photo-1522673607200-164d1b6ce486",
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Cover + header */}
      <div className="relative">
        <div className="relative h-40 w-full overflow-hidden sm:h-52">
          <img src={user.cover} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <Link to="/app" className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Identity */}
      <section className="relative mx-auto -mt-12 max-w-2xl px-4">
        <div className="flex items-end justify-between gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-24 w-24 rounded-full border-4 border-background object-cover shadow-card"
          />
          <div className="mb-2 flex gap-2">
            <Link
              to="/app/messages/$id"
              params={{ id: "t2" }}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background"
              aria-label="Message"
            >
              <MessageCircle className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setFollowing((f) => !f)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                following ? "border border-border bg-background" : "bg-gradient-primary text-white shadow-glow"
              }`}
            >
              {following ? (
                <>
                  <UserCheck className="h-4 w-4" /> Abonné·e
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" /> Suivre
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl leading-tight">{user.name}</h1>
            {user.badge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold-light px-2.5 py-0.5 text-[10px] font-bold uppercase text-gold">
                <Sparkles className="h-2.5 w-2.5" /> {user.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{user.handle}</p>
          <p className="mt-2 text-sm leading-relaxed">{user.bio}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {user.location}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Depuis {user.joined}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3 rounded-3xl bg-surface p-4 shadow-card">
          {[
            { v: "128", l: "Publications" },
            { v: "1,2k", l: "Abonné·e·s" },
            { v: "432", l: "Abonnements" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-serif text-2xl leading-none">{s.v}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">À la une</p>
          <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4">
            {mockEvents.slice(0, 4).map((e) => (
              <Link
                key={e.id}
                to="/events/$slug"
                params={{ slug: e.slug }}
                className="flex w-20 shrink-0 flex-col items-center gap-1.5"
              >
                <div className="rounded-full bg-gradient-primary p-0.5">
                  <div className="rounded-full border-2 border-background">
                    <img src={e.cover} alt="" className="h-16 w-16 rounded-full object-cover" />
                  </div>
                </div>
                <span className="w-full truncate text-center text-[10px]">{e.title.split(" ")[0]}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex justify-around border-b border-border">
          {([
            { id: "posts", icon: Grid3x3, label: "Publications" },
            { id: "events", icon: Heart, label: "Événements" },
            { id: "saved", icon: Bookmark, label: "Sauvés" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-xs font-semibold transition-colors ${
                tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "posts" && (
          <div className="mt-4 grid grid-cols-3 gap-1">
            {posts.map((id) => (
              <div key={id} className="relative aspect-square overflow-hidden">
                <img src={`https://images.unsplash.com/${id}?w=400`} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {tab === "events" && (
          <div className="mt-4 space-y-3">
            {mockEvents.slice(0, 4).map((e) => (
              <Link
                key={e.id}
                to="/events/$slug"
                params={{ slug: e.slug }}
                className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-card"
              >
                <img src={e.cover} alt="" className="h-14 w-14 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-base leading-tight">{e.title}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{e.venue} · {e.city}</p>
                </div>
                {e.isLive && (
                  <span className="animate-pulse-live rounded-full bg-live px-2 py-0.5 text-[10px] font-bold uppercase text-white">● Live</span>
                )}
              </Link>
            ))}
          </div>
        )}

        {tab === "saved" && (
          <div className="mt-8 rounded-3xl border-2 border-dashed border-border p-8 text-center">
            <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 font-serif text-lg">Rien de sauvegardé</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Les moments que vous mettez de côté apparaîtront ici.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
