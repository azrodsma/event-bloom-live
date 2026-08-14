import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, UserPlus, Sparkles, Calendar, Heart, MessageCircle, MapPin, Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/friends")({
  component: Friends,
  head: () => ({
    meta: [
      { title: "Mes amis · MaFeliza" },
      { name: "description", content: "Votre carnet d'invités : cercles, souvenirs partagés, prochaines célébrations." },
      { property: "og:title", content: "Mes amis · MaFeliza" },
      { property: "og:description", content: "Le cercle qui compte." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Circle = "Tous" | "Famille" | "Proches" | "Amis" | "Collègues";

const circles: Circle[] = ["Tous", "Famille", "Proches", "Amis", "Collègues"];

type Friend = {
  name: string;
  handle: string;
  avatar: string;
  circle: Exclude<Circle, "Tous">;
  shared: number;
  lastEvent: string;
  city: string;
  affinity: number;
  starred?: boolean;
  nextEvent?: string;
};

const friends: Friend[] = [
  { name: "Léa Moreau", handle: "@lea.m", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", circle: "Proches", shared: 12, lastEvent: "Mariage Sarah & Thomas", city: "Lyon", affinity: 98, starred: true, nextEvent: "Anniv 12 sept." },
  { name: "Camille Vidal", handle: "@camillev", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200", circle: "Proches", shared: 15, lastEvent: "EVJF Léa", city: "Paris", affinity: 96, starred: true },
  { name: "Julien Roux", handle: "@ju.roux", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200", circle: "Amis", shared: 8, lastEvent: "30 ans de Clara", city: "Bordeaux", affinity: 84 },
  { name: "Grand-mère Yvette", handle: "famille", avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200", circle: "Famille", shared: 6, lastEvent: "Baptême Gabriel", city: "Annecy", affinity: 92, nextEvent: "Noël" },
  { name: "Anaïs Dubois", handle: "@anais.d", avatar: "https://images.unsplash.com/photo-1552083375-1447ce886485?w=200", circle: "Amis", shared: 5, lastEvent: "Mariage Sarah & Thomas", city: "Marseille", affinity: 78 },
  { name: "Thibault Mercier", handle: "@tibo", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200", circle: "Amis", shared: 9, lastEvent: "Anniv Clara", city: "Lyon", affinity: 81 },
  { name: "Marie Gérard", handle: "@marieg", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", circle: "Collègues", shared: 3, lastEvent: "Pot de départ Studio", city: "Paris", affinity: 62 },
  { name: "Papa & Maman", handle: "famille", avatar: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200", circle: "Famille", shared: 22, lastEvent: "Mariage Sarah & Thomas", city: "Nantes", affinity: 99, starred: true, nextEvent: "Fête des mères" },
];

const suggestions = [
  { name: "Sofia Ricci", mutual: 8, avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200", reason: "Rencontrée au mariage" },
  { name: "Antoine Barré", mutual: 5, avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200", reason: "12 amis en commun" },
  { name: "Emma & Paul", mutual: 3, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200", reason: "Vous ont invité·e" },
];

function Friends() {
  const [circle, setCircle] = useState<Circle>("Tous");
  const [query, setQuery] = useState("");

  const list = friends
    .filter((f) => (circle === "Tous" ? true : f.circle === circle))
    .filter((f) => (query ? f.name.toLowerCase().includes(query.toLowerCase()) : true))
    .sort((a, b) => b.affinity - a.affinity);

  const starred = friends.filter((f) => f.starred);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Amis</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background" aria-label="Inviter">
          <UserPlus className="h-4 w-4" />
        </button>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/40 to-transparent" />
        <div className="relative px-4 pb-5 pt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Heart className="h-3.5 w-3.5 text-primary" /> {friends.length} contacts · {friends.reduce((a, f) => a + f.shared, 0)} souvenirs partagés
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-tight">
            Le cercle<br />
            <span className="italic text-primary">qui compte</span>
          </h1>
        </div>

        <div className="relative px-4 pb-4">
          <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un ami…"
            className="w-full rounded-full border border-border/60 bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/60"
          />
        </div>
      </section>

      {starred.length > 0 && (
        <section className="px-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Favoris</p>
          <div className="-mx-1 mt-2 flex gap-3 overflow-x-auto px-1 pb-1">
            {starred.map((f) => (
              <div key={f.name} className="w-16 shrink-0 text-center">
                <div className="relative mx-auto w-fit">
                  <img src={f.avatar} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/40" />
                  <Star className="absolute -right-1 -top-1 h-4 w-4 fill-amber-400 text-amber-500" />
                </div>
                <p className="mt-1 line-clamp-1 text-[10px] font-semibold">{f.name.split(" ")[0]}</p>
              </div>
            ))}
            <button className="w-16 shrink-0 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-dashed border-border text-muted-foreground">
                <UserPlus className="h-4 w-4" />
              </span>
              <p className="mt-1 text-[10px] text-muted-foreground">Ajouter</p>
            </button>
          </div>
        </section>
      )}

      <div className="sticky top-14 z-10 -mx-1 mt-4 flex gap-1.5 overflow-x-auto border-b border-border/60 bg-background/95 px-5 py-2.5 backdrop-blur">
        {circles.map((c) => (
          <button
            key={c}
            onClick={() => setCircle(c)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
              circle === c ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-border/60">
        {list.map((f) => (
          <li key={f.name} className="flex items-center gap-3 px-4 py-3">
            <img src={f.avatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold">{f.name}</p>
                {f.starred && <Star className="h-3 w-3 fill-amber-400 text-amber-500" />}
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="h-2.5 w-2.5" /> {f.city} · {f.shared} souvenirs
              </p>
              {f.nextEvent && (
                <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-primary">
                  <Calendar className="h-2.5 w-2.5" /> {f.nextEvent}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-primary">
                <Sparkles className="h-2.5 w-2.5" /> {f.affinity}
              </div>
              <button className="grid h-7 w-7 place-items-center rounded-full bg-secondary" aria-label="Message">
                <MessageCircle className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-6 px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Suggestions</p>
        <ul className="mt-2 space-y-2">
          {suggestions.map((s) => (
            <li key={s.name} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
              <img src={s.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">{s.name}</p>
                <p className="text-[10px] text-muted-foreground">{s.reason} · {s.mutual} en commun</p>
              </div>
              <button className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground">
                <UserPlus className="mr-1 inline h-3 w-3" /> Ajouter
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-4 mt-8 flex items-center justify-between rounded-3xl bg-primary/5 p-5">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Score d'affinité</p>
          <p className="mt-1 font-serif text-lg leading-tight">Basé sur vos souvenirs partagés</p>
          <p className="text-[11px] text-muted-foreground">Photos, likes, événements, années de complicité</p>
        </div>
        <Sparkles className="h-6 w-6 text-primary" />
      </section>
    </div>
  );
}
