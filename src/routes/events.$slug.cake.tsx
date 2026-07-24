import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Cake, Sparkles, Plus, Check, Wheat, Nut, Milk } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/cake")({
  component: CakePage,
  head: () => ({
    meta: [
      { title: "Pièce montée & desserts · Memento Live" },
      { name: "description", content: "Choisissez la pièce maîtresse sucrée : nombre d'étages, parfums, décors et intolérances." },
      { property: "og:title", content: "Pièce montée · Memento Live" },
      { property: "og:description", content: "Le clou sucré de la soirée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const tiers = [
  { n: 2, servings: 40, price: 220, label: "Intime" },
  { n: 3, servings: 80, price: 380, label: "Classique" },
  { n: 4, servings: 120, price: 540, label: "Grand jour" },
  { n: 5, servings: 180, price: 780, label: "Prestige" },
];

const flavors = [
  { id: "v", emoji: "🌾", name: "Vanille Madagascar", note: "Crème onctueuse & biscuit moelleux" },
  { id: "c", emoji: "🍫", name: "Chocolat Guanaja", note: "70% cacao, ganache soyeuse" },
  { id: "r", emoji: "🍓", name: "Fraise & basilic", note: "Fruits frais gariguette" },
  { id: "p", emoji: "🥜", name: "Praliné noisette", note: "Croustillant, feuilletine dorée" },
  { id: "l", emoji: "🍋", name: "Citron yuzu", note: "Meringue légère à peine dorée" },
  { id: "f", emoji: "🌸", name: "Rose litchi", note: "Signature Memento — poétique" },
];

const allergens = [
  { id: "gluten", label: "Sans gluten", icon: Wheat },
  { id: "lait", label: "Sans lactose", icon: Milk },
  { id: "noix", label: "Sans fruits à coque", icon: Nut },
];

function CakePage() {
  const { slug } = useParams({ from: "/events/$slug/cake" });
  const [tier, setTier] = useState(tiers[1]);
  const [picked, setPicked] = useState<Set<string>>(new Set(["v", "r"]));
  const [avoid, setAvoid] = useState<Set<string>>(new Set(["gluten"]));

  const pickedList = flavors.filter((f) => picked.has(f.id));
  const extra = avoid.size * 25;
  const total = tier.price + extra;

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Pièce montée</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/40 via-primary/10 to-background" />
        <div className="relative px-4 pb-4 pt-8 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold shadow-sm backdrop-blur">
            <Cake className="h-3.5 w-3.5 text-primary" /> Pâtissier · Maison Boissier
          </div>
          <h1 className="mt-3 font-serif text-3xl leading-tight">Votre clou sucré</h1>

          <div className="relative mx-auto mt-6 flex h-56 w-56 items-end justify-center">
            {Array.from({ length: tier.n }).map((_, i) => {
              const width = 100 - i * 18;
              const height = 22 + (tier.n - i - 1) * 4;
              return (
                <span
                  key={i}
                  className="absolute rounded-t-lg shadow-md"
                  style={{
                    width: `${width}%`,
                    height: `${height}px`,
                    bottom: `${i * height * 0.85}px`,
                    background: `linear-gradient(180deg, #FFF8F4, #F5C1CB)`,
                    border: "2px solid #E85D8E",
                    borderBottom: i === 0 ? "2px solid #E85D8E" : "none",
                  }}
                />
              );
            })}
            <span className="absolute text-3xl" style={{ bottom: `${tier.n * 25}px` }}>✨</span>
          </div>
          <p className="mt-4 font-serif text-xl">{tier.n} étages · {tier.label}</p>
          <p className="text-[11px] text-muted-foreground">{tier.servings} parts servies</p>
        </div>
      </section>

      <section className="px-4 pt-4">
        <h2 className="mb-3 font-serif text-lg">Taille</h2>
        <div className="grid grid-cols-4 gap-2">
          {tiers.map((t) => (
            <button
              key={t.n}
              onClick={() => setTier(t)}
              className={`rounded-2xl border p-2 text-center transition ${tier.n === t.n ? "border-primary bg-primary/5" : "border-border/60"}`}
            >
              <p className="font-serif text-lg leading-none">{t.n}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{t.servings} parts</p>
              <p className="mt-0.5 text-[10px] font-bold text-primary">{t.price} €</p>
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 pt-8">
        <h2 className="mb-3 font-serif text-lg">Parfums · {picked.size}/{tier.n}</h2>
        <ul className="space-y-2">
          {flavors.map((f) => {
            const on = picked.has(f.id);
            const canAdd = picked.size < tier.n || on;
            return (
              <li
                key={f.id}
                onClick={() => {
                  if (!canAdd) return;
                  setPicked((s) => { const n = new Set(s); n.has(f.id) ? n.delete(f.id) : n.add(f.id); return n; });
                }}
                className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                  on ? "border-primary bg-primary/5" : canAdd ? "border-border/60 bg-card" : "border-border/40 bg-card opacity-40"
                }`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-lg">{f.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{f.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{f.note}</p>
                </div>
                <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {on && <Check className="h-3.5 w-3.5" />}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-4 pt-8">
        <h2 className="mb-3 font-serif text-lg">Régimes spéciaux</h2>
        <div className="flex flex-wrap gap-2">
          {allergens.map((a) => {
            const Icon = a.icon;
            const on = avoid.has(a.id);
            return (
              <button
                key={a.id}
                onClick={() => setAvoid((s) => { const n = new Set(s); n.has(a.id) ? n.delete(a.id) : n.add(a.id); return n; })}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  on ? "border-primary bg-primary/10 text-primary" : "border-border/60 bg-card text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {a.label}
                {on && <span className="ml-1 text-[10px]">+25 €</span>}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">Option 100 % vegan disponible sur demande · +80 €</p>
      </section>

      <section className="mx-4 mt-8 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Bonus poétique</p>
        <p className="mt-2 font-serif text-lg leading-tight">Le message caché dans l'étage du haut</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Une phrase gravée sur macaron, révélée à la découpe. Facturé offert.</p>
        <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          <Sparkles className="h-3.5 w-3.5" /> Écrire ma phrase
        </button>
      </section>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/95 p-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="flex-1 text-xs">
            <p className="font-medium">{tier.n} étages · {pickedList.length} parfums</p>
            <p className="text-muted-foreground">Livraison le jour J · dressage inclus</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-xl leading-none">{total} €</p>
            <button className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-[11px] font-bold text-primary-foreground">
              <Plus className="h-3 w-3" /> Commander
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
