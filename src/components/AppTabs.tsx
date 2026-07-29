import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Sparkles, BookHeart } from "lucide-react";

const tabs = [
  { to: "/app", label: "Feed", icon: Home, exact: true },
  { to: "/app/stories", label: "Stories", icon: Sparkles, exact: false },
  { to: "/app/guestbook", label: "Livre d'or", icon: BookHeart, exact: false },
] as const;

export function AppTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Sections principales"
      className="scrollbar-hide overflow-x-auto"
    >
      <div className="flex w-full min-w-0 items-center gap-1 rounded-full bg-surface/80 p-1 ring-1 ring-border backdrop-blur sm:w-fit">
        {tabs.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to || pathname === `${to}/` : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={`tap flex flex-1 shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-all active:scale-[0.97] sm:flex-none sm:px-5 ${
                active
                  ? "bg-foreground text-background shadow-card"
                  : "text-muted-foreground hover:bg-primary-light hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
