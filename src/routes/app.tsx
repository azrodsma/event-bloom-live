import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { AppTabs } from "@/components/AppTabs";
import { Logo } from "@/components/Logo";
import { Bell, MessageCircle, Menu } from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideNav = pathname.startsWith("/app/create");
  return (
    <div className={`relative min-h-screen overflow-x-hidden bg-gradient-mesh safe-x ${hideNav ? "" : "pb-nav"}`}>
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-2xl safe-top">
        <div className="container-app grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 py-3">
          <Link
            to="/app/profile"
            aria-label="Menu"
            className="tap grid h-9 w-9 shrink-0 place-items-center rounded-xl text-foreground transition-colors hover:bg-primary-light active:scale-95"
          >
            <Menu className="h-6 w-6" strokeWidth={2.25} />
          </Link>

          <Link to="/app" className="tap flex min-w-0 items-center justify-center">
            <Logo />
          </Link>

          <div className="flex shrink-0 items-center gap-1">
            <Link
              to="/app/messages"
              className="tap relative grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-primary-light active:scale-95"
              aria-label="Messages"
            >
              <MessageCircle className="h-[21px] w-[21px] text-foreground" strokeWidth={2} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-live ring-2 ring-background" />
            </Link>
            <Link
              to="/app/notifications"
              className="tap relative grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-primary-light active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="h-[21px] w-[21px] text-foreground" strokeWidth={2} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-live ring-2 ring-background" />
            </Link>
          </div>
        </div>

        {/* Onglets secondaires : masqués sur mobile pour rester fidèle à la maquette */}
        <div className="container-app hidden min-w-0 pb-3 sm:block">
          <AppTabs />
        </div>
      </header>

      <main className="container-app min-w-0">
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
