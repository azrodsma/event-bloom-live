import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Search, MapPin, Clock, Camera, CheckCircle2, Sparkles, Plus, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/lost-found")({
  component: LostFound,
  head: () => ({
    meta: [
      { title: "Objets perdus · Memento Live" },
      { name: "description", content: "Un objet oublié à la salle ? Signalez-le, retrouvez-le. Coordination sans stress." },
      { property: "og:title", content: "Objets perdus & retrouvés · Memento Live" },
      { property: "og:description", content: "Rien ne se perd, tout se retrouve." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Item = {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  location: string;
  time: string;
  reporter: string;
  status: "found" | "lost" | "returned";
  photo?: string;
  category: "vetement" | "bijou" | "tech" | "autre";
};

const items: Item[] = [
  {
    id: "i1",
    emoji: "💍",
    title: "Alliance en or rose",
    desc: "Gravée à l'intérieur (initiales L&M). Perdue pendant la piste de danse.",
    location: "Piste de danse",
    time: "il y a 32 min",
    reporter: "Léa Moreau",
    status: "lost",
    category: "bijou",
  },
  {
    id: "i2",
    emoji: "🧥",
    title: "Veste de costume bleu marine",
    desc: "Marque Sandro, taille 48. Trouvée sur une chaise près du bar.",
    location: "Bar principal",
    time: "il y a 1 h",
    reporter: "Thibault (staff)",
    status: "found",
    photo: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
    category: "vetement",
  },
  {
    id: "i3",
    emoji: "📱",
    title: "iPhone rose",
    desc: "Coque transparente avec fleurs séchées. Rendu à sa propriétaire.",
    location: "Vestiaire",
    time: "hier · 23 h 40",
    reporter: "Karim (staff)",
    status: "returned",
    category: "tech",
  },
  {
    id: "i4",
    emoji: "👜",
    title: "Pochette de soirée dorée",
    desc: "Contenant clés de voiture et un rouge à lèvres.",
    location: "Table 7",
    time: "il y a 15 min",
    reporter: "Anaïs Dubois",
    status: "found",
    photo: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
    category: "autre",
  },
  {
    id: "i5",
    emoji: "🧣",
    title: "Écharpe en soie ivoire",
    desc: "Motif floral, initiales brodées « M.G. » dans un coin.",
    location: "?",
    time: "il y a 2 h",
    reporter: "Marie Gérard",
    status: "lost",
    category: "vetement",
  },
];

const statusMeta = {
  lost: { label: "Perdu", tint: "bg-rose-50 text-rose-700 border-rose-100" },
  found: { label: "Trouvé", tint: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  returned: { label: "Rendu", tint: "bg-muted text-muted-foreground border-border" },
} as const;

const filters = [
  { id: "all", label: "Tout" },
  { id: "lost", label: "Perdus" },
  { id: "found", label: "Trouvés" },
  { id: "returned", label: "Rendus" },
] as const;

function LostFound() {
  const { slug } = useParams({ from: "/events/$slug/lost-found" });
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [q, setQ] = useState("");

  const filtered = items.filter((it) => {
    if (filter !== "all" && it.status !== filter) return false;
    if (q && !`${it.title} ${it.desc} ${it.location}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const counts = {
    lost: items.filter((i) => i.status === "lost").length,
    found: items.filter((i) => i.status === "found").length,
    returned: items.filter((i) => i.status === "returned").length,
  };

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Objets perdus</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Filtres">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-primary/10 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> {items.length} déclarations
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Rien ne se perd,<br />tout se retrouve</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Signalez un objet perdu ou trouvé — les invités concernés sont notifiés discrètement.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {(["lost", "found", "returned"] as const).map((k) => (
            <div key={k} className="rounded-2xl bg-card p-3 text-center ring-1 ring-border/60">
              <p className="font-serif text-2xl">{counts[k]}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{statusMeta[k].label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky top-14 z-10 space-y-3 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un objet, un lieu…"
            className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                filter === f.id ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-2.5 px-4 pt-4">
        {filtered.map((it) => {
          const sm = statusMeta[it.status];
          return (
            <li key={it.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
              <div className="flex gap-3 p-3.5">
                <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-secondary text-3xl">
                  {it.photo ? <img src={it.photo} alt="" className="h-full w-full object-cover" /> : it.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-1 text-sm font-semibold">{it.title}</p>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold ${sm.tint}`}>
                      {sm.label}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{it.desc}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {it.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {it.time}
                    </span>
                  </div>
                </div>
              </div>

              {it.status !== "returned" && (
                <div className="flex gap-2 border-t border-border/50 bg-secondary/30 p-2">
                  <button className="flex-1 rounded-full bg-background py-2 text-[11px] font-semibold ring-1 ring-border">
                    C'est à moi
                  </button>
                  <button className="flex-1 rounded-full bg-primary py-2 text-[11px] font-bold text-primary-foreground">
                    {it.status === "lost" ? "J'ai vu ça" : "Marquer rendu"}
                  </button>
                </div>
              )}
              {it.status === "returned" && (
                <div className="flex items-center gap-1.5 border-t border-border/50 bg-secondary/30 px-3 py-2 text-[10px] text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Restitué à {it.reporter}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="fixed bottom-24 left-1/2 z-30 -translate-x-1/2">
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow">
          <Plus className="h-4 w-4" /> Signaler un objet
        </button>
      </div>

      <div className="mx-4 mt-6 flex items-center gap-3 rounded-3xl bg-primary/5 p-4 text-[11px] text-muted-foreground">
        <Camera className="h-5 w-5 shrink-0 text-primary" />
        <p>Astuce : ajoutez une photo, cela triple les chances de retrouver le propriétaire.</p>
      </div>
    </div>
  );
}
