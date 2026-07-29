import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, GlassWater, Sparkles, Beer } from "lucide-react";

export const Route = createFileRoute("/events/$slug/open-bar")({
  component: OpenBar,
  head: () => ({
    meta: [
      { title: "Open bar · Memento Live" },
      { name: "description", content: "Suivez consommations, stock et rotation en direct." },
      { property: "og:title", content: "Open bar · Memento Live" },
      { property: "og:description", content: "Le bar qui ne s'assèche jamais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const drinks = [
  { l: "Champagne Ruinart", stock: 24, served: 68, unit: "bouteilles", pct: 70 },
  { l: "Vin blanc Sancerre", stock: 12, served: 42, unit: "bouteilles", pct: 55 },
  { l: "Vin rouge Chinon", stock: 18, served: 36, unit: "bouteilles", pct: 45 },
  { l: "Bière artisanale Bapbap", stock: 96, served: 124, unit: "canettes", pct: 82 },
  { l: "Cocktail signature « Rosalie »", stock: 45, served: 78, unit: "verres", pct: 90 },
  { l: "Softs & mocktails", stock: 60, served: 148, unit: "verres", pct: 60 },
];

function OpenBar() {
  const { slug } = useParams({ from: "/events/$slug/open-bar" });
  const totalServed = drinks.reduce((s, d) => s + d.served, 0);
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Open bar</p>
          <p className="text-xs text-muted-foreground">Rotation temps réel · 3 barmen</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white shadow-card">
          <GlassWater className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Le bar qui ne s'assèche jamais</p>
          <p className="mt-2 text-sm opacity-90">
            Alerte stock à 30 %, réappro fournisseur automatique, consommation live vs prévision.
          </p>
        </section>

        <section className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-2xl bg-primary/10 p-3">
            <p className="font-serif text-2xl text-primary-dark">{totalServed}</p>
            <p className="text-[10px] text-muted-foreground">verres servis</p>
          </div>
          <div className="rounded-2xl bg-gold/25 p-3">
            <p className="font-serif text-2xl">3,2</p>
            <p className="text-[10px] text-muted-foreground">verres/invité</p>
          </div>
          <div className="rounded-2xl bg-foreground p-3 text-background">
            <p className="font-serif text-2xl">18 min</p>
            <p className="text-[10px] opacity-80">attente moy.</p>
          </div>
        </section>

        <section className="space-y-2">
          {drinks.map((d) => (
            <article key={d.l} className="rounded-2xl bg-surface p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{d.l}</p>
                <span className="text-[11px] text-muted-foreground">{d.served} servis · {d.stock} en stock</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream">
                <div className={`h-full rounded-full ${d.pct > 80 ? "bg-destructive" : d.pct > 60 ? "bg-primary" : "bg-gold"}`}
                     style={{ width: `${d.pct}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">Consommation prévisionnelle · {d.pct}%</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-cream p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">
            <Beer className="h-3.5 w-3.5" /> Éthique d'un bon open bar
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Verres consignés (0 déchet), mocktails aussi soignés que les cocktails, formation barmen à la vigilance (raccompagnement, taxis).
          </p>
          <button className="mt-3 flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
            <Sparkles className="h-3.5 w-3.5" /> Déclencher réappro
          </button>
        </section>
      </main>
    </div>
  );
}
