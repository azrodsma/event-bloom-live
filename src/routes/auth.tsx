import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { useState } from "react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — Memento Live" },
      { name: "description", content: "Connectez-vous ou créez votre compte Memento Live." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  return (
    <div className="grid min-h-screen bg-gradient-warm md:grid-cols-2">
      <div className="hidden flex-col justify-between p-10 md:flex">
        <Logo />
        <div>
          <h2 className="font-serif text-5xl leading-tight text-foreground">
            Retrouvez vos <span className="italic text-primary">plus beaux moments</span>.
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Vos événements, vos proches, vos souvenirs. Le tout, dans un espace privé et sécurisé.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© Memento Live</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md rounded-3xl bg-surface p-8 shadow-modal">
          <div className="md:hidden">
            <Logo />
          </div>
          <h1 className="mt-4 font-serif text-3xl">
            {mode === "login" ? "Ravi de vous revoir" : "Créez votre compte"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Connectez-vous pour rejoindre vos événements." : "Commencez à créer et partager vos moments."}
          </p>

          <div className="mt-6 grid gap-2">
            <button className="flex items-center justify-center gap-3 rounded-full border border-border bg-surface px-4 py-3 text-sm font-medium hover:bg-muted">
              <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.5H12z"/></svg>
              Continuer avec Google
            </button>
            <button className="flex items-center justify-center gap-3 rounded-full border border-border bg-foreground px-4 py-3 text-sm font-medium text-background">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M16.4 12.5c0-2.7 2.2-4 2.3-4-1.3-1.8-3.2-2.1-3.9-2.1-1.7-.2-3.2 1-4.1 1s-2.2-1-3.6-.9c-1.9 0-3.6 1.1-4.6 2.8-2 3.4-.5 8.5 1.4 11.3.9 1.4 2.1 2.9 3.5 2.9 1.4-.1 2-.9 3.7-.9s2.2.9 3.7.9c1.5 0 2.5-1.4 3.5-2.8 1.1-1.6 1.5-3.1 1.5-3.2 0 0-2.9-1.1-3-4z"/></svg>
              Continuer avec Apple
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />ou<div className="h-px flex-1 bg-border" />
          </div>

          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Prénom" />
                <input className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Nom" />
              </div>
            )}
            <input type="email" className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Email" />
            <input type="password" className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Mot de passe" />
            {mode === "login" && (
              <div className="text-right">
                <a href="#" className="text-xs font-medium text-primary hover:underline">Mot de passe oublié ?</a>
              </div>
            )}
            <Link
              to={mode === "signup" ? "/onboarding" : "/app"}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-white shadow-glow"
            >
              {mode === "login" ? "Se connecter" : "Créer mon compte"}
            </Link>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Nouveau ici ? " : "Déjà un compte ? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "login" ? "Créer un compte" : "Se connecter"}
            </button>
          </p>

          <div className="mt-6 rounded-2xl bg-primary-light p-4 text-center">
            <p className="text-xs text-foreground">Vous avez reçu une invitation ?</p>
            <Link to="/join" className="mt-1 inline-block text-sm font-semibold text-primary hover:underline">
              Entrer avec un code →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
