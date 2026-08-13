import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Flower2, Truck } from "lucide-react";

export const Route = createFileRoute("/events/$slug/centerpieces")({
  component: Centerpieces,
  head: () => ({
    meta: [
      { title: "Centres de table · MaFeliza" },
      { name: "description", content: "Design floral des centres de table, table par table." },
      { property: "og:title", content: "Centres de table · MaFeliza" },
      { property: "og:description", content: "18 tables, 18 respirations florales." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const styles = [
  { l: "Table d'honneur", desc: "Chemin de table 4m · pivoines corail, roses David Austin, eucalyptus", h: "35 cm max" },
  { l: "Tables invités (16)", desc: "Coupelles basses · roses, lisianthus, gypsophile, feuillage vert amande", h: "22 cm max" },
  { l: "Table enfants", desc: "Petits vases individuels · marguerites et fleurs à cueillir en fin de soirée", h: "15 cm" },
];

const detail = [
  { n: "Table 1 · Honneur", flowers: "Pivoines · Roses David Austin · Ranoncules", bud: "180 €" },
  { n: "Table 2-9 · Famille", flowers: "Roses champagne · Lisianthus · Gypsophile", bud: "65 €/table" },
  { n: "Table 10-16 · Amis", flowers: "Roses poudrées · Lysianthus · Astilbes", bud: "65 €/table" },
  { n: "Table 17 · Enfants", flowers: "Marguerites · Muflier · Craspédia", bud: "40 €" },
  { n: "Table 18 · Cadeaux", flowers: "Composition basse · roses rétro", bud: "55 €" },
];

function Centerpieces() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Centres de table</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Fleuriste · Rose & Sauge Fleurs · Bordeaux</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Flower2 className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-primary/10 p-6">
          <h2 className="font-display text-3xl leading-tight">Bas et généreux. Jamais entre deux regards.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Hauteur limitée pour ne jamais couper la conversation. Livraison à 14h30, montage 15h-17h.</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Trois styles</h3>
          <div className="space-y-3">
            {styles.map((s) => (
              <div key={s.l} className="rounded-[26px] bg-surface p-5 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/30">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-lg">{s.l}</p>
                  <span className="text-xs text-primary">{s.h}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Détail par table</h3>
          <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/50">
            {detail.map((d) => (
              <div key={d.n} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-sm">{d.n}</p>
                  <span className="text-xs text-primary">{d.bud}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{d.flowers}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-2xl bg-cream p-5 flex items-start gap-3">
          <Truck className="h-4 w-4 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Livraison</p>
            <p className="text-xs text-muted-foreground">Camion frigo · 14h30 · installation par équipe de 3 · retrait 2h du matin (fleurs offertes aux invités).</p>
          </div>
        </div>
      </main>
    </div>
  );
}
