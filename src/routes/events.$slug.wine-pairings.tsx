import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Wine, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/events/$slug/wine-pairings")({
  component: WinePairings,
  head: () => ({
    meta: [
      { title: "Accords mets & vins · MaFeliza" },
      { name: "description", content: "Une carte des vins pensée plat par plat." },
      { property: "og:title", content: "Accords mets & vins · MaFeliza" },
      { property: "og:description", content: "L'art de sublimer chaque bouchée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const pairings = [
  { plat: "Amuse-bouches", vin: "Champagne Blanc de Blancs", region: "Côte des Blancs", cepage: "Chardonnay", bouteilles: 18, temp: "8°C" },
  { plat: "Entrée · Tartare de daurade", vin: "Sancerre 2022", region: "Loire", cepage: "Sauvignon blanc", bouteilles: 12, temp: "10°C" },
  { plat: "Plat · Agneau confit", vin: "Châteauneuf-du-Pape 2019", region: "Rhône", cepage: "Grenache · Syrah", bouteilles: 24, temp: "16°C" },
  { plat: "Fromages · sélection AOP", vin: "Jurançon moelleux", region: "Sud-Ouest", cepage: "Petit Manseng", bouteilles: 6, temp: "9°C" },
  { plat: "Dessert · Pièce montée", vin: "Champagne Rosé", region: "Montagne de Reims", cepage: "Pinot noir", bouteilles: 14, temp: "8°C" },
];

function WinePairings() {
  const { slug } = useParams({ from: "/events/$slug/wine-pairings" });
  const total = pairings.reduce((a, p) => a + p.bouteilles, 0);
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Mets & vins</p>
          <p className="text-xs text-muted-foreground">{total} bouteilles prévues · 5 accords</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary-dark via-foreground to-primary p-6 text-white shadow-card">
          <Wine className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">L'art de sublimer chaque bouchée</p>
          <p className="mt-2 text-sm opacity-90">Sommelier certifié — recommandations générées avec Château Larivière.</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl bg-white/15 p-2 text-center">
              <p className="font-serif text-xl">{total}</p>
              <p className="opacity-80">bouteilles</p>
            </div>
            <div className="rounded-xl bg-white/15 p-2 text-center">
              <p className="font-serif text-xl">142</p>
              <p className="opacity-80">convives</p>
            </div>
            <div className="rounded-xl bg-white/15 p-2 text-center">
              <p className="font-serif text-xl">1 296</p>
              <p className="opacity-80">€ TTC</p>
            </div>
          </div>
        </section>

        <div className="space-y-3">
          {pairings.map((p) => (
            <article key={p.plat} className="rounded-2xl bg-surface p-4 shadow-soft">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary-dark">{p.plat}</p>
              <p className="mt-1 font-serif text-xl leading-tight">{p.vin}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.region} · {p.cepage}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {p.bouteilles} bouteilles</span>
                <span>· service {p.temp}</span>
              </div>
            </article>
          ))}
        </div>

        <section className="rounded-3xl bg-cream p-5 shadow-soft">
          <Sparkles className="h-5 w-5 text-primary-dark" />
          <p className="mt-2 font-serif text-lg leading-tight">Option sans alcool</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Chaque accord propose un pendant en jus fermenté artisanal — kombucha de shiso, verjus de pêche, thé glacé bergamote.
          </p>
        </section>
      </main>
    </div>
  );
}
