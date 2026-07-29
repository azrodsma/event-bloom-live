import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type StatusPageProps = {
  code: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function StatusPage({ code, title, description, actions }: StatusPageProps) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-5 py-16">
      {/* décor */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-gold/20 blur-3xl"
      />

      <section className="relative w-full max-w-lg rounded-3xl border border-border/60 bg-card/70 p-8 text-center shadow-xl backdrop-blur-xl sm:p-12">
        <p className="font-serif text-6xl leading-none text-primary sm:text-7xl">{code}</p>
        <h1 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
          {actions ?? (
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              Retour à l'accueil
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}

export const statusActionClasses = {
  primary:
    "inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark",
  secondary:
    "inline-flex items-center justify-center rounded-full border border-input bg-background px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent",
};
