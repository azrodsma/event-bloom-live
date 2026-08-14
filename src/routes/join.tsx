import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { QrCode, ArrowRight, Camera, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Rejoindre un événement — MaFeliza" },
      { name: "description", content: "Entrez votre code d'invitation pour accéder à un événement privé." },
          { property: "og:title", content: "Rejoindre un événement — MaFeliza" },
      { property: "og:description", content: "Entrez votre code d'invitation." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://event.bold-lab-agency.com/join" },
],
    links: [{ rel: "canonical", href: "https://event.bold-lab-agency.com/join" }],
  }),
  component: JoinPage,
});

function JoinPage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/events/$slug", params: { slug: "sarah-thomas" } });
  };
  return (
    <div className="flex min-h-dvh flex-col bg-gradient-warm">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 safe-top sm:px-6 sm:py-5">
        <Link to="/"><Logo /></Link>
        <Link
          to="/auth"
          className="rounded-full bg-surface/80 px-4 py-2 text-sm font-semibold text-foreground ring-1 ring-border/70 backdrop-blur transition-colors hover:text-primary"
        >
          Connexion
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-12 pt-2 sm:max-w-lg sm:px-6">
        <div className="rounded-[2rem] border border-border/70 bg-surface/85 p-6 text-center shadow-elegant backdrop-blur sm:p-9">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow sm:h-20 sm:w-20 sm:rounded-3xl">
            <QrCode className="h-8 w-8 sm:h-9 sm:w-9" />
          </div>
          <h1 className="mt-5 font-serif text-[1.75rem] leading-tight sm:text-[2.35rem]">
            Vous avez reçu une invitation ?
          </h1>
          <div className="rule-gold mx-auto mt-4 w-16" />
          <p className="mt-3 text-sm text-muted-foreground">
            Entrez le code d'invitation reçu par vos proches, ou scannez votre QR code.
          </p>

          <form onSubmit={submit} className="mt-6 w-full space-y-3">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-center font-mono text-xl tracking-[0.35em] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 sm:text-2xl"
              placeholder="ABC-123"
              maxLength={12}
              inputMode="text"
              autoCapitalize="characters"
            />
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition active:scale-[0.98]"
            >
              Rejoindre l'événement <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3.5 text-sm font-medium transition active:scale-[0.98]">
              <Camera className="h-4 w-4 text-primary" /> Scanner un QR code
            </button>
          </form>
          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-primary-light/60 px-4 py-3 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            <span>Accès privé : seuls les invités munis d'un code entrent.</span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Astuce : essayez{" "}
            <button type="button" onClick={() => setCode("DEMO-001")} className="font-semibold text-primary underline">DEMO-001</button>{" "}
            pour découvrir un événement de démonstration.
          </p>
        </div>
      </main>
    </div>
  );
}
