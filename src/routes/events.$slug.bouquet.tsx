import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Flower2, Sparkles, Ribbon } from "lucide-react";

export const Route = createFileRoute("/events/$slug/bouquet")({
  component: Bouquet,
  head: () => ({
    meta: [
      { title: "Bouquet · MaFeliza" },
      { name: "description", content: "Composez le bouquet parfait, tige par tige." },
      { property: "og:title", content: "Bouquet · MaFeliza" },
      { property: "og:description", content: "Le bouquet raconte votre histoire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const flowers = [
  { name: "Pivoine Sarah Bernhardt", origin: "Anjou · locale", season: "mai-juin", price: 6.5, qty: 12, color: "bg-primary/25" },
  { name: "Renoncule Clooney", origin: "Côte d'Azur", season: "février-mai", price: 4.2, qty: 8, color: "bg-primary-dark/20" },
  { name: "Rose David Austin", origin: "Grasse", season: "avril-octobre", price: 5.8, qty: 6, color: "bg-primary/15" },
  { name: "Eucalyptus parvifolia", origin: "Provence", season: "toute l'année", price: 2.4, qty: 15, color: "bg-gold/25" },
  { name: "Lisianthus double crème", origin: "Loire · locale", season: "mai-septembre", price: 3.9, qty: 10, color: "bg-cream" },
];

const arrangements = [
  { l: "Bouquet de la mariée", size: "Ø 32 cm", price: 240, note: "Cascade légère, ruban soie" },
  { l: "Bouquets demoiselles", size: "×4 · Ø 22 cm", price: 60, note: "Version compacte assortie" },
  { l: "Boutonnières", size: "×6", price: 12, note: "Ruban raphia crème" },
  { l: "Couronne enfants", size: "×3 · Ø 16 cm", price: 45, note: "Fleurs séchées + fraîches" },
];

function Bouquet() {
  const { slug } = useParams({ from: "/events/$slug/bouquet" });
  const total = arrangements.reduce((s, a) => s + a.price, 0);

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Bouquet & compositions</p>
          <p className="text-xs text-muted-foreground">Fleuriste · Camille Roux</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary/20 via-cream to-gold/25 p-6 shadow-card">
          <Flower2 className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Le bouquet raconte votre histoire</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Fleurs locales et de saison, cultivées à moins de 300 km. Livraison au petit matin pour la fraîcheur maximale.
          </p>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tiges sélectionnées</p>
          <div className="space-y-2">
            {flowers.map((f) => (
              <article key={f.name} className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-soft">
                <div className={`grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl ${f.color}`}>
                  <Flower2 className="h-5 w-5 text-primary-dark" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{f.name}</p>
                  <p className="text-[11px] text-muted-foreground">{f.origin} · {f.season}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-lg text-primary-dark">×{f.qty}</p>
                  <p className="text-[10px] text-muted-foreground">{f.price.toFixed(2)} € / tige</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Ribbon className="h-3.5 w-3.5" /> Compositions
          </p>
          <div className="space-y-2">
            {arrangements.map((a) => (
              <article key={a.l} className="flex items-center justify-between rounded-2xl bg-cream p-4 shadow-soft">
                <div>
                  <p className="text-sm font-semibold">{a.l}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{a.size} · {a.note}</p>
                </div>
                <span className="font-serif text-xl text-primary-dark">{a.price} €</span>
              </article>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-between rounded-3xl bg-foreground p-5 text-background shadow-card">
          <div>
            <div className="flex items-center gap-2 text-xs opacity-80"><Sparkles className="h-3.5 w-3.5" /> Devis fleurs</div>
            <p className="mt-1 font-serif text-3xl">{total} €</p>
            <p className="text-[11px] opacity-70">Livraison incluse · installation salle offerte</p>
          </div>
          <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold">Valider</button>
        </section>
      </main>
    </div>
  );
}
