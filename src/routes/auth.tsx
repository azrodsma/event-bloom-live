import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { sendWelcomeEmail, sendPasswordReset } from "@/lib/auth-emails.functions";

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
  const sendWelcome = useServerFn(sendWelcomeEmail);
  const sendReset = useServerFn(sendPasswordReset);

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
        const displayName = `${firstName} ${lastName}`.trim() || email.split("@")[0];
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName },
          },
        });
        if (error) throw error;
        // Email de bienvenue brandé via Resend (non bloquant)
        sendWelcome({ data: { email, displayName, appUrl: `${window.location.origin}/app` } }).catch(() => {});
        toast.success("Compte créé ✨", { description: "Un email de bienvenue vient de vous être envoyé." });
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


  return (
    <div className="relative grid min-h-screen overflow-x-hidden bg-gradient-mesh md:grid-cols-2">
      <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="relative hidden flex-col justify-between p-10 md:flex">
        <Logo />
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-primary">
            ✦ Depuis 2026
          </span>
          <h2 className="mt-5 font-serif text-6xl leading-[0.95] text-foreground">
            Retrouvez vos<br /><span className="italic text-gradient-primary">plus beaux</span><br />moments.
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            Vos événements, vos proches, vos souvenirs. Dans un espace privé, doux, sans compromis.
          </p>
          <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => <span key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gradient-primary" style={{ opacity: 0.4 + i * 0.15 }} />)}
            </div>
            <span>Rejoint par 12 400+ hôtes</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">© Memento Live</p>
      </div>

      <div className="relative flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md rounded-[36px] bg-surface/80 p-8 shadow-modal ring-1 ring-border backdrop-blur-xl">
          <div className="md:hidden">
            <Logo />
          </div>
          <h1 className="mt-4 font-serif text-4xl leading-tight">
            {mode === "forgot" ? "Mot de passe oublié" : mode === "login" ? "Ravi de vous revoir" : "Créez votre compte"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "forgot"
              ? "Entrez votre email : nous vous envoyons un lien sécurisé pour créer un nouveau mot de passe."
              : mode === "login"
                ? "Connectez-vous pour rejoindre vos événements."
                : "Commencez à créer et partager vos moments."}
          </p>

          {mode === "forgot" ? (
            resetSent ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-primary-light px-4 py-4 text-sm text-foreground">
                  <p className="font-medium">Email envoyé ✨</p>
                  <p className="mt-1 text-muted-foreground">
                    Si un compte existe pour <span className="font-medium text-foreground">{email}</span>, un lien de
                    réinitialisation vient d'être envoyé. Le lien est valable 1 heure.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pensez à vérifier vos spams. Vous pouvez{" "}
                  <button type="button" className="text-primary hover:underline" onClick={() => setResetSent(false)}>
                    renvoyer un lien
                  </button>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => { setMode("login"); setResetSent(false); }}
                  className="inline-flex w-full items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
                >
                  Retour à la connexion
                </button>
              </div>
            ) : (
              <form className="mt-6 space-y-3" onSubmit={handleForgotSubmit}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:bg-surface"
                  placeholder="Votre email"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {busy ? "…" : "Envoyer le lien"}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full text-center text-xs text-muted-foreground hover:text-primary hover:underline"
                >
                  Retour à la connexion
                </button>
              </form>
            )
          ) : (
            <form className="mt-6 space-y-3" onSubmit={handleEmailSubmit}>
              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-3">
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:bg-surface" placeholder="Prénom" />
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:bg-surface" placeholder="Nom" />
                </div>
              )}
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:bg-surface" placeholder="Email" />
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:bg-surface" placeholder="Mot de passe (min. 6 caractères)" />
              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {busy ? "…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
              </button>
            </form>
          )}

          {mode === "login" && (
            <p className="mt-3 text-center text-xs">
              <button
                type="button"
                onClick={() => { setResetSent(false); setMode("forgot"); }}
                className="text-muted-foreground hover:text-primary hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </p>
          )}

          {mode !== "forgot" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-medium text-primary hover:underline"
              >
                {mode === "login" ? "Créer un compte" : "Se connecter"}
              </button>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
