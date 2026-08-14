import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Gavel, Heart, Sparkles, TrendingUp, Users, Clock, Trophy } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/events/$slug/auction")({
  component: Auction,
  head: () => ({
    meta: [
      { title: "Enchère solidaire live · MaFeliza" },
      { name: "description", content: "Enchérissez en direct sur des lots offerts par vos proches — les fonds vont à une association choisie par les hôtes." },
      { property: "og:title", content: "Enchère solidaire · MaFeliza" },
      { property: "og:description", content: "Célébrer et donner, en même temps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Lot = {
  id: string;
  title: string;
  donor: string;
  image: string;
  startPrice: number;
  currentBid: number;
  topBidder: string;
  bids: number;
  status: "live" | "next" | "closed";
  winner?: string;
};

const initial: Lot[] = [
  { id: "l1", title: "Weekend en Bourgogne · 2 nuits", donor: "Oncle Philippe & Tante Marie", image: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=600", startPrice: 150, currentBid: 320, topBidder: "Camille R.", bids: 12, status: "live" },
  { id: "l2", title: "Tableau original signé", donor: "Léa, artiste", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600", startPrice: 80, currentBid: 220, topBidder: "Antoine K.", bids: 8, status: "live" },
  { id: "l3", title: "Cours de cuisine chef étoilé", donor: "Restaurant Le Clos", image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600", startPrice: 100, currentBid: 100, topBidder: "—", bids: 0, status: "next" },
  { id: "l4", title: "Panier gourmand artisanal", donor: "Ferme des Coteaux", image: "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=600", startPrice: 40, currentBid: 95, topBidder: "Julien M.", bids: 6, status: "closed", winner: "Julien Mercier" },
];

const cause = { name: "Association Petits Cœurs", tagline: "Soutien aux familles hospitalisées", raised: 635, goal: 1500 };

function Auction() {
  const { slug } = useParams({ from: "/events/$slug/auction" });
  const [lots, setLots] = useState(initial);
  const [seconds, setSeconds] = useState(184);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const bid = (id: string) => {
    setLots((prev) => prev.map((l) => l.id === id ? { ...l, currentBid: l.currentBid + 10, topBidder: "Vous", bids: l.bids + 1 } : l));
  };

  const raised = cause.raised + lots.filter((l) => l.status !== "next").reduce((sum, l) => sum + (l.currentBid - l.startPrice), 0);
  const percent = Math.min(100, Math.round((raised / cause.goal) * 100));
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Enchère live</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> LIVE
        </span>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/30 to-background" />
        <div className="relative px-4 py-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Heart className="h-3.5 w-3.5 text-primary" /> Enchère solidaire
          </div>
          <h1 className="mt-2 font-serif text-3xl leading-tight">Célébrer, puis offrir</h1>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            100 % des fonds pour <strong className="text-foreground">{cause.name}</strong> — {cause.tagline.toLowerCase()}.
          </p>
          <div className="mt-4 rounded-3xl bg-background/80 p-4 backdrop-blur">
            <div className="flex items-baseline justify-between">
              <p className="font-serif text-2xl">{raised} €</p>
              <p className="text-[11px] text-muted-foreground">/ objectif {cause.goal} €</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Users className="h-3 w-3" /> 47 invités participants · {percent}% de l'objectif
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">En cours</h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
            <Clock className="h-3 w-3" /> {mm}:{ss}
          </span>
        </div>
        <ul className="space-y-3">
          {lots.filter((l) => l.status === "live").map((l) => (
            <li key={l.id} className="overflow-hidden rounded-3xl border border-primary/40 bg-card shadow-sm">
              <div className="relative h-40 w-full overflow-hidden">
                <img src={l.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase text-primary-foreground">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
                </span>
                <div className="absolute inset-x-4 bottom-3 text-white">
                  <p className="font-serif text-lg leading-tight">{l.title}</p>
                  <p className="text-[11px] text-white/80">Offert par {l.donor}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Enchère actuelle</p>
                    <p className="font-serif text-2xl leading-none">{l.currentBid} €</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      <TrendingUp className="mr-0.5 inline h-3 w-3" /> {l.topBidder} · {l.bids} enchères
                    </p>
                  </div>
                  <button
                    onClick={() => bid(l.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-xs font-bold text-background hover:opacity-90"
                  >
                    <Gavel className="h-3.5 w-3.5" /> +10 €
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 pt-8">
        <h2 className="mb-3 font-serif text-lg">Bientôt</h2>
        <ul className="space-y-2">
          {lots.filter((l) => l.status === "next").map((l) => (
            <li key={l.id} className="flex gap-3 rounded-2xl border border-dashed border-border p-3">
              <img src={l.image} alt="" className="h-16 w-16 rounded-xl object-cover opacity-80" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Prochain lot</p>
                <p className="truncate font-serif text-[15px] leading-tight">{l.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Mise à partir · {l.startPrice} €</p>
              </div>
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 pt-8">
        <h2 className="mb-3 font-serif text-lg">Adjugés</h2>
        <ul className="space-y-2">
          {lots.filter((l) => l.status === "closed").map((l) => (
            <li key={l.id} className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <Trophy className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{l.title}</p>
                <p className="text-[11px] text-muted-foreground">Adjugé à {l.winner} · {l.currentBid} €</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/95 p-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="flex-1 text-xs">
            <p className="font-medium">Vos enchères sont un engagement</p>
            <p className="text-muted-foreground">Prélèvement post-événement · reçu fiscal envoyé</p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-xs font-bold text-primary-foreground">
            <Heart className="h-3.5 w-3.5" /> Faire un don libre
          </button>
        </div>
      </div>
    </div>
  );
}
