import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Wallet, Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/split-costs")({
  component: SplitCosts,
  head: () => ({
    meta: [
      { title: "Partage des frais · MaFeliza" },
      { name: "description", content: "Répartissez les dépenses entre témoins, familles et amis, sans manipuler d'argent." },
      { property: "og:title", content: "Partage des frais · MaFeliza" },
      { property: "og:description", content: "Une comptabilité juste, entre proches." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Expense = { id: string; label: string; paidBy: string; total: number; split: number };

const people = ["Sarah", "Thomas", "Camille (témoin)", "Léo (témoin)", "Papa Michel", "Maman Odile"];

const expenses: Expense[] = [
  { id: "e1", label: "EVJF week-end", paidBy: "Camille", total: 1240, split: 4 },
  { id: "e2", label: "EVG paintball", paidBy: "Léo", total: 680, split: 5 },
  { id: "e3", label: "Cadeau commun (voyage)", paidBy: "Papa Michel", total: 1500, split: 6 },
  { id: "e4", label: "Répétition dîner", paidBy: "Sarah", total: 420, split: 6 },
];

function SplitCosts() {
  const { slug } = useParams({ from: "/events/$slug/split-costs" });
  const [copied, setCopied] = useState<string | null>(null);
  const totalAll = expenses.reduce((a, e) => a + e.total, 0);

  const copy = (v: string) => {
    navigator.clipboard?.writeText(v);
    setCopied(v);
    setTimeout(() => setCopied(null), 1400);
  };

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Partage des frais</p>
          <p className="text-xs text-muted-foreground">{expenses.length} dépenses · {totalAll.toLocaleString("fr-FR")} €</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <Wallet className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Répartissez, sans manipuler d'argent</p>
          <p className="mt-2 text-sm opacity-90">
            Chacun voit sa part et rembourse via son moyen préféré (Lydia, virement, PayPal).
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs opacity-90">
            <Sparkles className="h-3.5 w-3.5" /> MaFeliza n'encaisse aucun euro.
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dépenses</p>
          <div className="space-y-2">
            {expenses.map((e) => {
              const per = Math.round(e.total / e.split);
              return (
                <article key={e.id} className="rounded-2xl bg-surface p-3.5 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{e.label}</p>
                      <p className="text-xs text-muted-foreground">
                        Avancé par <span className="font-semibold text-foreground">{e.paidBy}</span> · divisé en {e.split}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-lg leading-tight">{e.total} €</p>
                      <p className="text-[11px] text-primary">{per} €/pers.</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => copy(`Lydia · ${e.paidBy} · ${per} €`)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-full bg-cream py-2 text-xs font-semibold"
                    >
                      {copied === `Lydia · ${e.paidBy} · ${per} €` ? (
                        <><Check className="h-3.5 w-3.5 text-success" /> Lien copié</>
                      ) : (
                        <><Copy className="h-3.5 w-3.5" /> Lien Lydia</>
                      )}
                    </button>
                    <button className="flex items-center gap-1 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-white">
                      <ExternalLink className="h-3.5 w-3.5" /> Rembourser
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Solde par personne
          </p>
          <div className="space-y-2">
            {people.map((p, i) => {
              const balance = [230, -120, 340, -180, 250, -520][i] ?? 0;
              const positive = balance >= 0;
              return (
                <div key={p} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-soft">
                  <div className={`grid h-9 w-9 place-items-center rounded-full font-semibold ${positive ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {p[0]}
                  </div>
                  <p className="flex-1 truncate text-sm font-semibold">{p}</p>
                  <span className={`font-serif text-base ${positive ? "text-success" : "text-destructive"}`}>
                    {positive ? "+" : ""}{balance} €
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <button className="w-full rounded-2xl bg-foreground py-3.5 text-sm font-semibold text-background">
          Ajouter une dépense
        </button>
      </main>
    </div>
  );
}
