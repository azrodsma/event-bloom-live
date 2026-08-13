import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Signature, ScrollText } from "lucide-react";

export const Route = createFileRoute("/events/$slug/contract-hub")({
  component: ContractHub,
  head: () => ({
    meta: [
      { title: "Contrats prestataires · MaFeliza" },
      { name: "description", content: "Tous vos contrats signés, versionnés, sécurisés." },
      { property: "og:title", content: "Contrats · MaFeliza" },
      { property: "og:description", content: "12 contrats, signature électronique DocuSign certifiée eIDAS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const contracts = [
  { v: "Château de Malviès", s: "Signé", d: "14 nov. 2025", a: "24 800 €" },
  { v: "Traiteur Kambo", s: "Signé", d: "02 déc. 2025", a: "18 450 €" },
  { v: "Photographe Léa Ferrand", s: "Signé", d: "18 déc. 2025", a: "3 900 €" },
  { v: "Vidéaste Studio Antan", s: "Signé", d: "18 déc. 2025", a: "2 800 €" },
  { v: "DJ Nova Collectif", s: "Signé", d: "05 janv. 2026", a: "1 650 €" },
  { v: "Fleuriste Rose & Sauge", s: "Signé", d: "22 janv. 2026", a: "4 200 €" },
  { v: "Live band Velvet Session", s: "Signé", d: "12 févr. 2026", a: "3 400 €" },
  { v: "Cabine Retrophoto", s: "En attente", d: "—", a: "890 €" },
  { v: "Wedding planner Blanc & Cie", s: "Signé", d: "10 nov. 2025", a: "5 500 €" },
  { v: "Officiant laïque Camille", s: "Signé", d: "02 févr. 2026", a: "780 €" },
  { v: "Loueur Options", s: "Signé", d: "18 févr. 2026", a: "1 935 €" },
  { v: "Assurance Allianz Prestige", s: "Signé", d: "20 janv. 2026", a: "480 €" },
];

function ContractHub() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Contrats prestataires</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">12 contrats · 68 785 €</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Signature className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-6 text-white">
          <ScrollText className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Signature électronique certifiée eIDAS.</h2>
          <p className="mt-3 text-sm opacity-90">Chaque contrat est horodaté, chiffré et archivé 10 ans chez notre hébergeur qualifié SecNumCloud.</p>
        </section>

        <section className="space-y-2">
          {contracts.map((c) => (
            <div key={c.v} className="rounded-2xl border border-border/50 bg-card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{c.v}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.d}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary">{c.a}</p>
                <p className={`text-[10px] mt-0.5 ${c.s === "Signé" ? "text-green-600" : "text-amber-600"}`}>{c.s}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
