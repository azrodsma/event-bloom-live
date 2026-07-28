import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Settings, LogOut, Calendar, MessageCircle, Image, Heart } from "lucide-react";
import { mockEvents } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";


export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Profil — Memento Live" },
      { name: "description", content: "Votre profil Memento Live." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const stats = [
    { icon: Calendar, label: "Événements", value: 6 },
    { icon: MessageCircle, label: "Messages", value: 24 },
    { icon: Image, label: "Photos", value: 87 },
    { icon: Heart, label: "Favoris", value: 3 },
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
        <h2 className="mb-3 font-serif text-xl">Mes événements</h2>
        <div className="space-y-3">
          {mockEvents.slice(0, 3).map((e) => (
            <Link
              key={e.id}
              to="/events/$slug"
              params={{ slug: e.slug }}
              className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-card"
            >
              <img src={e.cover} alt="" className="h-14 w-14 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{e.title}</p>
                <p className="truncate text-xs text-muted-foreground">{e.type} · {e.city}</p>
              </div>
              {e.isLive && (
                <span className="animate-pulse-live rounded-full bg-live px-2 py-1 text-[10px] font-bold text-white">LIVE</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <button className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-danger">
        <LogOut className="h-4 w-4" /> Se déconnecter
      </button>
    </div>
  );
}
