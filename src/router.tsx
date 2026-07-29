import { QueryClient } from "@tanstack/react-query";
import { createRouter, Link, useRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { StatusPage, statusActionClasses } from "@/components/StatusPage";

function DefaultNotFound() {
  return (
    <StatusPage
      code="404"
      title="Page introuvable"
      description="Cette page n'existe pas ou n'est plus accessible."
      actions={
        <Link to="/" className={statusActionClasses.primary}>
          Retour à l'accueil
        </Link>
      }
    />
  );
}

function DefaultError({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <StatusPage
      code="500"
      title="Une erreur est survenue"
      description="Ce contenu n'a pas pu être chargé. Réessayez ou revenez à l'accueil."
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

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: DefaultNotFound,
    defaultErrorComponent: DefaultError,
  });

  return router;
};
