import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Baby, Palette, Gamepad2, IceCream, Sparkles, Users, Clock, Heart } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/kids")({
  component: KidsCorner,
  head: () => ({
    meta: [
      { title: "Espace enfants · Memento Live" },
      { name: "description", content: "Activités, ateliers, animateurs et menus enfants — tout pour que les petits vivent aussi une journée magique." },
      { property: "og:title", content: "Espace enfants · Memento Live" },
      { property: "og:description", content: "Les enfants aussi vivent l'événement à fond." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface Kid {
  id: string;
  name: string;
  age: number;
  parents: string;
  avatar: string;
  needs: string[];
}

const kids: Kid[] = [
  { id: "k1", name: "Lila", age: 4, parents: "Camille & Julien", avatar: "https://i.pravatar.cc/64?img=1", needs: ["Sans gluten", "Sieste 14 h"] },
  { id: "k2", name: "Noé", age: 6, parents: "Nadia & Karim", avatar: "https://i.pravatar.cc/64?img=3", needs: [] },
  { id: "k3", name: "Alba", age: 2, parents: "Léa & Paul", avatar: "https://i.pravatar.cc/64?img=5", needs: ["Chaise haute"] },
  { id: "k4", name: "Tom", age: 8, parents: "Antoine & Sophie", avatar: "https://i.pravatar.cc/64?img=7", needs: [] },
  { id: "k5", name: "Iris", age: 5, parents: "Émilie & Paul", avatar: "https://i.pravatar.cc/64?img=9", needs: ["Végétarien"] },
];

interface Activity {
  id: string;
  time: string;
  title: string;
  desc: string;
  ages: string;
  icon: typeof Palette;
  color: string;
  spots?: string;
}

const activities: Activity[] = [
  {
    id: "a1",
    time: "15 h 30",
    title: "Atelier couronnes de fleurs",
    desc: "Fabriquer sa couronne avec fleurs séchées et rubans dorés.",
    ages: "3-8 ans",
    icon: Palette,
    color: "bg-primary/15 text-primary",
    spots: "12 places · 8 inscrits",
  },
  {
    id: "a2",
    time: "17 h 00",
    title: "Chasse aux trésors",
    desc: "Parcours dans les jardins avec cartes et énigmes.",
    ages: "5-12 ans",
    icon: Sparkles,
    color: "bg-accent/40 text-foreground",
    spots: "Illimité",
  },
  {
    id: "a3",
    time: "18 h 30",
    title: "Coin lecture & câlin",
    desc: "Livres, coussins et couvertures pour un moment doux.",
    ages: "0-6 ans",
    icon: Heart,
    color: "bg-secondary text-foreground",
  },
  {
    id: "a4",
    time: "19 h 30",
    title: "Buffet enfants & glaces",
    desc: "Menu adapté servi tôt, avec bar à glaces.",
    ages: "Tous",
    icon: IceCream,
    color: "bg-primary/15 text-primary",
  },
  {
    id: "a5",
    time: "21 h 00",
    title: "Cinéma dans la grange",
    desc: "Projection d'un dessin animé pendant que les grands dansent.",
    ages: "Tous",
    icon: Gamepad2,
    color: "bg-foreground text-background",
    spots: "Coussins & couvertures fournis",
  },
];

function KidsCorner() {
  const { slug } = useParams({ from: "/events/$slug/kids" });
  const [registered, setRegistered] = useState<Record<string, boolean>>({ a1: true, a4: true });

  function toggle(id: string) {
    setRegistered((r) => ({ ...r, [id]: !r[id] }));
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Espace enfants</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden px-4 pb-6 pt-6">
        <div
          className="absolute inset-0 opacity-70"
          style={{ background: "linear-gradient(135deg, #FFF8F4 0%, #F5C6D0 60%, #FCE1B7 100%)" }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/70">
            <Baby className="h-3.5 w-3.5 text-primary" /> Journée des petits
          </div>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-foreground">
            Une aventure magique<br />pour les enfants ✨
          </h1>
          <p className="mt-3 text-sm text-foreground/70">
            Ateliers créatifs, chasses au trésor, coin lecture et cinéma étoilé — deux animateurs professionnels toute la journée.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-background/80 p-3 text-center">
              <p className="font-serif text-xl leading-none">{kids.length}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Enfants</p>
            </div>
            <div className="rounded-2xl bg-background/80 p-3 text-center">
              <p className="font-serif text-xl leading-none text-primary">{activities.length}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Activités</p>
            </div>
            <div className="rounded-2xl bg-background/80 p-3 text-center">
              <p className="font-serif text-xl leading-none">2</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Animateurs</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">Programme du jour</h2>
          <span className="text-[11px] text-muted-foreground">15 h → 22 h</span>
        </div>
        <ol className="space-y-3">
          {activities.map((a) => {
            const Icon = a.icon;
            const reg = !!registered[a.id];
            return (
              <li key={a.id} className="flex gap-3 rounded-3xl border border-border/60 bg-card p-4">
                <div className="flex flex-col items-center gap-2 pr-3 border-r border-border/60">
                  <span className={`grid h-11 w-11 place-items-center rounded-2xl ${a.color}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-serif text-xs font-bold">{a.time}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-base leading-tight">{a.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{a.desc}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">
                      <Users className="mr-1 inline h-2.5 w-2.5" /> {a.ages}
                    </span>
                    {a.spots && (
                      <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-medium ring-1 ring-border">
                        {a.spots}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggle(a.id)}
                    className={`mt-3 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                      reg ? "bg-primary/10 text-primary" : "bg-foreground text-background"
                    }`}
                  >
                    {reg ? "✓ Inscrit" : "Inscrire un enfant"}
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="px-4 pt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">Enfants attendus</h2>
          <span className="text-[11px] text-muted-foreground">{kids.length} inscrits</span>
        </div>
        <ul className="space-y-2">
          {kids.map((k) => (
            <li key={k.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
              <img src={k.avatar} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium">{k.name}</p>
                  <span className="text-[10px] text-muted-foreground">{k.age} ans</span>
                </div>
                <p className="truncate text-[11px] text-muted-foreground">Parents · {k.parents}</p>
                {k.needs.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {k.needs.map((n) => (
                      <span key={n} className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
                        {n}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-4 mt-8 rounded-3xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
          <Clock className="h-3.5 w-3.5" /> Espace repos
        </div>
        <p className="mt-2 font-serif text-lg">Une salle calme est disponible</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Chambre au rez-de-chaussée équipée de lits parapluies, table à langer et lumières tamisées. Ouverte toute la journée.
        </p>
      </section>
    </div>
  );
}
