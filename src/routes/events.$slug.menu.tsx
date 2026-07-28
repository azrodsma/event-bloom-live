import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Utensils, ChefHat, Wine } from "lucide-react";

export const Route = createFileRoute("/events/$slug/menu")({
  component: Menu,
  head: () => ({
    meta: [
      { title: "Menu du dîner · Memento Live" },
      { name: "description", content: "Menu 5 services signé par le chef, accords et alternatives." },
      { property: "og:title", content: "Menu du dîner · Memento Live" },
      { property: "og:description", content: "Une carte du cœur, une carte du terroir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const courses = [
  { l: "Mise en bouche", d: "Tartare de daurade, huile de sarrasin, caviar d'aubergine fumée", veggie: "Tartare de betterave" },
  { l: "Entrée", d: "Foie gras poêlé, coing rôti, pain d'épices maison", veggie: "Butternut confit, noisettes torréfiées" },
  { l: "Plat", d: "Pigeon rôti, jus corsé, purée de topinambour", veggie: "Risotto orge perlé & champignons de forêt" },
  { l: "Fromages", d: "Sélection de la Ferme des Rougeries, miel et fruits secs", veggie: "Idem" },
  { l: "Dessert", d: "Pièce montée + café gourmand", veggie: "Idem sans gluten possible" },
];

function Menu() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Menu du dîner</h1>
            <p className="text-xs text-muted-foreground">Chef Camille Lacoste · 5 services</p>
          </div>
          <Utensils className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-gold/20 p-6 text-center">
          <ChefHat className="h-6 w-6 text-primary mx-auto" />
          <p className="mt-2 text-xs uppercase tracking-widest text-primary">Table du 20 juin 2026</p>
          <h2 className="mt-2 font-display text-3xl">Menu Signature</h2>
          <p className="mt-2 text-sm text-muted-foreground italic">« Cuisiner comme on aime : à quatre mains, avec le meilleur du potager. »</p>
        </section>

        <section className="space-y-4">
          {courses.map((c, i) => (
            <div key={c.l} className="rounded-2xl border border-border/50 bg-card p-5">
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl text-primary">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-display text-lg">{c.l}</p>
              </div>
              <p className="mt-2 text-sm">{c.d}</p>
              <div className="mt-2 rounded-lg bg-cream/70 px-3 py-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Végétarien : </span>{c.veggie}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-4 flex items-center gap-3">
          <Wine className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-sm">Accords vins</p>
            <p className="text-xs text-muted-foreground">Voir la fiche dédiée · 6 bouteilles sélectionnées</p>
          </div>
        </section>
      </main>
    </div>
  );
}
