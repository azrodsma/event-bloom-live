import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Settings, LogOut, Calendar, MessageCircle, Image, Heart, Pencil, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { listMyEvents } from "@/lib/events.functions";
import { getMyProfile, updateMyProfile } from "@/lib/profile.functions";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Profil — MaFeliza" },
      { name: "description", content: "Votre profil MaFeliza." },
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
  const fetchProfile = useServerFn(getMyProfile);
  const saveProfile = useServerFn(updateMyProfile);

  const { data: myEvents = [] } = useQuery({
    queryKey: ["my-events", user?.id],
    enabled: !!user,
    queryFn: async () => (await list()) as MyEvent[],
  });

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    enabled: !!user,
    queryFn: () => fetchProfile(),
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ displayName: "", bio: "", avatarUrl: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.display_name ?? "",
        bio: profile.bio ?? "",
        avatarUrl: profile.avatar_url ?? "",
      });
    }
  }, [profile]);

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

  async function handleSave() {
    setSaving(true);
    try {
      await saveProfile({
        data: {
          displayName: form.displayName.trim() || undefined,
          bio: form.bio.trim() || null,
          avatarUrl: form.avatarUrl.trim() || null,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["my-profile", user?.id] });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  const displayName =
    profile?.display_name ??
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "Invité";
  const avatarUrl =
    profile?.avatar_url ??
    (user?.user_metadata?.avatar_url as string | undefined) ??
    `https://i.pravatar.cc/150?u=${encodeURIComponent(user?.id ?? "guest")}`;


  const headerStats = [
    { label: "Événements", value: myEvents.length },
    { label: "À venir", value: myEvents.filter((e) => e.status === "upcoming").length },
    { label: "Organisés", value: myEvents.filter((e) => e.memberRole === "owner" || e.memberRole === "organizer").length },
  ];

  const menu = [
    { to: "/app/agenda" as const, label: "Mes événements", icon: Calendar },
    { to: "/app/messages" as const, label: "Mes messages", icon: MessageCircle },
    { to: "/app/gift-ideas" as const, label: "Mes cadeaux", icon: Gift },
    { to: "/app/moments" as const, label: "Mes vidéos", icon: Video },
    { to: "/app/settings" as const, label: "Paramètres", icon: Settings },
    { to: "/app/help" as const, label: "Aide & Contact", icon: LifeBuoy },
  ];

  return (
    <div className="pb-4">
      {/* En-tête iris */}
      <div className="bg-iris px-5 pb-5 pt-4 text-white safe-top">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3.5">
          <img src={avatarUrl} className="h-16 w-16 shrink-0 rounded-full border-2 border-white/60 object-cover" alt="" />
          <div className="min-w-0">
            <h1 className="truncate text-[19px] font-bold leading-tight">{displayName}</h1>
            <p className="truncate text-[13px] text-white/75">
              {myEvents.some((e) => e.memberRole === "owner") ? "Organisateur" : "Invité"}
            </p>
            {profile?.bio && !editing && <p className="mt-0.5 line-clamp-1 text-[11.5px] text-white/70">{profile.bio}</p>}
          </div>
          {user && (
            <button
              onClick={() => setEditing((v) => !v)}
              className="tap grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20"
              aria-label={editing ? "Annuler" : "Modifier le profil"}
            >
              {editing ? <X className="h-4.5 w-4.5" /> : <Pencil className="h-4 w-4" />}
            </button>
          )}
        </div>

        <div className="mt-5 grid grid-cols-3">
          {headerStats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[22px] font-bold leading-none">{s.value}</div>
              <div className="mt-1 text-[11.5px] text-white/75">{s.label}</div>
            </div>
          ))}
        </div>

        {editing && user && (
          <div className="mt-4 space-y-2">
            <input
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              placeholder="Nom affiché"
              className="w-full rounded-[14px] bg-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/60 outline-none focus:bg-white/25"
            />
            <input
              value={form.avatarUrl}
              onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
              placeholder="URL de l'avatar (https://…)"
              className="w-full rounded-[14px] bg-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/60 outline-none focus:bg-white/25"
            />
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Une bio courte…"
              rows={2}
              className="w-full resize-none rounded-[14px] bg-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/60 outline-none focus:bg-white/25"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="tap inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-iris disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" /> {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="mx-4 mt-4 overflow-hidden rounded-[18px] bg-surface shadow-card">
        {menu.map((m, i) => (
          <Link
            key={m.to}
            to={m.to}
            className={`tap grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 ${
              i > 0 ? "border-t border-border/60" : ""
            }`}
          >
            <m.icon className="h-5 w-5 shrink-0 text-iris" />
            <span className="truncate text-[14.5px] font-medium">{m.label}</span>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </nav>

      {/* Espace caméraman */}
      <Link
        to="/app/cameraman"
        className="tap mx-4 mt-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] bg-iris-light/70 p-3.5"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-iris text-white">
          <Camera className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[14.5px] font-semibold">Espace Caméraman</span>
          <span className="block text-[11.5px] text-muted-foreground">Vos missions et diffusions live</span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>

      {/* Mes événements */}
      <section className="mt-5 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-bold">Mes événements</h2>
          <Link to="/app/create" className="text-xs font-semibold text-primary">
            + Créer
          </Link>
        </div>
        {!user ? (
          <Link to="/auth" className="block rounded-[18px] bg-surface p-6 text-center text-sm text-muted-foreground shadow-card">
            Connecte-toi pour voir tes événements
          </Link>
        ) : myEvents.length === 0 ? (
          <div className="rounded-[18px] bg-surface p-6 text-center text-sm text-muted-foreground shadow-card">
            Aucun événement pour l'instant. Crée ton premier moment ✨
          </div>
        ) : (
          <div className="space-y-2.5">
            {myEvents.slice(0, 5).map((e) => (
              <Link
                key={e.id}
                to="/events/$slug"
                params={{ slug: e.slug }}
                className="tap flex items-center gap-3 rounded-[18px] bg-surface p-3 shadow-card"
              >
                {e.cover_url ? (
                  <img src={e.cover_url} alt="" loading="lazy" className="h-14 w-14 rounded-[14px] object-cover" />
                ) : (
                  <div className="grid h-14 w-14 place-items-center rounded-[14px] bg-gradient-primary font-serif text-xl text-white">
                    {e.title.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14.5px] font-semibold">{e.title}</p>
                  <p className="truncate text-[11.5px] text-muted-foreground">
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
      </section>

      {user && (
        <button
          onClick={handleSignOut}
          className="tap mx-4 mt-5 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-danger"
        >
          <LogOut className="h-4 w-4" /> Se déconnecter
        </button>
      )}
    </div>
  );
}
