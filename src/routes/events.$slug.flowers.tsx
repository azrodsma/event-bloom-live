import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Flower2, Sparkles, Info, Plus, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/flowers")({
  component: Flowers,
  head: () => ({
    meta: [
      { title: "Fleurs & compositions · MaFeliza" },
      { name: "description", content: "Composez la palette florale de votre événement — bouquets, centres de table, arches." },
      { property: "og:title", content: "Fleurs · MaFeliza" },
      { property: "og:description", content: "Le langage secret des pétales." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Composition = {
  id: string;
  name: string;
  role: string;
  image: string;
  qty: number;
  price: number;
  flowers: string[];
};

type Bloom = { id: string; name: string; season: string; meaning: string; color: string };

const comps: Composition[] = [
  { id: "c1", name: "Bouquet de la mariée", role: "Nuptial · rond & aéré", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600", qty: 1, price: 120, flowers: ["Pivoine", "Eucalyptus", "Rose David Austin"] },
  { id: "c2", name: "Arche de cérémonie", role: "Grande installation", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600", qty: 1, price: 480, flowers: ["Pampa", "Rose poudrée", "Feuillage"] },
  { id: "c3", name: "Centres de table", role: "Bas & filants", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600", qty: 12, price: 55, flowers: ["Renoncule", "Eucalyptus", "Lisianthus"] },
  { id: "c4", name: "Boutonnières", role: "Marié & témoins", image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=600", qty: 6, price: 15, flowers: ["Rose", "Olivier"] },
];

const catalog: Bloom[] = [
  { id: "b1", name: "Pivoine", season: "Mai – Juin", meaning: "Bonheur conjugal", color: "bg-rose-200" },
  { id: "b2", name: "Renoncule", season: "Fév. – Mai", meaning: "Charme irrésistible", color: "bg-amber-200" },
  { id: "b3", name: "Rose David Austin", season: "Mai – Oct.", meaning: "Amour éternel", color: "bg-pink-200" },
  { id: "b4", name: "Lisianthus", season: "Toute l'année", meaning: "Gratitude", color: "bg-purple-100" },
  { id: "b5", name: "Eucalyptus", season: "Toute l'année", meaning: "Protection", color: "bg-emerald-200" },
  { id: "b6", name: "Pampa", season: "Sept. – Fév.", meaning: "Persévérance", color: "bg-orange-100" },
];

function Flowers() {
  const { slug } = useParams({ from: "/events/$slug/flowers" });
  const [added, setAdded] = useState<Set<string>>(new Set(["c1", "c3"]));

  const total = comps.filter((c) => added.has(c.id)).reduce((s, c) => s + c.qty * c.price, 0);

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Fleurs</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/30 to-background" />
        <div className="relative px-4 py-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Flower2 className="h-3.5 w-3.5 text-primary" /> Palette florale
          </div>
          <h1 className="mt-2 font-serif text-3xl leading-tight">Roses poudrées &<br />blancs cassés</h1>
          <p className="mt-2 text-sm text-muted-foreground">Palette validée avec votre fleuriste Camille — mai 2026.</p>
          <div className="mt-4 flex gap-1.5">
            {["#E85D8E", "#F5C1CB", "#FFF8F4", "#D9A441", "#8FA97A"].map((c) => (
              <span key={c} className="h-8 w-8 rounded-full ring-2 ring-background" style={{ background: c }} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">Compositions</h2>
          <span className="text-[11px] text-muted-foreground">{added.size} sélectionnées</span>
        </div>
        <ul className="space-y-3">
          {comps.map((c) => {
            const on = added.has(c.id);
            return (
              <li key={c.id} className={`overflow-hidden rounded-3xl border transition ${on ? "border-primary" : "border-border/60"}`}>
                <div className="flex gap-3 bg-card p-3">
                  <img src={c.image} alt="" className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-[15px] leading-tight">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground">{c.role}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {c.flowers.map((f) => (
                        <span key={f} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{f}</span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-[11px] text-muted-foreground">×{c.qty} · <span className="font-bold text-foreground">{c.qty * c.price} €</span></p>
                      <button
                        onClick={() => setAdded((s) => { const n = new Set(s); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n; })}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${on ? "bg-primary/10 text-primary" : "bg-foreground text-background"}`}
                      >
                        {on ? <><Check className="h-3 w-3" /> Ajouté</> : <><Plus className="h-3 w-3" /> Ajouter</>}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Total estimé</span>
          <span className="font-serif text-xl">{total} €</span>
        </div>
      </section>

      <section className="px-4 pt-8">
        <h2 className="mb-3 font-serif text-lg">Herbier de saison</h2>
        <div className="grid grid-cols-2 gap-3">
          {catalog.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-2xl border border-border/60 bg-card p-3">
              <div className={`mb-2 h-14 w-full rounded-xl ${b.color}`} />
              <p className="font-serif text-sm">{b.name}</p>
              <p className="text-[10px] text-muted-foreground">{b.season}</p>
              <p className="mt-1 flex items-start gap-1 text-[10px] text-primary">
                <Info className="mt-0.5 h-3 w-3 shrink-0" /> {b.meaning}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-4 mt-8 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Bonus MaFeliza</p>
        <p className="mt-2 font-serif text-lg leading-tight">Distribution des fleurs post-cérémonie</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          En fin de soirée, invitez vos convives à repartir avec un brin — moins de gâchis, plus de souvenirs.
        </p>
        <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          <Sparkles className="h-3.5 w-3.5" /> Ajouter à ma timeline
        </button>
      </section>
    </div>
  );
}
