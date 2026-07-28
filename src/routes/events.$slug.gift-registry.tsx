import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Wallet, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/events/$slug/gift-registry")({
  component: GiftRegistry,
  head: () => ({
    meta: [
      { title: "Liste de mariage · Memento Live" },
      { name: "description", content: "Cadeaux ciblés et cagnotte externe : liberté totale des invités." },
      { property: "og:title", content: "Liste · Memento Live" },
      { property: "og:description", content: "42 idées curatées, cagnotte Leetchi liée, zéro commission." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const items = [
  { l: "Nuit à l'hôtel Molitor", price: "320 €", pledged: 8, cap: 8, cat: "Voyage de noces" },
  { l: "Cours de cuisine chez Anne-Sophie Pic", price: "480 €", pledged: 6, cap: 8, cat: "Expérience" },
  { l: "Service Le Creuset fonte", price: "890 €", pledged: 22, cap: 30, cat: "Maison" },
  { l: "Vélo électrique Angell", price: "2 690 €", pledged: 14, cap: 40, cat: "Mobilité douce" },
  { l: "Machine à espresso La Marzocco Linea Mini", price: "5 200 €", pledged: 31, cap: 60, cat: "Maison" },
  { l: "Weekend Bora Bora", price: "3 800 €", pledged: 12, cap: 45, cat: "Voyage de noces" },
];

function GiftRegistry() {
  const totalPledged = items.reduce((a, i) => a + (parseInt(i.price.replace(/\D/g, "")) * i.pledged) / i.cap, 0);
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Liste de mariage</h1>
            <p className="text-xs text-muted-foreground">42 idées · cagnotte Leetchi liée</p>
          </div>
          <Wallet className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-gold/20 p-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="mt-2 font-display text-3xl leading-tight">L'argent reste dehors. La joie reste dedans.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Memento ne prend zéro commission. Vos invités paient directement sur Leetchi, Lydia ou par virement.</p>
          <p className="mt-4 font-display text-3xl text-primary">{Math.round(totalPledged).toLocaleString("fr-FR")} €</p>
          <p className="text-xs text-muted-foreground">collectés · sur objectif 24 000 €</p>
        </section>

        <section className="space-y-3">
          {items.map((it) => {
            const pct = (it.pledged / it.cap) * 100;
            return (
              <div key={it.l} className="rounded-2xl border border-border/50 bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-primary">{it.cat}</p>
                    <p className="font-medium mt-1">{it.l}</p>
                  </div>
                  <span className="text-sm shrink-0">{it.price}</span>
                </div>
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-cream overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-gold" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{it.pledged}/{it.cap} contributions</p>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
