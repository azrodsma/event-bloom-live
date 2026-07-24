import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { Logo } from "@/components/Logo";
import { Bell, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link to="/app"><Logo /></Link>
          <div className="flex items-center gap-2">
            <Link to="/app/notifications" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted" aria-label="Notifications">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Link>
            <Link to="/app/messages" className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted" aria-label="Messages">
              <MessageCircle className="h-5 w-5 text-foreground" />
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
