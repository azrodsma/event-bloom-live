import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, ExternalLink, Gift, Check, Share2, Heart } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/registry")({
  component: Registry,
  head: () => ({
    meta: [
      { title: "Liste de cadeaux · Memento Live" },
      { name: "description", content: "Une liste de cadeaux collaborative — cagnotte externe, voyage de noces ou boutiques partenaires." },
      { property: "og:title", content: "Liste de cadeaux · Memento Live" },
      { property: "og:description", content: "Suggérez à vos invités des idées de cadeaux." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface Item {
  id: string;
  title: string;
  desc: string;
  price: number;
  image: string;
  category: "Voyage" | "Maison" | "Expérience" | "Cagnotte";
  contributions: number;
  claimedBy: number;
  claimedAvatars: string[];
  fullyFunded: boolean;
  externalUrl?: string;
}

const seed: Item[] = [
  { id: "r1", title: "Voyage de noces à Kyoto", desc: "Deux semaines au Japon, entre temples et cerisiers", price: 4800, image: "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=800&auto=format&fit=crop", category: "Voyage", contributions: 3120, claimedBy: 12, claimedAvatars: ["https://i.pravatar.cc/40?img=1", "https://i.pravatar.cc/40?img=2", "https://i.pravatar.cc/40?img=3"], fullyFunded: false },
  { id: "r2", title: "Vaisselle Astier de Villatte", desc: "Service pour 12 personnes", price: 1200, image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop", category: "Maison", contributions: 1200, claimedBy: 6, claimedAvatars: ["https://i.pravatar.cc/40?img=5", "https://i.pravatar.cc/40?img=6"], fullyFunded: true },
  { id: "r3", title: "Dégustation privée · Domaine Château La Rose", desc: "Une journée en Bourgogne pour deux", price: 480, image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop", category: "Expérience", contributions: 240, claimedBy: 2, claimedAvatars: ["https://i.pravatar.cc/40?img=7"], fullyFunded: false },
  { id: "r4", title: "Machine à café Faema", desc: "Pour des matins à l'italienne", price: 890, image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop", category: "Maison", contributions: 620, claimedBy: 4, claimedAvatars: ["https://i.pravatar.cc/40?img=9", "https://i.pravatar.cc/40?img=10"], fullyFunded: false },
  { id: "r5", title: "Cagnotte libre", desc: "Une participation au montant de votre choix", price: 0, image: "https://images.unsplash.com/photo-1494236922530-a3d19a5cd5ed?w=800&auto=format&fit=crop", category: "Cagnotte", contributions: 1560, claimedBy: 24, claimedAvatars: ["https://i.pravatar.cc/40?img=11", "https://i.pravatar.cc/40?img=12", "https://i.pravatar.cc/40?img=13"], fullyFunded: false, externalUrl: "https://leetchi.com" },
];

const categories = ["Tous", "Voyage", "Maison", "Expérience", "Cagnotte"] as const;

function euro(n: number) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function Registry() {
  const { slug } = useParams({ from: "/events/$slug/registry" });
  const [items] = useState(seed);
  const [cat, setCat] = useState<(typeof categories)[number]>("Tous");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => (cat === "Tous" ? items : items.filter((i) => i.category === cat)), [items, cat]);

  const totalContrib = items.reduce((a, i) => a + i.contributions, 0);
  const totalGoal = items.reduce((a, i) => a + i.price, 0);

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Liste de cadeaux</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Ajouter">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/60 to-transparent px-4 pb-6 pt-6">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-glow">
          <Gift className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-serif text-3xl leading-tight">Nos envies partagées</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vos invités participent aux cadeaux qui vous font vraiment plaisir. Les paiements se font sur votre plateforme externe.
        </p>

        <div className="mt-5 flex items-baseline gap-2">
          <p className="font-serif text-2xl">{euro(totalContrib)}</p>
          <span className="text-sm text-muted-foreground">/ {euro(totalGoal)}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-background/60">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${Math.round((totalContrib / totalGoal) * 100)}%` }} />
        </div>

        <div className="mt-5 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-xs font-semibold text-background">
            <Share2 className="h-3.5 w-3.5" /> Partager la liste
          </button>
        </div>
      </section>

      <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              c === cat ? "bg-foreground text-background" : "border border-border bg-background"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="grid gap-4 px-4 sm:grid-cols-2">
        {filtered.map((i) => {
          const percent = i.price > 0 ? Math.min(100, Math.round((i.contributions / i.price) * 100)) : 100;
          return (
            <li key={i.id} className="overflow-hidden rounded-3xl bg-card shadow-sm">
              <div className="relative aspect-[4/3]">
                <img src={i.image} alt={i.title} className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] font-semibold backdrop-blur">
                  {i.category}
                </span>
                {i.fullyFunded && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground">
                    <Check className="h-3 w-3" /> Financé
                  </span>
                )}
                <button
                  onClick={() => toggleSave(i.id)}
                  className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur"
                  aria-label="Sauvegarder"
                >
                  <Heart className={`h-4 w-4 ${saved.has(i.id) ? "fill-primary text-primary" : ""}`} />
                </button>
              </div>
              <div className="p-4">
                <p className="font-serif text-lg leading-tight">{i.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{i.desc}</p>

                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <p className="font-mono text-sm font-semibold">
                      {i.price > 0 ? euro(i.contributions) : euro(i.contributions)}
                      {i.price > 0 && <span className="text-muted-foreground"> / {euro(i.price)}</span>}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{i.claimedBy} contrib.</p>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full ${i.fullyFunded ? "bg-primary" : "bg-gradient-to-r from-primary to-accent"}`} style={{ width: `${percent}%` }} />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {i.claimedAvatars.map((a, idx) => (
                      <img key={idx} src={a} alt="" className="h-6 w-6 rounded-full border-2 border-background object-cover" />
                    ))}
                    {i.claimedBy > i.claimedAvatars.length && (
                      <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-muted text-[9px] font-semibold">
                        +{i.claimedBy - i.claimedAvatars.length}
                      </span>
                    )}
                  </div>
                  <a
                    href={i.externalUrl ?? "#"}
                    target={i.externalUrl ? "_blank" : undefined}
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                      i.fullyFunded ? "bg-secondary text-muted-foreground pointer-events-none" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {i.fullyFunded ? "Merci !" : <>Participer <ExternalLink className="h-3 w-3" /></>}
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mx-4 mt-6 rounded-2xl border border-dashed border-border p-4 text-center text-[11px] text-muted-foreground">
        Memento Live ne manipule pas les paiements — chaque contribution passe par votre plateforme externe (Leetchi, Lydia, PayPal…).
      </p>
    </div>
  );
}
