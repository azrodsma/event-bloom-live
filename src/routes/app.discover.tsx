import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Calendar, Search, Sparkles, Filter, Users, Ticket, Heart } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/discover")({
  component: Discover,
  head: () => ({
    meta: [
      { title: "Découvrir · Memento Live" },
      { name: "description", content: "Événements publics ouverts près de chez vous : concerts, expos, festivals privés ouverts." },
      { property: "og:title", content: "Découvrir · Memento Live" },
      { property: "og:description", content: "Autour de vous, en ce moment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Category = "all" | "musique" | "art" | "gastro" | "solidaire" | "mode";

const categories: { id: Category; label: string; emoji: string }[] = [
  { id: "all", label: "Tout", emoji: "✨" },
  { id: "musique", label: "Musique", emoji: "🎵" },
  { id: "art", label: "Art", emoji: "🎨" },
  { id: "gastro", label: "Gastronomie", emoji: "🍷" },
  { id: "solidaire", label: "Solidaire", emoji: "💛" },
  { id: "mode", label: "Mode", emoji: "👗" },
];

type Public = {
  id: string;
  title: string;
  date: string;
  when: string;
  location: string;
  distance: string;
  cover: string;
  host: string;
  attending: number;
  price: string;
  cat: Category;
  live?: boolean;
  friends?: number;
};

const featured: Public = {
  id: "f1",
  title: "Nuit blanche des créateurs",
  date: "Sam. 27 juil.",
  when: "20 h 00 → 02 h 00",
  location: "Marais, Paris 4e",
  distance: "1,2 km",
  cover: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200",
  host: "Collectif Aura",
  attending: 342,
  price: "Entrée libre",
  cat: "art",
  live: true,
  friends: 8,
};

const events: Public[] = [
  {
    id: "e1",
    title: "Concert acoustique — Roof top",
    date: "Ven. 26 juil.",
    when: "19 h 30",
    location: "Belleville",
    distance: "3,4 km",
    cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",
    host: "Chez Marius",
    attending: 87,
    price: "15 €",
    cat: "musique",
    friends: 3,
  },
  {
    id: "e2",
    title: "Vernissage · Cyanotypes",
    date: "Dim. 28 juil.",
    when: "11 h 00",
    location: "Galerie Odéon",
    distance: "5,1 km",
    cover: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
    host: "Iris Bellamy",
    attending: 42,
    price: "Gratuit",
    cat: "art",
  },
  {
    id: "e3",
    title: "Diner-concert solidaire",
    date: "Ven. 26 juil.",
    when: "20 h 00",
    location: "Cantine du 11e",
    distance: "2,0 km",
    cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    host: "Asso Refuge",
    attending: 128,
    price: "28 €",
    cat: "solidaire",
    friends: 5,
  },
  {
    id: "e4",
    title: "Défilé mode responsable",
    date: "Sam. 27 juil.",
    when: "18 h 00",
    location: "Le Carreau du Temple",
    distance: "1,7 km",
    cover: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
    host: "Studio Loop",
    attending: 210,
    price: "12 €",
    cat: "mode",
  },
];

const collections = [
  { id: "c1", title: "Ce weekend", emoji: "🎉", count: 42, color: "from-primary/20 to-primary/5" },
  { id: "c2", title: "Gratuit", emoji: "🎁", count: 28, color: "from-emerald-100 to-emerald-50" },
  { id: "c3", title: "En plein air", emoji: "🌿", count: 34, color: "from-sky-100 to-sky-50" },
  { id: "c4", title: "Après 22 h", emoji: "🌙", count: 19, color: "from-violet-100 to-violet-50" },
];

function Discover() {
  const [cat, setCat] = useState<Category>("all");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSaved((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const list = events.filter((e) => cat === "all" || e.cat === cat);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Découvrir</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Filtres">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-primary/10 to-transparent px-4 pb-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" /> Paris · 3 km alentour
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Autour de vous,<br />en ce moment</h1>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Concert, expo, dîner…"
            className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </section>

      <div className="sticky top-14 z-10 -mx-1 flex gap-1.5 overflow-x-auto border-b border-border/60 bg-background/95 px-5 py-3 backdrop-blur">
        {categories.map((c) => {
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                active ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
              }`}
            >
              <span className="mr-1">{c.emoji}</span>
              {c.label}
            </button>
          );
        })}
      </div>

      <section className="px-4 pt-4">
        <article className="relative overflow-hidden rounded-3xl bg-card">
          <img src={featured.cover} alt="" className="h-64 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {featured.live && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase text-primary-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> Live
            </span>
          )}
          <button
            onClick={() => toggle(featured.id)}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur"
            aria-label="Sauvegarder"
          >
            <Heart className={`h-4 w-4 ${saved.has(featured.id) ? "fill-primary text-primary" : "text-foreground"}`} />
          </button>
          <div className="absolute inset-x-4 bottom-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">À la une</p>
            <p className="mt-1 font-serif text-2xl leading-tight">{featured.title}</p>
            <p className="mt-1 text-[11px] text-white/85">
              {featured.date} · {featured.when} · {featured.location}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow">
                Rejoindre
              </button>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                <Users className="h-3 w-3" /> {featured.attending} · {featured.friends} amis
              </span>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-6 -mx-1 flex gap-2 overflow-x-auto px-5 pb-1">
        {collections.map((c) => (
          <button
            key={c.id}
            className={`shrink-0 rounded-2xl bg-gradient-to-br ${c.color} p-3 text-left`}
          >
            <p className="text-2xl">{c.emoji}</p>
            <p className="mt-1 text-xs font-bold">{c.title}</p>
            <p className="text-[10px] text-muted-foreground">{c.count} événements</p>
          </button>
        ))}
      </section>

      <section className="mt-6 px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {list.length} événements près de vous
        </p>
        <ul className="mt-3 space-y-3">
          {list.map((e) => {
            const isFav = saved.has(e.id);
            return (
              <li key={e.id} className="flex gap-3 rounded-3xl border border-border/60 bg-card p-3">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl">
                  <img src={e.cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <button
                    onClick={() => toggle(e.id)}
                    className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 backdrop-blur"
                    aria-label="Favori"
                  >
                    <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-primary text-primary" : "text-foreground"}`} />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                    <Calendar className="h-3 w-3" /> {e.date} · {e.when}
                  </div>
                  <p className="mt-0.5 line-clamp-2 font-serif text-base leading-tight">{e.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    <MapPin className="mr-0.5 inline h-2.5 w-2.5" /> {e.location} · {e.distance}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                      <Users className="h-2.5 w-2.5" /> {e.attending}
                      {e.friends ? ` · ${e.friends} amis` : ""}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold">
                      <Ticket className="h-2.5 w-2.5" /> {e.price}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mx-4 mt-8 rounded-3xl bg-primary/5 p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Vous organisez ?
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Ouvrez votre événement au public</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Choisissez qui peut voir votre événement et gagnez en visibilité auprès de la communauté locale.
        </p>
        <button className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background">Rendre public</button>
      </div>
    </div>
  );
}
