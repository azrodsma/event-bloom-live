import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({
    meta: [
      { title: "Nouveau mot de passe — Memento Live" },
      { name: "description", content: "Choisissez un nouveau mot de passe pour votre compte Memento Live." },
          { name: "robots", content: "noindex" },
],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function resolveSession() {
      const url = new URL(window.location.href);
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));

      // 1) Lien PKCE : ?code=...
      const code = url.searchParams.get("code");
      // 2) Lien OTP : ?token_hash=...&type=recovery
      const tokenHash = url.searchParams.get("token_hash");
      // 3) Lien implicite : #access_token=...&refresh_token=...
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const errorDescription = url.searchParams.get("error_description") || hash.get("error_description");

      try {
        if (errorDescription) throw new Error(errorDescription);
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (tokenHash) {
          const { error } = await supabase.auth.verifyOtp({ type: "recovery", token_hash: tokenHash });
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (error) throw error;
        }
      } catch {
        // on retombe sur la vérification de session ci-dessous
      }

      // Nettoyage de l'URL (on ne laisse pas traîner les tokens)
      window.history.replaceState({}, "", "/auth/reset-password");

      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setStatus(data.session ? "ready" : "invalid");
    }

    void resolveSession();

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setStatus("ready");
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { toast.error("Les mots de passe ne correspondent pas"); return; }
    if (password.length < 6) { toast.error("6 caractères minimum"); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Mot de passe mis à jour ✨");
      navigate({ to: "/app" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-warm p-6">
      <div className="w-full max-w-md rounded-3xl bg-surface p-8 shadow-modal">
        <Logo />
        <h1 className="mt-4 font-serif text-3xl">Nouveau mot de passe</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {status === "ready"
            ? "Choisissez un nouveau mot de passe pour votre compte."
            : status === "checking"
              ? "Vérification de votre lien…"
              : "Ce lien est invalide ou expiré."}
        </p>

        {status === "ready" ? (
          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirmez le mot de passe"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-white shadow-glow disabled:opacity-60"
            >
              {busy ? "…" : "Mettre à jour"}
            </button>
          </form>
        ) : status === "checking" ? (
          <div className="mt-6 space-y-2">
            <div className="h-12 w-full animate-pulse rounded-2xl bg-primary-light" />
            <div className="h-12 w-full animate-pulse rounded-2xl bg-primary-light" />
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              Les liens de réinitialisation sont valables 1 heure et à usage unique. Demandez-en un nouveau pour
              continuer.
            </p>
            <a
              href="/auth"
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-white shadow-glow"
            >
              Redemander un lien
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
