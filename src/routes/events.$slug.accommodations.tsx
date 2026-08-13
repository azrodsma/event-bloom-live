import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Hotel, Star, MapPin } from "lucide-react";

export const Route = createFileRoute("/events/$slug/accommodations")({
  component: Accommodations,
  head: () => ({
    meta: [
      { title: "Hébergements invités · MaFeliza" },
      { name: "description", content: "Sélection d'hébergements proches, tarifs négociés et disponibilités." },
      { property: "og:title", content: "Hébergements · MaFeliza" },
      { property: "og:description", content: "Chaque invité dort bien, à deux pas de la fête." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const hotels = [
  { l: "Château de Villette · Suites", d: "5 min à pied", price: "280 €", available: "3 / 8", rating: 5, tag: "Premium" },
  { l: "Domaine des Cèdres", d: "8 min voiture", price: "165 €", available: "12 / 20", rating: 4, tag: "Coup de cœur" },
  { l: "Hôtel Ibis Styles Beaune", d: "12 min voiture", price: "89 €", available: "28 / 40", rating: 3, tag: "Économique" },
  { l: "Gîte Les Tournesols", d: "6 min voiture", price: "45 € / lit", available: "18 / 24", rating: 4, tag: "Famille" },
  { l: "Camping glamour · Lodges", d: "10 min voiture", price: "120 €", available: "6 / 10", rating: 4, tag: "Insolite" },
];

function Accommodations() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Hébergements</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">5 options · tarifs négociés</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Hotel className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary/15 to-cream p-6">
          <p className="text-xs uppercase tracking-widest text-primary">Code réduction</p>
          <h2 className="mt-2 font-display text-2xl">LEATHOMAS2026 · jusqu'à -20%</h2>
          <p className="mt-2 text-sm text-muted-foreground">Valable sur toutes les options ci-dessous, réservations directes.</p>
        </section>

        <section className="space-y-3">
          {hotels.map((h) => (
            <div key={h.l} className="rounded-2xl border border-border/50 bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{h.l}</p>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{h.tag}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{h.d}</span>
                    <span className="flex items-center gap-1">
                      {Array.from({ length: h.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-gold text-gold" />)}
                    </span>
                    <span>Disponibilité : {h.available}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg">{h.price}</p>
                  <p className="text-xs text-muted-foreground">/ nuit</p>
                </div>
              </div>
              <button className="mt-3 w-full rounded-full bg-primary/10 py-2 text-sm text-primary">Voir & réserver</button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
