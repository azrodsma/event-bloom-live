import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Package2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/events/$slug/rentals")({
  component: Rentals,
  head: () => ({
    meta: [
      { title: "Location matériel · MaFeliza" },
      { name: "description", content: "Suivi des locations mobilier, vaisselle et arts de la table." },
      { property: "og:title", content: "Location matériel · MaFeliza" },
      { property: "og:description", content: "1 200 pièces livrées, comptées, restituées." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const cats = [
  { l: "Vaisselle porcelaine blanche filet or", qty: "444 assiettes (3 par pers.)", cost: "620 €", vendor: "Options · Bordeaux" },
  { l: "Verrerie cristal Zwiesel", qty: "592 verres (4 par pers.)", cost: "480 €", vendor: "Options · Bordeaux" },
  { l: "Couverts inox 18/10 mat", qty: "888 pièces", cost: "310 €", vendor: "Options · Bordeaux" },
  { l: "Chaises Napoléon III doré", qty: "150", cost: "525 €", vendor: "Alter Ego Réceptions" },
  { l: "Nappes lin naturel", qty: "18 x 3m", cost: "395 €", vendor: "Le Cercle du Lin" },
  { l: "Chandeliers en laiton vintage", qty: "54", cost: "195 €", vendor: "Alter Ego Réceptions" },
  { l: "Cabine photobooth années 30", qty: "1", cost: "890 €", vendor: "Retrophoto" },
  { l: "Chapiteau bambou 8x15m repli", qty: "1", cost: "1 240 €", vendor: "Bam'Boo Events" },
];

function Rentals() {
  const total = cats.reduce((a, c) => a + parseInt(c.cost.replace(/\D/g, "")), 0);
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Location matériel</h1>
            <p className="text-xs text-muted-foreground">8 catégories · 4 loueurs partenaires</p>
          </div>
          <Package2 className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-6 text-white">
          <CheckCircle2 className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Livré, compté, restitué.</h2>
          <p className="mt-3 text-sm opacity-90">Inventaire double au dépôt et à la restitution · caution récupérée à 100% sur nos 84 derniers événements.</p>
          <div className="mt-5 grid grid-cols-3 gap-4 text-center">
            <div><p className="font-display text-2xl">{total.toLocaleString("fr-FR")} €</p><p className="text-[10px] opacity-70">total location</p></div>
            <div><p className="font-display text-2xl">4</p><p className="text-[10px] opacity-70">loueurs</p></div>
            <div><p className="font-display text-2xl">2 j</p><p className="text-[10px] opacity-70">forfait</p></div>
          </div>
        </section>

        <section className="space-y-3">
          {cats.map((c) => (
            <div key={c.l} className="rounded-2xl border border-border/50 bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">{c.l}</p>
                <span className="text-xs text-primary shrink-0">{c.cost}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{c.qty}</p>
              <p className="mt-2 text-xs text-muted-foreground italic">via {c.vendor}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
