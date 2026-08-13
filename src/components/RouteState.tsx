import { Link } from "@tanstack/react-router";
import { Sparkles, AlertTriangle } from "lucide-react";

type RouteStateProps = {
  title: string;
  description?: string;
  variant?: "empty" | "error";
  actionLabel?: string;
  actionTo?: string;
};

/** Carte premium partagée pour les états « introuvable » et « erreur » des routes événement. */
export function RouteState({
  title,
  description,
  variant = "empty",
  actionLabel = "Voir les événements",
  actionTo = "/events",
}: RouteStateProps) {
  const Icon = variant === "error" ? AlertTriangle : Sparkles;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[32px] bg-surface/85 p-8 text-center shadow-modal ring-1 ring-border backdrop-blur-xl">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/20 text-primary">
          <Icon className="size-6" />
        </span>
        <h1 className="mt-5 font-serif text-2xl text-foreground">{title}</h1>
        <div className="rule-gold mx-auto my-4 w-16" />
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
        <Link
          to={actionTo}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-card transition hover:opacity-90"
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}

export const eventNotFoundComponent = () => (
  <RouteState
    title="Événement introuvable"
    description="Ce lien n'existe plus ou l'événement est devenu privé. Explorez les autres célébrations en cours."
  />
);

export const eventErrorComponent = ({ error }: { error: Error }) => (
  <RouteState
    variant="error"
    title="Une erreur est survenue"
    description={error.message || "Merci de réessayer dans un instant."}
  />
);
