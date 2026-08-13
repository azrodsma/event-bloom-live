import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Wine, Clock } from "lucide-react";

export const Route = createFileRoute("/events/$slug/cocktail")({
  component: Cocktail,
  head: () => ({
    meta: [
      { title: "Vin d'honneur · MaFeliza" },
      { name: "description", content: "Bouchées signature, ateliers gourmands et animations du cocktail." },
      { property: "og:title", content: "Vin d'honneur · MaFeliza" },
      { property: "og:description", content: "Le moment où la fête décolle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const stations = [
  { l: "Bar signature", d: "3 cocktails maison (Rose Spritz, Elderflower, Sans alcool)", n: "1 barman" },
  { l: "Écailler live", d: "Huîtres de Cancale ouvertes minute · citron fumé", n: "80 huîtres" },
  { l: "Truffe & risotto", d: "Risotto crémeux, râpé de truffe noire", n: "Chef à la vue" },
  { l: "Charcuterie corse", d: "Coppa, lonzu, fromages affinés · pain rustique", n: "Buffet libre" },
  { l: "Sweet corner", d: "Verrines citron-basilic, financiers noisette", n: "12 pièces / invité" },
];

const timing = [
  { h: "18:00", l: "Ouverture du bar · musique acoustique" },
  { h: "18:30", l: "Arrivée des mariés · applaudissements + confettis" },
  { h: "19:00", l: "Ateliers gourmands battent leur plein" },
  { h: "19:45", l: "Photos de groupe organisées par table" },
  { h: "20:00", l: "Invitation à passer à table" },
];

function Cocktail() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Vin d'honneur</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">18h → 20h · 5 stations</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Wine className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-gold/25 to-cream p-6 text-center">
          <Sparkles className="h-6 w-6 text-primary mx-auto" />
          <h2 className="mt-2 font-display text-3xl">Le moment où la fête décolle</h2>
          <p className="mt-2 text-sm text-muted-foreground italic">Terrasse jardin · guitare live · lumière dorée</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Stations gourmandes</h3>
          <div className="space-y-3">
            {stations.map((s) => (
              <div key={s.l} className="rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:ring-primary/30">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{s.l}</p>
                  <span className="text-xs text-muted-foreground">{s.n}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Chronologie</h3>
          <div className="space-y-2">
            {timing.map((t) => (
              <div key={t.h} className="flex gap-3 rounded-xl border border-border/50 bg-card p-3">
                <div className="flex items-center gap-1 text-primary font-medium min-w-[60px]">
                  <Clock className="h-3 w-3" />{t.h}
                </div>
                <p className="text-sm">{t.l}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
