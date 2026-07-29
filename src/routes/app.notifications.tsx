import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Users, Gift, Video, Camera, Bell, LogIn, Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { listMyNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/notifications.functions";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Memento Live" },
      { name: "description", content: "Toutes vos notifications d'événements." },
    ],
  }),
  component: Notifications,
});

const iconFor = (type: string) => {
  switch (type) {
    case "like": return { Icon: Heart, color: "bg-primary text-primary-foreground" };
    case "comment": return { Icon: MessageCircle, color: "bg-gold text-white" };
    case "rsvp": return { Icon: Users, color: "bg-surface-alt text-foreground" };
    case "live": return { Icon: Video, color: "bg-live text-white" };
    case "album": return { Icon: Camera, color: "bg-surface-alt text-primary" };
    case "cagnotte": return { Icon: Gift, color: "bg-gradient-primary text-white" };
    default: return { Icon: Bell, color: "bg-surface-alt text-foreground" };
  }
};

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return "à l'instant";
  if (s < 3600) return `${Math.floor(s / 60)} min`;
  if (s < 86400) return `${Math.floor(s / 3600)} h`;
  return `${Math.floor(s / 86400)} j`;
}

function Notifications() {
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const list = useServerFn(listMyNotifications);
  const markRead = useServerFn(markNotificationRead);
  const markAll = useServerFn(markAllNotificationsRead);

  const { data = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => list(),
    enabled: !!user,
  });

  if (loading) return null;

  if (!user) {
    return (
      <div className="px-4 py-10 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary/10">
          <Bell className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-serif text-2xl">Notifications</h1>
        <p className="mt-2 text-sm text-muted-foreground">Connectez-vous pour retrouver vos alertes, likes, commentaires et rappels.</p>
        <Link to="/auth" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">
          <LogIn className="h-4 w-4" /> Se connecter
        </Link>
      </div>
    );
  }

  const unread = data.filter((n) => !n.is_read).length;

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="font-serif text-3xl">Notifications</h1>
        {unread > 0 && (
          <button
            onClick={async () => { await markAll(); qc.invalidateQueries({ queryKey: ["notifications"] }); }}
            className="text-xs font-medium text-primary"
          >
            Tout marquer lu
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          Rien pour l'instant. Vos likes, commentaires et rappels apparaîtront ici.
        </p>
      ) : (
        <div className="space-y-2">
          {data.map((n) => {
            const { Icon, color } = iconFor(n.type);
            const inner = (
              <>
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{n.title}</p>
                    {!n.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  {n.body && <p className="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>}
                  <p className="mt-1 text-[10px] text-muted-foreground/70">{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && (
                  <button
                    onClick={async (e) => {
                      e.preventDefault(); e.stopPropagation();
                      await markRead({ data: { id: n.id } });
                      qc.invalidateQueries({ queryKey: ["notifications"] });
                    }}
                    className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
                    aria-label="Marquer lu"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}
              </>
            );
            const cls = `flex items-start gap-3 rounded-2xl p-3 shadow-card transition-colors ${
              !n.is_read ? "bg-primary-light/60" : "bg-surface"
            }`;
            return n.link ? (
              <Link key={n.id} to={n.link} className={cls}>{inner}</Link>
            ) : (
              <div key={n.id} className={cls}>{inner}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
