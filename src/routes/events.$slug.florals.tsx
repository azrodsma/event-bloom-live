import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Flower2, Sparkles, Leaf } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/florals")({
  component: Florals,
  head: () => ({
    meta: [
      { title: "Fleurs & compositions · MaFeliza" },
      { name: "description", content: "Composez bouquets, centres de table et arche florale avec votre fleuriste." },
      { property: "og:title", content: "Fleurs & compositions · MaFeliza" },
      { property: "og:description", content: "L'âme végétale de votre événement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const pieces = [
  { id: "p1", name: "Bouquet mariée", qty: 1, price: 180, flowers: "Pivoines, roses David Austin, eucalyptus" },
  { id: "p2", name: "Boutonnières", qty: 6, price: 12, flowers: "Rose miniature, olivier" },
  { id: "p3", name: "Centres de table bas", qty: 12, price: 65, flowers: "Roses crème, freesias, verdure" },
  { id: "p4", name: "Arche cérémonie", qty: 1, price: 480, flowers: "Cascade blanche & rose poudré" },
  { id: "p5", name: "Couronne pour l'autel", qty: 2, price: 55, flowers: "Feuillage frais & mini roses" },
];

const seasons = [
  { m: "Printemps", f: "Pivoines, renoncules, lilas" },
  { m: "Été", f: "Dahlias, roses de jardin, cosmos" },
  { m: "Automne", f: "Chrysanthèmes, hortensias séchés" },
  { m: "Hiver", f: "Anémones, hellébores, eucalyptus" },
];

function Florals() {
  const { slug } = useParams({ from: "/events/$slug/florals" });
  const [tone, setTone] = useState("Poudré");
  const total = pieces.reduce((a, p) => a + p.qty * p.price, 0);

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Fleurs & compositions</p>
          <p className="text-xs text-muted-foreground">{pieces.length} pièces · {total.toLocaleString("fr-FR")} €</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/20 p-6 shadow-card">
          <Flower2 className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight text-foreground">
            Votre langage floral
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Chaque tige raconte une intention. Sélectionnez la tonalité et les pièces.
          </p>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tonalité</p>
          <div className="flex flex-wrap gap-2">
            {["Poudré", "Bohème sauvage", "Blanc royal", "Bordeaux automnal", "Pastel doux"].map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                  tone === t ? "bg-primary text-white" : "bg-surface text-muted-foreground shadow-soft"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pièces commandées</p>
          <div className="space-y-2">
            {pieces.map((p) => (
              <article key={p.id} className="rounded-2xl bg-surface p-3.5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.flowers}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-lg leading-tight">{p.qty * p.price} €</p>
                    <p className="text-[11px] text-muted-foreground">× {p.qty}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Leaf className="h-3.5 w-3.5" /> Fleurs de saison
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {seasons.map((s) => (
              <div key={s.m} className="rounded-2xl bg-cream p-3">
                <p className="text-xs font-bold text-primary-dark">{s.m}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{s.f}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Choisir de saison = -30% sur le budget et -60% d'empreinte carbone.
          </p>
        </section>

        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-5 text-white shadow-card">
          <Sparkles className="h-5 w-5" />
          <p className="mt-2 font-serif text-lg leading-tight">Seconde vie des fleurs</p>
          <p className="mt-1 text-sm opacity-90">
            Vos compositions seront confiées à une association le lendemain (EHPAD partenaire).
          </p>
          <button className="mt-3 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur">
            Activer le don floral
          </button>
        </section>
      </main>
    </div>
  );
}
