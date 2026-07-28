import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Gift, Sparkles, Package } from "lucide-react";

export const Route = createFileRoute("/events/$slug/favors")({
  component: Favors,
  head: () => ({
    meta: [
      { title: "Cadeaux invités · Memento Live" },
      { name: "description", content: "Petites attentions à remettre en fin de soirée." },
      { property: "og:title", content: "Cadeaux invités · Memento Live" },
      { property: "og:description", content: "Un souvenir à emporter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const ideas = [
  { name: "Bougie artisanale", supplier: "L'Atelier de Lise", price: 6.5, moq: 60, tag: "Local", color: "from-primary to-primary-dark" },
  { name: "Pot de miel 40g", supplier: "Rucher du Luberon", price: 4.9, moq: 80, tag: "Éco", color: "from-gold to-primary" },
  { name: "Sachet de graines", supplier: "Semences Paysannes", price: 2.2, moq: 120, tag: "Végétal", color: "from-primary-dark to-gold" },
  { name: "Savon Marseille mini", supplier: "Fer à Cheval", price: 3.8, moq: 100, tag: "Iconique", color: "from-cream to-primary" },
];

function Favors() {
  const { slug } = useParams({ from: "/events/$slug/favors" });
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Cadeaux invités</p>
          <p className="text-xs text-muted-foreground">4 idées shortlistées · budget 480 €</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/25 p-6 shadow-card">
          <Gift className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Un souvenir à emporter</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Un petit cadeau à la sortie clôture la soirée avec émotion — sans faire exploser le budget.
          </p>
        </section>

        <section className="space-y-2">
          {ideas.map((i) => (
            <article key={i.name} className="overflow-hidden rounded-2xl bg-surface shadow-soft">
              <div className="flex items-center gap-3 p-4">
                <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${i.color} text-white`}>
                  <Package className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-serif text-lg leading-tight">{i.name}</p>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary-dark">{i.tag}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{i.supplier} · min. {i.moq}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl">{i.price}€</p>
                  <p className="text-[10px] uppercase text-muted-foreground">l'unité</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-border/60 px-4 py-2 text-xs">
                <button className="flex-1 rounded-full bg-primary py-1.5 font-semibold text-white">Commander</button>
                <button className="rounded-full border border-border px-3 py-1.5">Détails</button>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="mt-2 font-serif text-lg leading-tight">Étiquette personnalisée</p>
          <p className="mt-1 text-sm opacity-80">
            Ajoutez une étiquette « Merci d'avoir partagé notre jour » avec prénom et date, imprimée sur papier lin.
          </p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold">Personnaliser les étiquettes</button>
        </section>
      </main>
    </div>
  );
}
