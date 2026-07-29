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
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase place les tokens en fragment (#access_token=...) après clic sur le lien recovery.
    // Le client détecte la session automatiquement (detectSessionInUrl).
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    return () => sub.subscription.unsubscribe();
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
          {ready ? "Choisissez un nouveau mot de passe pour votre compte." : "Vérification de votre lien…"}
        </p>

        {ready ? (
          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              minLength={6}
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
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Si rien ne se passe, votre lien est peut-être expiré. <a href="/auth" className="text-primary hover:underline">Redemander un lien</a>.
          </p>
        )}
      </div>
    </div>
  );
}
