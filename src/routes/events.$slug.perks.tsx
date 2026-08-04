import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Ticket, Copy, Check, Sparkles, Users } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/perks")({
  component: Perks,
  head: () => ({
    meta: [
      { title: "Codes avantages · MaFeliza" },
      { name: "description", content: "Réductions négociées pour vos invités : hôtels, taxis, tenues, coiffure." },
      { property: "og:title", content: "Codes avantages · MaFeliza" },
      { property: "og:description", content: "Des privilèges pour tous vos invités." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Perk = { id: string; partner: string; label: string; discount: string; code: string; expires: string; color: string; emoji: string; used: number };

const perks: Perk[] = [
  { id: "p1", partner: "Hôtel des Vignes", label: "Nuit + petit-déjeuner", discount: "-25%", code: "SARAHTOM25", expires: "26 juil", color: "from-primary to-primary-dark", emoji: "🏨", used: 34 },
  { id: "p2", partner: "Uber", label: "Trajets retour", discount: "15 € offerts", code: "MEMENTO15", expires: "27 juil", color: "from-foreground to-primary-dark", emoji: "🚕", used: 82 },
  { id: "p3", partner: "Sézane", label: "Tenue de cérémonie", discount: "-20%", code: "MARIAGE20", expires: "24 juil", color: "from-gold to-primary", emoji: "👗", used: 12 },
  { id: "p4", partner: "Studio Coiffure", label: "Chignon + maquillage", discount: "-30%", code: "BEAUTY30", expires: "25 juil", color: "from-primary-dark to-gold", emoji: "💇", used: 8 },
];

function Perks() {
  const { slug } = useParams({ from: "/events/$slug/perks" });
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Codes avantages</p>
          <p className="text-xs text-muted-foreground">{perks.length} partenaires · réservés à vos invités</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <Ticket className="h-6 w-6" />
          <p className="mt-3 font-serif text-2xl leading-tight">Des privilèges pour ceux qui vous entourent</p>
          <p className="mt-2 text-sm opacity-90">
            Négociés par MaFeliza, valides uniquement pour votre événement.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs opacity-90">
            <Users className="h-3.5 w-3.5" /> 136 invités ont déjà profité
          </div>
        </section>

        <div className="space-y-3">
          {perks.map((p) => {
            const isCopied = copied === p.code;
            return (
              <article key={p.id} className="overflow-hidden rounded-3xl bg-surface shadow-soft">
                <div className={`bg-gradient-to-br ${p.color} p-4 text-white`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 text-2xl backdrop-blur">
                        {p.emoji}
                      </div>
                      <div>
                        <p className="font-serif text-lg leading-tight">{p.partner}</p>
                        <p className="text-xs opacity-90">{p.label}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-white/25 px-3 py-1 text-sm font-bold backdrop-blur">
                      {p.discount}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <button
                    onClick={() => copy(p.code)}
                    className="flex w-full items-center justify-between rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 p-3 transition hover:bg-primary/10"
                  >
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Code</p>
                      <p className="font-mono text-base font-bold tracking-wider">{p.code}</p>
                    </div>
                    <span className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${isCopied ? "bg-success text-white" : "bg-primary text-white"}`}>
                      {isCopied ? <><Check className="h-3.5 w-3.5" /> Copié</> : <><Copy className="h-3.5 w-3.5" /> Copier</>}
                    </span>
                  </button>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Valide jusqu'au {p.expires}</span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-gold" /> {p.used} invités l'ont utilisé
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
