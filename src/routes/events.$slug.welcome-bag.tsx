import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Gift, Plus, Minus, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/welcome-bag")({
  component: WelcomeBag,
  head: () => ({
    meta: [
      { title: "Sac de bienvenue · Memento Live" },
      { name: "description", content: "Composez le welcome bag de vos invités : produits locaux, souvenirs et douceurs." },
      { property: "og:title", content: "Sac de bienvenue · Memento Live" },
      { property: "og:description", content: "L'accueil parfait, dès l'arrivée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Item = {
  id: string;
  name: string;
  origin: string;
  price: number;
  qty: number;
  emoji: string;
  tag: "Local" | "Artisan" | "Souvenir" | "Douceur";
};

const catalog: Item[] = [
  { id: "i1", name: "Miel de lavande", origin: "Provence · La Ruche d'Or", price: 6.5, qty: 60, emoji: "🍯", tag: "Local" },
  { id: "i2", name: "Savon artisanal", origin: "Marseille · Maison Ferré", price: 4, qty: 80, emoji: "🧼", tag: "Artisan" },
  { id: "i3", name: "Carte postale illustrée", origin: "Design signature S&T", price: 1.5, qty: 100, emoji: "💌", tag: "Souvenir" },
  { id: "i4", name: "Calisson d'Aix", origin: "Boîte de 4 · Confiserie Léonard", price: 3.5, qty: 80, emoji: "🍬", tag: "Douceur" },
  { id: "i5", name: "Sachet de graines", origin: "Fleurs sauvages à planter", price: 2, qty: 100, emoji: "🌸", tag: "Souvenir" },
  { id: "i6", name: "Mini bouteille rosé", origin: "Château La Rose · 20 cl", price: 5, qty: 60, emoji: "🍷", tag: "Local" },
];

const tagColor: Record<Item["tag"], string> = {
  Local: "bg-success/15 text-success",
  Artisan: "bg-gold/20 text-gold",
  Souvenir: "bg-primary/15 text-primary",
  Douceur: "bg-primary-light text-primary",
};

function WelcomeBag() {
  const { slug } = useParams({ from: "/events/$slug/welcome-bag" });
  const [items, setItems] = useState(catalog);
  const [guests] = useState(120);

  const set = (id: string, delta: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)));

  const totalUnits = items.reduce((s, i) => s + i.qty, 0);
  const totalCost = items.reduce((s, i) => s + i.qty * i.price, 0);
  const perBag = totalCost / guests;

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="font-serif text-lg leading-tight">Sac de bienvenue</p>
            <p className="text-xs text-muted-foreground">{items.filter((i) => i.qty > 0).length} produits · {guests} invités</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-white shadow-glow">
          <ShoppingBag className="h-4 w-4" /> Commander
        </button>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="grid grid-cols-3 gap-3">
          {[
            { label: "Unités", value: totalUnits },
            { label: "Coût / sac", value: `${perBag.toFixed(2)} €` },
            { label: "Budget total", value: `${totalCost.toFixed(0)} €` },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-surface p-3 text-center shadow-card">
              <p className="font-serif text-xl text-primary">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl bg-gradient-primary p-5 text-white shadow-card">
          <Gift className="h-6 w-6" />
          <p className="mt-2 font-serif text-xl">Un accueil signature</p>
          <p className="mt-1 text-sm opacity-90">
            Composez un cadeau qui raconte votre histoire. Nos artisans locaux préparent tout sous 15 jours.
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Catalogue</p>
          {items.map((i) => (
            <article key={i.id} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-card">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary-light text-2xl">{i.emoji}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{i.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tagColor[i.tag]}`}>{i.tag}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{i.origin}</p>
                <p className="mt-1 text-xs font-medium text-primary">{i.price.toFixed(2)} € / unité</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => set(i.id, -10)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-muted text-foreground hover:bg-primary-light"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-serif text-lg">{i.qty}</span>
                <button
                  onClick={() => set(i.id, 10)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-card">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">Suggestion IA</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Vos invités viennent à 68 % du Sud-Ouest. Ajoutez un cannelé bordelais pour une touche locale (+0,80 € / sac).
          </p>
          <button className="mt-3 rounded-full bg-primary-light px-4 py-2 text-xs font-semibold text-primary">
            + Ajouter au sac
          </button>
        </section>
      </main>
    </div>
  );
}
