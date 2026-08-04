import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Wine, Grape } from "lucide-react";

export const Route = createFileRoute("/events/$slug/cellar")({
  component: Cellar,
  head: () => ({
    meta: [
      { title: "Cave · MaFeliza" },
      { name: "description", content: "Sélection des vins servis, quantités et températures de service." },
      { property: "og:title", content: "Cave · MaFeliza" },
      { property: "og:description", content: "Cave livrée, cave dégustée, cave partagée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const wines = [
  { l: "Champagne Billecart-Salmon Brut Rosé", vin: "NV", moment: "Cocktail & toast", bt: 42, temp: "8-10°C" },
  { l: "Sancerre Blanc · Henri Bourgeois", vin: "2022", moment: "Entrée · daurade", bt: 18, temp: "10-12°C" },
  { l: "Pauillac · Château Lynch-Bages", vin: "2015", moment: "Plat · bœuf", bt: 30, temp: "16-18°C" },
  { l: "Sauternes · Château Rieussec", vin: "2018", moment: "Pièce montée", bt: 12, temp: "8-10°C" },
  { l: "Bourgogne rouge · Volnay 1er Cru", vin: "2019", moment: "Table d'honneur", bt: 6, temp: "15-17°C" },
  { l: "Kombucha maison bio", vin: "—", moment: "Alternative sans alcool", bt: 24, temp: "6-8°C" },
];

function Cellar() {
  const total = wines.reduce((a, w) => a + w.bt, 0);
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Cave du jour J</h1>
            <p className="text-xs text-muted-foreground">Sommelier : Antoine Deschamps</p>
          </div>
          <Wine className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-6 text-white">
          <Grape className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">6 cuvées, une histoire.</h2>
          <p className="mt-3 text-sm opacity-90">Chaque bouteille choisie avec Antoine, sommelier meilleur ouvrier de France 2023. Chambrées 24h avant, décantées 90 min avant service.</p>
          <div className="mt-5 grid grid-cols-3 gap-4 text-center">
            <div><p className="font-display text-2xl">{total}</p><p className="text-[10px] opacity-70">bouteilles</p></div>
            <div><p className="font-display text-2xl">4 620 €</p><p className="text-[10px] opacity-70">budget cave</p></div>
            <div><p className="font-display text-2xl">31 €</p><p className="text-[10px] opacity-70">/ personne</p></div>
          </div>
        </section>

        <section className="space-y-3">
          {wines.map((w) => (
            <div key={w.l} className="rounded-2xl border border-border/50 bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium">{w.l}</p>
                  <p className="text-xs text-primary">{w.vin} · {w.moment}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg">{w.bt}</p>
                  <p className="text-[10px] text-muted-foreground">bouteilles</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Service à {w.temp}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
