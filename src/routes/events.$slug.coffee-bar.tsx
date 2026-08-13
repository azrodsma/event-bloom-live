import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Coffee, Clock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/events/$slug/coffee-bar")({
  component: CoffeeBar,
  head: () => ({
    meta: [
      { title: "Bar à café · MaFeliza" },
      { name: "description", content: "Bar à café artisanal pour le lendemain et les fins de nuit." },
      { property: "og:title", content: "Bar à café · MaFeliza" },
      { property: "og:description", content: "Un café qui remet du monde." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const drinks = [
  { l: "Espresso signature", o: "Origine Éthiopie Sidamo · torréfaction Belleville" },
  { l: "Cappuccino latte-art", o: "Rosetta sur demande · lait bio de la ferme voisine" },
  { l: "Matcha latte", o: "Matcha cérémonie Uji · alternative lait avoine" },
  { l: "Chocolat chaud Valrhona", o: "70% cacao · chantilly maison · guimauves" },
  { l: "Thé glacé infusé", o: "Pêche-basilic ou hibiscus-menthe" },
  { l: "Chai maison", o: "Épices torréfiées minute · lait de coco" },
];

function CoffeeBar() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Bar à café</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Barista Léon · 22h → 03h & brunch</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Coffee className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground/90 to-primary-dark p-6 text-white">
          <p className="text-xs uppercase tracking-widest opacity-70">Fournisseur</p>
          <h2 className="mt-2 font-display text-2xl">Brûlerie Belleville · Paris 20ᵉ</h2>
          <p className="mt-2 text-sm opacity-90">Grains fraîchement torréfiés (J-3), machine La Marzocco Linea Mini, mouture au moment.</p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {drinks.map((d) => (
            <div key={d.l} className="rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:ring-primary/30">
              <p className="font-medium">{d.l}</p>
              <p className="mt-1 text-xs text-muted-foreground">{d.o}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-cream p-5 flex items-start gap-3">
          <Clock className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm">Ouvertures</p>
            <p className="text-xs text-muted-foreground">Fin de nuit 22h → 03h · Brunch dominical 10h → 13h · Gobelets réutilisables consignés 1€.</p>
          </div>
        </section>

        <section className="rounded-2xl bg-primary/10 p-4 flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm">Latte-art personnalisé</p>
            <p className="text-xs text-muted-foreground">Vos initiales L♥T disponibles au pochoir sur cappuccino et chocolat.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
