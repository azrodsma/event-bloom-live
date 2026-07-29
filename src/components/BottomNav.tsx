import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Plus, Heart, User } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { countUnread } from "@/lib/notifications.functions";

type NavItem = {
  to: "/app" | "/app/explore" | "/app/create" | "/app/favorites" | "/app/profile";
  label: string;
  icon: typeof Home;
  exact?: boolean;
  center?: boolean;
};

const items: NavItem[] = [
  { to: "/app", label: "Accueil", icon: Home, exact: true },
  { to: "/app/explore", label: "Explorer", icon: Search },
  { to: "/app/create", label: "Créer", icon: Plus, center: true },
  { to: "/app/favorites", label: "Favoris", icon: Heart },
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2">
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
                className="-mt-8 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-primary text-white shadow-glow transition-transform active:scale-95"
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
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span className="relative">
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {showBadge && (
                  <span className="absolute -right-1.5 -top-1 grid min-w-[16px] place-items-center rounded-full bg-primary px-1 text-[9px] font-bold leading-none text-primary-foreground shadow-sm">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
