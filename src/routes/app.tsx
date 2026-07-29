import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { Logo } from "@/components/Logo";
import { Bell, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="relative min-h-screen bg-gradient-mesh pb-nav safe-x">
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="container-app flex items-center justify-between py-3">
          <Link to="/app" className="tap flex items-center"><Logo /></Link>
          <div className="flex items-center gap-1.5">
            <Link
              to="/app/notifications"
              className="tap relative grid place-items-center rounded-full transition-colors hover:bg-primary-light active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px] text-foreground" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </Link>
            <Link
              to="/app/messages"
              className="tap grid place-items-center rounded-full transition-colors hover:bg-primary-light active:scale-95"
              aria-label="Messages"
            >
              <MessageCircle className="h-[18px] w-[18px] text-foreground" />
            </Link>
          </div>
        </div>
      </header>
      <main className="container-app">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
