import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Heart, Flower2, Play, Pause, Feather, Plus, Candy } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/tribute")({
  component: Tribute,
  head: () => ({
    meta: [
      { title: "Hommage aux absents · Memento Live" },
      { name: "description", content: "Un espace tendre pour honorer ceux qui n'ont pas pu être là. Photos, mots et vocaux." },
      { property: "og:title", content: "Hommage aux absents · Memento Live" },
      { property: "og:description", content: "Présents dans nos cœurs." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Person = {
  id: string;
  name: string;
  relation: string;
  years?: string;
  photo: string;
  quote: string;
  memory: string;
  reason: "memoriam" | "distance" | "health";
  candlesLit: number;
  hasAudio?: boolean;
  audioLabel?: string;
};

const people: Person[] = [
  {
    id: "p1",
    name: "Grand-père Louis",
    relation: "Grand-père de la mariée",
    years: "1932 – 2021",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600",
    quote: "Aime, ris, et danse toujours plus fort que ce que la vie te demande.",
    memory:
      "Il aurait dansé le premier ce soir, sa canne à la main, en fredonnant du Charles Trenet. On garde sa chaise vide au centre de la table d'honneur.",
    reason: "memoriam",
    candlesLit: 42,
    hasAudio: true,
    audioLabel: "Enregistrement 1992 · discours d'anniversaire",
  },
  {
    id: "p2",
    name: "Mamie Rose",
    relation: "Arrière-grand-mère",
    years: "1928 – 2019",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600",
    quote: "Ma petite, l'amour ne se dit pas — il se prouve tous les matins.",
    memory:
      "Elle nous a laissé sa recette de pain d'épices. Chaque invité en trouvera une part sur sa serviette ce soir.",
    reason: "memoriam",
    candlesLit: 28,
  },
  {
    id: "p3",
    name: "Cousin Théo",
    relation: "Cousin du marié · Australie",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600",
    quote: "Depuis Sydney, je lève un verre à 4 h du matin — je suis avec vous.",
    memory: "Décalage horaire oblige, il suivra en live depuis un petit bar de Bondi Beach.",
    reason: "distance",
    candlesLit: 12,
    hasAudio: true,
    audioLabel: "Message vidéo · 42 s",
  },
  {
    id: "p4",
    name: "Tante Suzanne",
    relation: "Tante de la mariée",
    photo: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=600",
    quote: "Je suis avec vous en pensées, prenez soin l'un de l'autre.",
    memory: "Convalescence à l'hôpital — un lien live privé lui sera envoyé pour la cérémonie.",
    reason: "health",
    candlesLit: 8,
  },
];

const reasonMeta = {
  memoriam: { label: "En mémoire", tint: "bg-primary/10 text-primary", icon: Feather },
  distance: { label: "Loin ce soir", tint: "bg-sky-50 text-sky-700", icon: Sparkles },
  health: { label: "Rétablissement", tint: "bg-emerald-50 text-emerald-700", icon: Heart },
} as const;

function Tribute() {
  const { slug } = useParams({ from: "/events/$slug/tribute" });
  const [candles, setCandles] = useState<Record<string, number>>(() =>
    Object.fromEntries(people.map((p) => [p.id, p.candlesLit])),
  );
  const [lit, setLit] = useState<Set<string>>(new Set());
  const [playing, setPlaying] = useState<string | null>(null);

  const light = (id: string) => {
    if (lit.has(id)) return;
    setLit((s) => new Set(s).add(id));
    setCandles((c) => ({ ...c, [id]: c[id] + 1 }));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Hommages</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-accent/30 to-background" />
        <div className="absolute -left-10 top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative px-4 py-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white shadow-glow">
            <Flower2 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-5 font-serif text-3xl leading-tight">
            Présents<br />dans nos cœurs
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
            Un espace tendre pour honorer celles et ceux qui n'ont pas pu être là ce soir.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur">
            <Candy className="h-3.5 w-3.5 text-primary" />
            {Object.values(candles).reduce((a, b) => a + b, 0)} bougies allumées par les invités
          </div>
        </div>
      </section>

      <ul className="space-y-4 px-4 pt-4">
        {people.map((p) => {
          const meta = reasonMeta[p.reason];
          const Icon = meta.icon;
          const isLit = lit.has(p.id);
          const isPlaying = playing === p.id;
          return (
            <li key={p.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
              <div className="relative h-40 w-full overflow-hidden">
                <img src={p.photo} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold backdrop-blur ${meta.tint}`}>
                  <Icon className="h-3 w-3" /> {meta.label}
                </span>
                <div className="absolute inset-x-4 bottom-3 text-white">
                  <p className="font-serif text-xl leading-tight">{p.name}</p>
                  <p className="text-[11px] text-white/80">
                    {p.relation}
                    {p.years ? ` · ${p.years}` : ""}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <blockquote className="border-l-2 border-primary/40 pl-3 font-serif text-[13px] italic leading-relaxed text-foreground">
                  « {p.quote} »
                </blockquote>
                <p className="mt-3 text-[12px] text-muted-foreground">{p.memory}</p>

                {p.hasAudio && (
                  <button
                    onClick={() => setPlaying(isPlaying ? null : p.id)}
                    className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-secondary p-2.5"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 pl-0.5" />}
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-end gap-0.5">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <span
                            key={i}
                            className="w-1 rounded-full bg-primary/70"
                            style={{ height: `${4 + Math.sin(i + p.id.length) * 6 + (i % 3) * 4}px` }}
                          />
                        ))}
                      </div>
                      <p className="mt-1 truncate text-[10px] text-muted-foreground">{p.audioLabel}</p>
                    </div>
                  </button>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => light(p.id)}
                    disabled={isLit}
                    className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-bold transition-all ${
                      isLit ? "bg-primary/10 text-primary" : "bg-foreground text-background hover:opacity-90"
                    }`}
                  >
                    <Candy className={`h-3.5 w-3.5 ${isLit ? "animate-pulse" : ""}`} />
                    {isLit ? "Bougie allumée" : "Allumer une bougie"}
                  </button>
                  <span className="rounded-full bg-secondary px-3 py-2.5 text-[11px] font-bold">
                    🕯️ {candles[p.id]}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mx-4 mt-6 rounded-3xl border border-dashed border-border p-5 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary">
          <Plus className="h-5 w-5 text-primary" />
        </span>
        <p className="mt-3 font-serif text-lg">Ajouter un hommage</p>
        <p className="mx-auto mt-1 max-w-xs text-[11px] text-muted-foreground">
          Une photo, une citation, un souvenir tendre — modéré par les mariés avant publication.
        </p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Proposer un hommage
        </button>
      </section>

      <div className="mx-4 mt-4 flex items-center gap-2 rounded-3xl bg-primary/5 p-4 text-[11px] text-muted-foreground">
        <Feather className="h-4 w-4 shrink-0 text-primary" />
        <p>Un moment de recueillement sera partagé à 20 h 45, avant le dîner.</p>
      </div>
    </div>
  );
}
