import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Cake, Flame, Sparkles } from "lucide-react";

export const Route = createFileRoute("/events/$slug/cake")({
  component: Cake_,
  head: () => ({
    meta: [
      { title: "Pièce montée & desserts · MaFeliza" },
      { name: "description", content: "Composition du gâteau, allergies et rituel de découpe." },
      { property: "og:title", content: "Pièce montée · MaFeliza" },
      { property: "og:description", content: "Le clou sucré de la soirée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const tiers = [
  { l: "Étage 1 · Vanille bourbon", parts: "40 parts", allergens: "Œufs, gluten" },
  { l: "Étage 2 · Framboise pistache", parts: "30 parts", allergens: "Fruits à coque, œufs" },
  { l: "Étage 3 · Chocolat 70%", parts: "24 parts", allergens: "Soja, lait" },
  { l: "Dôme final · Fruits rouges", parts: "12 parts", allergens: "Sans gluten" },
];

function Cake_() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Pièce montée</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">4 étages · 106 parts · Maison Lenôtre</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Cake className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary/20 to-cream p-6 text-center">
          <p className="text-xs uppercase tracking-widest text-primary">Rituel de découpe</p>
          <h2 className="mt-2 font-display text-3xl">23:45 · Feux d'artifice sucrés</h2>
          <p className="mt-2 text-sm text-muted-foreground">Cierges magiques, entrée sur "La Vie en Rose" (Édith Piaf remix), photographes en position.</p>
        </section>

        <section className="space-y-3">
          {tiers.map((t) => (
            <div key={t.l} className="rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:ring-primary/30">
              <p className="font-medium">{t.l}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>{t.parts}</span>
                <span>Allergènes : {t.allergens}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:ring-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-primary" />
            <p className="font-medium">Alternatives sucrées</p>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Bar à macarons (12 parfums · 240 pièces)</li>
            <li>Fontaine chocolat + brochettes de fruits</li>
            <li>Coin sans gluten & sans lactose signalé</li>
          </ul>
        </section>

        <section className="rounded-2xl bg-gold/10 p-4 flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm">Astuce MaFeliza</p>
            <p className="text-xs text-muted-foreground">Prévoyez 1,2 part par invité. Les enfants comptent 0,5.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
