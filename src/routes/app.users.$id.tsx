import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Calendar, MoreHorizontal, MessageCircle, UserPlus, Grid3x3, Heart, Bookmark } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getUserProfile } from "@/lib/social.functions";
import { startConversationWith } from "@/lib/messages.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/users/$id")({
  head: () => ({
    meta: [
      { title: "Profil — Memento Live" },
      { name: "description", content: "Découvrez un profil de la communauté Memento Live." },
    ],
  }),
  component: UserProfile,
});

function UserProfile() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const fetchProfile = useServerFn(getUserProfile);
  const startConv = useServerFn(startConversationWith);
  const [tab, setTab] = useState<"posts" | "events" | "saved">("posts");
  const [data, setData] = useState<Awaited<ReturnType<typeof getUserProfile>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchProfile({ data: { userId: id } });
        if (alive) setData(res);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id, fetchProfile]);

  const isMe = me?.id === id;
  const joined = useMemo(() => {
    if (!data?.profile?.created_at) return "";
    return new Date(data.profile.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  }, [data?.profile?.created_at]);

  async function openMessage() {
    if (!me) { navigate({ to: "/auth" }); return; }
    if (isMe) return;
    try {
      const conv = await startConv({ data: { otherUserId: id } });
      navigate({ to: "/app/messages/$id", params: { id: conv.id } });
    } catch { /* noop */ }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Chargement…</div>;
  }
  if (!data?.profile) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Profil introuvable.</p>
        <Link to="/app" className="mt-4 inline-block text-primary underline">Retour</Link>
      </div>
    );
  }

  const { profile, posts, events, postCount } = data;
  const displayName = profile.display_name ?? "Invité";
  const cover = events[0]?.cover_url ?? "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200";

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative">
        <div className="relative h-40 w-full overflow-hidden sm:h-52">
          <img src={cover} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <button onClick={() => history.back()} className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur" aria-label="Retour">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur" aria-label="Options">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <section className="relative mx-auto -mt-12 max-w-2xl px-4">
        <div className="flex items-end justify-between gap-4">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={displayName} className="h-24 w-24 rounded-full border-4 border-background object-cover shadow-card" />
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-background bg-primary/20 font-serif text-3xl text-primary shadow-card">
              {displayName.slice(0, 1)}
            </div>
          )}
          {!isMe && (
            <div className="mb-2 flex gap-2">
              <button
                onClick={openMessage}
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background"
                aria-label="Envoyer un message"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow">
                <UserPlus className="h-4 w-4" /> Suivre
              </button>
            </div>
          )}
          {isMe && (
            <Link
              to="/app/profile"
              className="mb-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold"
            >
              Modifier
            </Link>
          )}
        </div>

        <div className="mt-3">
          <h1 className="font-serif text-3xl leading-tight">{displayName}</h1>
          {profile.bio && <p className="mt-2 text-sm leading-relaxed">{profile.bio}</p>}
          {joined && (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Depuis {joined}</span>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 rounded-3xl bg-surface p-4 shadow-card">
          <div className="text-center">
            <p className="font-serif text-2xl leading-none">{postCount}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Publications</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl leading-none">{events.length}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Événements</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl leading-none">—</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Abonné·e·s</p>
          </div>
        </div>

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

        {tab === "posts" && (
          posts.length === 0 ? (
            <div className="mt-8 rounded-3xl border-2 border-dashed border-border p-8 text-center">
              <Grid3x3 className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 font-serif text-lg">Aucune publication</p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-3 gap-1">
              {posts.map((p) => {
                const src = p.media_urls?.[0] ?? (p.events as { cover_url?: string } | null)?.cover_url;
                return (
                  <Link
                    key={p.id}
                    to="/app/posts/$id"
                    params={{ id: p.id }}
                    className="relative aspect-square overflow-hidden bg-muted"
                  >
                    {src ? (
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center p-2 text-center text-[11px] text-muted-foreground">
                        {(p.content ?? "").slice(0, 60)}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )
        )}

        {tab === "events" && (
          events.length === 0 ? (
            <div className="mt-8 rounded-3xl border-2 border-dashed border-border p-8 text-center">
              <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 font-serif text-lg">Aucun événement public</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {events.map((e) => (
                <Link
                  key={e.id}
                  to="/events/$slug"
                  params={{ slug: e.slug }}
                  className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-card"
                >
                  {e.cover_url ? (
                    <img src={e.cover_url} alt="" className="h-14 w-14 rounded-2xl object-cover" />
                  ) : (
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/20 text-xs font-semibold text-primary">
                      {e.title.slice(0, 1)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-base leading-tight">{e.title}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{e.type}</p>
                  </div>
                  {e.status === "live" && (
                    <span className="animate-pulse-live rounded-full bg-live px-2 py-0.5 text-[10px] font-bold uppercase text-white">● Live</span>
                  )}
                </Link>
              ))}
            </div>
          )
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
