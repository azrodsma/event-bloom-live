import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { StatusPage, statusActionClasses } from "@/components/StatusPage";


function NotFoundComponent() {
  return (
    <StatusPage
      code="404"
      title="Page introuvable"
      description="Cette page n'existe pas, a été déplacée, ou l'événement n'est plus accessible."
      actions={
        <>
          <Link to="/" className={statusActionClasses.primary}>
            Retour à l'accueil
          </Link>
          <Link to="/app" className={statusActionClasses.secondary}>
            Mes événements
          </Link>
        </>
      }
    />
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <StatusPage
      code="500"
      title="Cette page n'a pas pu se charger"
      description="Une erreur est survenue de notre côté. Réessayez dans un instant ou revenez à l'accueil."
      actions={
        <>
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className={statusActionClasses.primary}
          >
            Réessayer
          </button>
          <a href="/" className={statusActionClasses.secondary}>
            Accueil
          </a>
        </>
      }
    />
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MaFeliza — Le réseau social privé de vos plus beaux événements" },
      {
        name: "description",
        content:
          "Créez une page pour vos événements privés, partagez votre live, recevez des messages, cagnotte externe et livre d'or multimédia.",
      },
      { property: "og:title", content: "MaFeliza" },
      {
        property: "og:description",
        content: "Vos événements, en direct, en souvenirs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthEffects />
        <RouteGuard />
        <Outlet />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Refetch queries + navigate on identity transitions.
function AuthEffects() {
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);
  return null;
}


// Client-side gate: redirect /app/* and /events/* to /auth when not signed in.
function RouteGuard() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isProtected = pathname.startsWith("/app") || pathname.startsWith("/events/");
  useEffect(() => {
    if (loading) return;
    if (isProtected && !user && !window.location.search.includes("qa=1")) {
      navigate({ to: "/auth", search: { redirect: pathname } as never, replace: true });
    }
  }, [loading, user, isProtected, pathname, navigate]);
  return null;
}

