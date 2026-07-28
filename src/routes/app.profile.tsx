import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Settings, LogOut, Calendar, MessageCircle, Image, Heart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyEvents } from "@/lib/events.functions";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Profil — Memento Live" },
      { name: "description", content: "Votre profil Memento Live." },
    ],
  }),
  component: Profile,
});

type MyEvent = {
  id: string;
  slug: string;
  title: string;
  type: string;
  location: string | null;
  cover_url: string | null;
  status: string;
  memberRole: string;
};

function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const list = useServerFn(listMyEvents);
  const { data: myEvents = [] } = useQuery({
    queryKey: ["my-events", user?.id],
    enabled: !!user,
    queryFn: async () => (await list()) as MyEvent[],
  });

  const stats = [
    { icon: Calendar, label: "Événements", value: myEvents.length },
    { icon: MessageCircle, label: "Live", value: myEvents.filter((e) => e.status === "live").length },
    { icon: Image, label: "À venir", value: myEvents.filter((e) => e.status === "upcoming").length },
    { icon: Heart, label: "Passés", value: myEvents.filter((e) => e.status === "past").length },
  ];

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: "/auth", replace: true });
  }

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "Invité";
  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ??
    `https://i.pravatar.cc/150?u=${encodeURIComponent(user?.id ?? "guest")}`;

  return (
    <div className="space-y-6 px-4 py-4">
      <div className="rounded-3xl bg-gradient-primary p-6 text-white shadow-glow">
        <div className="flex items-center gap-4">
          <img src={avatarUrl} className="h-16 w-16 rounded-full border-2 border-white" alt="" />
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-2xl">{displayName}</h1>
            <p className="text-sm text-white/80">{user?.email ?? "Non connecté"}</p>
          </div>

          <Link to="/app/settings" className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur" aria-label="Paramètres">
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-surface p-3 text-center shadow-card">
            <s.icon className="mx-auto h-4 w-4 text-primary" />
            <div className="mt-2 font-serif text-xl">{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl">Mes événements</h2>
          <Link to="/app/create" className="text-xs font-semibold text-primary">
            + Créer
          </Link>
        </div>
        {!user ? (
          <Link
            to="/auth"
            className="block rounded-2xl bg-surface p-6 text-center text-sm text-muted-foreground shadow-card"
          >
            Connecte-toi pour voir tes événements
          </Link>
        ) : myEvents.length === 0 ? (
          <div className="rounded-2xl bg-surface p-6 text-center text-sm text-muted-foreground shadow-card">
            Aucun événement pour l'instant. Crée ton premier moment ✨
          </div>
        ) : (
          <div className="space-y-3">
            {myEvents.slice(0, 5).map((e) => (
              <Link
                key={e.id}
                to="/events/$slug"
                params={{ slug: e.slug }}
                className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-card"
              >
                {e.cover_url ? (
                  <img src={e.cover_url} alt="" className="h-14 w-14 rounded-xl object-cover" />
                ) : (
                  <div className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-primary font-serif text-xl text-white">
                    {e.title.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{e.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {e.type} · {e.location ?? "—"} · {e.memberRole}
                  </p>
                </div>
                {e.status === "live" && (
                  <span className="animate-pulse-live rounded-full bg-live px-2 py-1 text-[10px] font-bold text-white">LIVE</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {user && (
        <button onClick={handleSignOut} className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-danger">
          <LogOut className="h-4 w-4" /> Se déconnecter
        </button>
      )}
    </div>
  );
}
