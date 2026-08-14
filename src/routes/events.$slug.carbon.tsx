import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Trees, Recycle, Leaf } from "lucide-react";

export const Route = createFileRoute("/events/$slug/carbon")({
  component: Carbon,
  head: () => ({
    meta: [
      { title: "Bilan carbone · MaFeliza" },
      { name: "description", content: "Mesurez, réduisez et compensez l'empreinte du grand jour." },
      { property: "og:title", content: "Bilan carbone · MaFeliza" },
      { property: "og:description", content: "Un événement à la mesure de vos valeurs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const posts = [
  { l: "Transports invités", kg: 1240, pct: 42, tip: "Covoiturage activé · navettes gare" },
  { l: "Repas & boissons", kg: 780, pct: 26, tip: "80 % local, végétarien majoritaire" },
  { l: "Fleurs & décor", kg: 220, pct: 8, tip: "Fleurs de saison, location décor" },
  { l: "Hébergement invités", kg: 480, pct: 16, tip: "Hébergeurs locaux privilégiés" },
  { l: "Papeterie & goodies", kg: 90, pct: 3, tip: "Papier recyclé, encre végétale" },
  { l: "Énergie salle", kg: 150, pct: 5, tip: "Électricité verte fournisseur" },
];

const projects = [
  { l: "Reforestation Cévennes", price: 12, kg: 1, unit: "arbre · 1 t CO₂" },
  { l: "Cuisinières solaires Sénégal", price: 40, kg: 3, unit: "famille · 3 t CO₂" },
  { l: "Mangrove Madagascar", price: 25, kg: 2, unit: "hectare · 2 t CO₂" },
];

function Carbon() {
  const { slug } = useParams({ from: "/events/$slug/carbon" });
  const total = posts.reduce((s, p) => s + p.kg, 0);
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Bilan carbone</p>
          <p className="text-xs text-muted-foreground">Empreinte calculée en direct</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-foreground via-primary-dark to-primary p-6 text-white shadow-card">
          <Leaf className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">À la mesure de vos valeurs</p>
          <p className="mt-2 text-sm opacity-90">
            Bilan calculé selon la méthode ADEME · comparé à un mariage moyen français (5,3 t CO₂).
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <p className="font-serif text-5xl">{(total / 1000).toFixed(2)}</p>
            <span className="text-sm opacity-80">t CO₂ · -46 % vs moyenne</span>
          </div>
        </section>

        <section className="space-y-2">
          {posts.map((p) => (
            <article key={p.l} className="rounded-2xl bg-surface p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{p.l}</p>
                <span className="font-serif text-lg text-primary-dark">{p.kg} kg</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream">
                <div className="h-full rounded-full bg-primary" style={{ width: `${p.pct}%` }} />
              </div>
              <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                <Recycle className="h-3 w-3" /> {p.tip}
              </p>
            </article>
          ))}
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Trees className="h-3.5 w-3.5" /> Compenser via un projet certifié
          </p>
          <div className="space-y-2">
            {projects.map((pr) => (
              <article key={pr.l} className="flex items-center justify-between rounded-2xl bg-cream p-4 shadow-soft">
                <div>
                  <p className="text-sm font-semibold">{pr.l}</p>
                  <p className="text-[11px] text-muted-foreground">{pr.unit}</p>
                </div>
                <button className="rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
                  {pr.price} €
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
