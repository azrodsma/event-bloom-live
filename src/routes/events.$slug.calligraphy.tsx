import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Feather, Package } from "lucide-react";

export const Route = createFileRoute("/events/$slug/calligraphy")({
  component: Calligraphy,
  head: () => ({
    meta: [
      { title: "Calligraphie · MaFeliza" },
      { name: "description", content: "Marque-places, menus et enveloppes calligraphiés à la main." },
      { property: "og:title", content: "Calligraphie · MaFeliza" },
      { property: "og:description", content: "Chaque prénom tracé à la plume, jamais imprimé." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const items = [
  { l: "Enveloppes faire-part", qty: 148, style: "Copperplate encre sépia", eta: "Livré" },
  { l: "Marque-places", qty: 148, style: "Italienne moderne encre or", eta: "En cours (72%)" },
  { l: "Menus individuels", qty: 148, style: "Copperplate encre sépia", eta: "À démarrer 3 juin" },
  { l: "Plan de table calligraphié", qty: 1, style: "Miroir vintage 80x120 cm", eta: "En cours" },
  { l: "Panneaux directionnels", qty: 6, style: "Ardoises bois flotté", eta: "Livré" },
  { l: "Livret cérémonie couverture", qty: 148, style: "Prénoms des mariés en frontispice", eta: "À démarrer" },
];

function Calligraphy() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Calligraphie</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Atelier Plume & Encre · Marseille</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Feather className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-primary/10 p-6">
          <p className="text-xs uppercase tracking-widest text-primary">Le détail qui fait la différence</p>
          <h2 className="mt-2 font-display text-3xl leading-tight">Chaque prénom, tracé à la main.</h2>
          <p className="mt-3 text-sm text-muted-foreground">Papier Fabriano Medioevalis 120g · encres Higgins Eternal · plumes Nikko G. Une calligraphe unique pour toute la commande.</p>
        </section>

        <section className="space-y-3">
          {items.map((i) => (
            <div key={i.l} className="rounded-2xl border border-border/50 bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium">{i.l}</p>
                  <p className="text-xs text-muted-foreground">{i.style}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg">{i.qty}</p>
                  <p className="text-xs text-primary">{i.eta}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-cream p-5 flex items-start gap-3">
          <Package className="h-4 w-4 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Prochaine livraison</p>
            <p className="text-xs text-muted-foreground">Mercredi 3 juin · Chronopost signature · assurance 400 €.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
