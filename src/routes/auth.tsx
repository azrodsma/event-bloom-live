import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

type Search = { redirect?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });

  const safeRedirect = redirect && redirect.startsWith("/") ? redirect : "/app";

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: safeRedirect as never, replace: true });
    }
  }, [loading, user, navigate, safeRedirect]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              display_name: `${firstName} ${lastName}`.trim() || email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        toast.success("Compte créé", { description: "Vérifiez vos emails pour confirmer votre adresse." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bienvenue !");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error("Impossible de continuer", { description: message });
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    if (busy) return;
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        const msg = result.error instanceof Error ? result.error.message : String(result.error);
        toast.error("Connexion Google impossible", { description: msg });
      }
      // If redirected: browser will leave. Otherwise session is set → useEffect above navigates.
    } finally {
      setBusy(false);
    }
  }

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
            <button
              onClick={handleGoogle}
              disabled={busy}
              className="flex items-center justify-center gap-3 rounded-full border border-border bg-surface px-4 py-3 text-sm font-medium hover:bg-muted disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.5H12z" /></svg>
              Continuer avec Google
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />ou<div className="h-px flex-1 bg-border" />
          </div>

          <form className="space-y-3" onSubmit={handleEmailSubmit}>
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Prénom" />
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Nom" />
              </div>
            )}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Email" />
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Mot de passe (min. 6 caractères)" />
            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-white shadow-glow disabled:opacity-60"
            >
              {busy ? "…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-medium text-primary hover:underline"
            >
              {mode === "login" ? "Créer un compte" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
