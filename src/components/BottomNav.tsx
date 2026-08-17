import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { countUnread } from "@/lib/notifications.functions";

type NavItem = {
  to: "/app" | "/app/explore" | "/app/create" | "/app/messages" | "/app/profile";
  label: string;
  icon: typeof Home;
  exact?: boolean;
  center?: boolean;
};

const items: NavItem[] = [
  { to: "/app", label: "Accueil", icon: Home, exact: true },
  { to: "/app/explore", label: "Explorer", icon: Search },
  { to: "/app/create", label: "Créer", icon: Plus, center: true },
  { to: "/app/messages", label: "Messages", icon: MessageCircle },
  { to: "/app/profile", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const qc = useQueryClient();
  const fetchUnread = useServerFn(countUnread);

  const { data: unreadData } = useQuery({
    queryKey: ["notifications-unread"],
    queryFn: () => fetchUnread(),
    enabled: !!user,
    refetchOnWindowFocus: true,
  });
  const unread = unreadData?.count ?? 0;

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`nav-notifs-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => qc.invalidateQueries({ queryKey: ["notifications-unread"] }),
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, qc]);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      aria-label="Navigation principale"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/85 to-transparent" />
      <div className="relative mx-auto flex max-w-md items-center justify-around gap-1 rounded-full border border-border/60 bg-surface/95 px-3 py-2 shadow-modal backdrop-blur-2xl mx-3">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.to
            : pathname.startsWith(item.to);
          const Icon = item.icon;
          if (item.center) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="-mt-8 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-primary text-white shadow-glow ring-4 ring-background transition-all active:scale-90 hover:rotate-90 duration-300"
                aria-label={item.label}
              >
                <Icon className="h-6 w-6" strokeWidth={2.5} />
              </Link>
            );
          }
          const showBadge = item.to === "/app/profile" && unread > 0;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 text-[10px] font-medium transition-all tap active:scale-95 ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span className="relative">
                <Icon className={`h-5 w-5 transition-transform ${active ? "scale-110" : "group-hover:scale-105"}`} strokeWidth={active ? 2.5 : 2} />
                {showBadge && (
                  <span className="absolute -right-1.5 -top-1 grid min-w-[16px] place-items-center rounded-full bg-primary px-1 text-[9px] font-bold leading-none text-primary-foreground shadow-sm ring-2 ring-surface">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </span>
              <span className="tracking-wide">{item.label}</span>
              {active && <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

