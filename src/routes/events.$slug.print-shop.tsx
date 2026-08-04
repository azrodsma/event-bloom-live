import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag, Sparkles, Truck, ChevronRight, Plus, Minus, Heart, Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/print-shop")({
  component: PrintShop,
  head: () => ({
    meta: [
      { title: "Boutique souvenirs · MaFeliza" },
      { name: "description", content: "Livre photo, tirages Fine Art, magnets, posters : imprimez vos plus beaux moments." },
      { property: "og:title", content: "Boutique souvenirs · MaFeliza" },
      { property: "og:description", content: "Le papier fait tout dire." },
      { property: "og:type", content: "product.group" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  from?: boolean;
  cover: string;
  badge?: string;
  rating: number;
  reviews: number;
  formats: string[];
  bestseller?: boolean;
};

const products: Product[] = [
  {
    id: "p1",
    name: "Livre photo Prestige",
    subtitle: "Couverture toilée, 40 pages, papier Fine Art",
    price: 89,
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
    badge: "Meilleure vente",
    rating: 4.9,
    reviews: 214,
    formats: ["20 × 20", "25 × 25", "30 × 30"],
    bestseller: true,
  },
  {
    id: "p2",
    name: "Tirages Fine Art",
    subtitle: "Papier mat 250 g, encres pigmentées",
    price: 3.5,
    from: true,
    cover: "https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=800",
    rating: 4.8,
    reviews: 98,
    formats: ["10 × 15", "13 × 18", "20 × 30", "30 × 40"],
  },
  {
    id: "p3",
    name: "Poster souvenir",
    subtitle: "Mosaïque de 60 photos + date en calligraphie",
    price: 39,
    cover: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800",
    badge: "Nouveauté",
    rating: 5.0,
    reviews: 42,
    formats: ["A2", "A1"],
  },
  {
    id: "p4",
    name: "Magnets photo",
    subtitle: "Set de 9 magnets carrés adhésifs",
    price: 24,
    cover: "https://images.unsplash.com/photo-1552083375-1447ce886485?w=800",
    rating: 4.7,
    reviews: 156,
    formats: ["6 × 6"],
  },
  {
    id: "p5",
    name: "Coffret vinyle Souvenir",
    subtitle: "Playlist du jour + livret 20 pages",
    price: 68,
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    rating: 4.9,
    reviews: 27,
    formats: ["33 tours"],
  },
];

const bundles = [
  { emoji: "💎", title: "Bundle Prestige", desc: "Livre + Poster + 30 tirages", price: 129, save: 42 },
  { emoji: "🎁", title: "Kit Famille", desc: "20 magnets + 15 tirages", price: 49, save: 18 },
];

function PrintShop() {
  const { slug } = useParams({ from: "/events/$slug/print-shop" });
  const [qty, setQty] = useState<Record<string, number>>({});
  const [wished, setWished] = useState<Set<string>>(new Set());

  const bump = (id: string, d: number) =>
    setQty((s) => ({ ...s, [id]: Math.max(0, (s[id] ?? 0) + d) }));
  const wish = (id: string) =>
    setWished((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const total = products.reduce((sum, p) => sum + (qty[p.id] ?? 0) * p.price, 0);
  const items = Object.values(qty).reduce((a, b) => a + b, 0);

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Boutique souvenirs</p>
        <button className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Panier">
          <ShoppingBag className="h-4 w-4" />
          {items > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
              {items}
            </span>
          )}
        </button>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/50 via-primary/5 to-transparent" />
        <div className="relative px-4 pb-6 pt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Impression premium en France
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-tight">
            Le papier<br />
            <span className="italic text-primary">fait tout dire</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Vos souvenirs MaFeliza, imprimés à la main sur papier Fine Art.
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur">
            <Truck className="h-3 w-3 text-primary" /> Livraison offerte dès 60 €
          </div>
        </div>
      </section>

      <section className="mx-4 space-y-2">
        {bundles.map((b) => (
          <button
            key={b.title}
            className="flex w-full items-center gap-3 overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/40 p-4 text-left"
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-3xl shadow-sm">{b.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{b.title}</p>
              <p className="text-[11px] text-muted-foreground">{b.desc}</p>
              <p className="mt-1 text-xs">
                <span className="font-serif text-lg text-primary">{b.price} €</span>{" "}
                <span className="text-[10px] font-semibold text-emerald-700">économisez {b.save} €</span>
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </section>

      <section className="mt-6 px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">À la carte</p>
        <ul className="mt-3 space-y-4">
          {products.map((p) => {
            const n = qty[p.id] ?? 0;
            const isWished = wished.has(p.id);
            return (
              <li key={p.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
                <div className="relative h-52 w-full overflow-hidden">
                  <img src={p.cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {p.badge && (
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur ${
                        p.bestseller ? "bg-primary text-primary-foreground" : "bg-white/90 text-foreground"
                      }`}
                    >
                      {p.badge}
                    </span>
                  )}
                  <button
                    onClick={() => wish(p.id)}
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur"
                    aria-label="Favori"
                  >
                    <Heart className={`h-4 w-4 ${isWished ? "fill-primary text-primary" : "text-foreground"}`} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-serif text-lg leading-tight">{p.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{p.subtitle}</p>
                    </div>
                    <p className="whitespace-nowrap text-right">
                      <span className="font-serif text-xl">
                        {p.from ? "dès " : ""}
                        {p.price} €
                      </span>
                    </p>
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-foreground">{p.rating}</span>
                    <span>·</span>
                    <span>{p.reviews} avis</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.formats.map((f) => (
                      <span key={f} className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {n === 0 ? (
                      <button
                        onClick={() => bump(p.id, 1)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground py-2.5 text-xs font-bold text-background"
                      >
                        <Plus className="h-3.5 w-3.5" /> Ajouter au panier
                      </button>
                    ) : (
                      <div className="flex flex-1 items-center justify-between rounded-full bg-primary p-1 text-primary-foreground">
                        <button onClick={() => bump(p.id, -1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-bold">{n}</span>
                        <button onClick={() => bump(p.id, 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <button className="rounded-full border border-border bg-background px-3 py-2.5 text-xs font-semibold">
                      Personnaliser
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mx-4 mt-6 flex items-center gap-3 rounded-3xl bg-primary/5 p-4 text-[11px] text-muted-foreground">
        <Truck className="h-5 w-5 shrink-0 text-primary" />
        <p>Commande passée avant le 20 : livraison estimée entre le 25 et le 28. Papeterie éco-responsable FSC.</p>
      </div>

      {items > 0 && (
        <div className="fixed bottom-20 inset-x-0 z-30 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
          <button className="flex w-full items-center justify-between rounded-full bg-primary px-5 py-3.5 text-primary-foreground shadow-glow">
            <span className="inline-flex items-center gap-2 text-sm font-bold">
              <ShoppingBag className="h-4 w-4" /> Voir le panier · {items} article{items > 1 ? "s" : ""}
            </span>
            <span className="font-serif text-lg">{total.toFixed(2)} €</span>
          </button>
        </div>
      )}
    </div>
  );
}
