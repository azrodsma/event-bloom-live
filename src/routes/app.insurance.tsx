import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield, FileCheck } from "lucide-react";

export const Route = createFileRoute("/app/insurance")({
  component: Insurance,
  head: () => ({
    meta: [
      { title: "Assurance annulation · MaFeliza" },
      { name: "description", content: "Assurance annulation événement · remboursement jusqu'à 100%." },
      { property: "og:title", content: "Assurance annulation · MaFeliza" },
      { property: "og:description", content: "Un jour J qui ne peut pas être décalé. Une garantie qui l'anticipe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const covered = [
  { l: "Hospitalisation ou décès (mariés, ascendants directs, témoins)", limit: "100% jusqu'à 80 000 €" },
  { l: "Force majeure météo extrême (arrêté préfectoral)", limit: "100% jusqu'à 80 000 €" },
  { l: "Défaillance prestataire majeur (traiteur, lieu)", limit: "100% jusqu'à 40 000 €" },
  { l: "Perte d'emploi involontaire", limit: "70% jusqu'à 40 000 €" },
  { l: "Vol / dégradation robe & alliances", limit: "5 000 € · sans franchise" },
  { l: "Responsabilité civile organisateur", limit: "3 000 000 €" },
];

const plans = [
  { l: "Essentiel", price: "129 €", cov: "Jusqu'à 20 000 €", best: false },
  { l: "Signature", price: "249 €", cov: "Jusqu'à 50 000 €", best: true },
  { l: "Prestige", price: "489 €", cov: "Jusqu'à 100 000 €", best: false },
];

function Insurance() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/app" className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Assurance annulation</h1>
            <p className="text-xs text-muted-foreground">Opéré par Allianz Événements · agrément ORIAS 12 097 483</p>
          </div>
          <Shield className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-6 text-white">
          <h2 className="font-display text-3xl leading-tight">Un jour J ne se décale pas. On l'assure.</h2>
          <p className="mt-3 text-sm opacity-90">Souscription en 4 minutes · effet immédiat · résiliation sous 14 jours sans frais.</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Formules</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {plans.map((p) => (
              <div key={p.l} className={`rounded-2xl border p-5 ${p.best ? "border-primary bg-primary/5" : "border-border/50 bg-card"}`}>
                {p.best && <span className="text-[10px] font-medium text-primary uppercase tracking-widest">Recommandé</span>}
                <p className="font-display text-xl mt-1">{p.l}</p>
                <p className="mt-2 font-display text-3xl">{p.price}</p>
                <p className="text-xs text-muted-foreground">{p.cov}</p>
                <button className={`mt-4 w-full rounded-full py-2 text-xs font-medium ${p.best ? "bg-primary text-white" : "bg-cream text-foreground"}`}>Souscrire</button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3 flex items-center gap-2"><FileCheck className="h-4 w-4 text-primary" />Ce qui est couvert</h3>
          <div className="space-y-2">
            {covered.map((c) => (
              <div key={c.l} className="rounded-2xl border border-border/50 bg-card p-4 flex items-start justify-between gap-3">
                <p className="text-sm flex-1">{c.l}</p>
                <span className="text-xs text-primary shrink-0">{c.limit}</span>
              </div>
            ))}
          </div>
        </section>

        <p className="text-[10px] text-center text-muted-foreground italic">Document non contractuel. Consultez les CG avant souscription. Délai de carence 48h.</p>
      </main>
    </div>
  );
}
