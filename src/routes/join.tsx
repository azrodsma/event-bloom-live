import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { QrCode, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Rejoindre un événement — Memento Live" },
      { name: "description", content: "Entrez votre code d'invitation pour accéder à un événement privé." },
    ],
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
    <div className="min-h-screen bg-gradient-warm">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-4 py-5 sm:px-6">
        <Link to="/"><Logo /></Link>
        <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Connexion
        </Link>
      </header>
      <main className="mx-auto flex max-w-md flex-col items-center px-4 pt-10 text-center sm:px-6">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-primary text-white shadow-glow">
          <QrCode className="h-9 w-9" />
        </div>
        <h1 className="mt-6 font-serif text-4xl">Vous avez reçu une invitation ?</h1>
        <p className="mt-3 text-muted-foreground">
          Entrez le code d'invitation reçu par vos proches, ou scannez votre QR code.
        </p>
        <form onSubmit={submit} className="mt-8 w-full space-y-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full rounded-2xl border border-border bg-surface px-5 py-4 text-center font-mono text-2xl tracking-[0.4em] outline-none focus:border-primary"
            placeholder="ABC-123"
            maxLength={12}
          />
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-white shadow-glow"
          >
            Rejoindre l'événement <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        <button className="mt-4 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium">
          📷 Scanner un QR code
        </button>
        <p className="mt-8 text-xs text-muted-foreground">
          Astuce : essayez <button onClick={() => setCode("DEMO-001")} className="font-semibold text-primary underline">DEMO-001</button> pour découvrir un événement de démonstration.
        </p>
      </main>
    </div>
  );
}
