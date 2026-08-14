import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Users, GitBranch, Heart, Baby, Crown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/family-tree")({
  component: FamilyTree,
  head: () => ({
    meta: [
      { title: "Arbre généalogique · MaFeliza" },
      { name: "description", content: "Visualisez et enrichissez l'arbre des familles réunies pour l'événement." },
      { property: "og:title", content: "Arbre généalogique · MaFeliza" },
      { property: "og:description", content: "Deux familles, une seule histoire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Node = {
  id: string;
  name: string;
  role: string;
  side: "left" | "right" | "center";
  gen: 0 | 1 | 2 | 3;
  emoji: string;
  color: string;
};

const nodes: Node[] = [
  { id: "gm1", name: "Yvette", role: "Grand-mère mariée", side: "left", gen: 0, emoji: "👵", color: "bg-rose-50" },
  { id: "gp1", name: "Marcel †", role: "Grand-père mariée", side: "left", gen: 0, emoji: "🕊️", color: "bg-neutral-100" },
  { id: "gm2", name: "Simone", role: "Grand-mère marié", side: "right", gen: 0, emoji: "👵", color: "bg-amber-50" },
  { id: "gp2", name: "Robert", role: "Grand-père marié", side: "right", gen: 0, emoji: "👴", color: "bg-amber-50" },

  { id: "p1", name: "Michel", role: "Père de Sarah", side: "left", gen: 1, emoji: "🎩", color: "bg-rose-100" },
  { id: "p2", name: "Isabelle", role: "Mère de Sarah", side: "left", gen: 1, emoji: "💐", color: "bg-rose-100" },
  { id: "p3", name: "Alain", role: "Père de Thomas", side: "right", gen: 1, emoji: "🎩", color: "bg-amber-100" },
  { id: "p4", name: "Catherine", role: "Mère de Thomas", side: "right", gen: 1, emoji: "💐", color: "bg-amber-100" },

  { id: "s1", name: "Sarah", role: "Mariée", side: "left", gen: 2, emoji: "👰", color: "bg-primary/20" },
  { id: "s2", name: "Thomas", role: "Marié", side: "right", gen: 2, emoji: "🤵", color: "bg-primary/20" },

  { id: "sib1", name: "Antoine", role: "Frère de Sarah", side: "left", gen: 2, emoji: "🧑", color: "bg-rose-50" },
  { id: "sib2", name: "Léa", role: "Sœur de Thomas", side: "right", gen: 2, emoji: "👩", color: "bg-amber-50" },
];

function FamilyTree() {
  const { slug } = useParams({ from: "/events/$slug/family-tree" });
  const [selected, setSelected] = useState<string>("s1");
  const active = nodes.find((n) => n.id === selected)!;

  const stats = [
    { icon: Users, label: "Membres", value: "48" },
    { icon: GitBranch, label: "Générations", value: "4" },
    { icon: Heart, label: "Couples", value: "12" },
    { icon: Baby, label: "Enfants", value: "9" },
  ];

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Arbre généalogique</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Crown className="h-4 w-4 text-primary" />
        </button>
      </div>

      <section className="px-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <GitBranch className="h-3.5 w-3.5 text-primary" /> Deux familles, une histoire
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Bernard × Moreau</h1>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl border border-border/60 bg-card p-2.5 text-center">
                <Icon className="mx-auto h-3.5 w-3.5 text-primary" />
                <p className="mt-1 font-serif text-base leading-none">{s.value}</p>
                <p className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-accent/30 via-background to-background">
        <div className="scrollbar-none overflow-x-auto p-4">
          <div className="min-w-[560px] space-y-8">
            {[0, 1, 2].map((gen) => {
              const row = nodes.filter((n) => n.gen === gen);
              return (
                <div key={gen}>
                  <p className="mb-2 text-[9px] uppercase tracking-widest text-muted-foreground">
                    Génération {gen === 0 ? "1 · Grands-parents" : gen === 1 ? "2 · Parents" : "3 · Fratrie"}
                  </p>
                  <div className="flex items-stretch justify-around gap-2">
                    {row.map((n) => {
                      const on = selected === n.id;
                      return (
                        <button
                          key={n.id}
                          onClick={() => setSelected(n.id)}
                          className={`relative flex-1 min-w-[110px] rounded-2xl border-2 p-2.5 transition ${
                            on ? "border-primary bg-primary/5 shadow-lg" : `border-transparent ${n.color}`
                          }`}
                        >
                          <div className="text-2xl">{n.emoji}</div>
                          <p className="mt-1 truncate font-serif text-sm leading-tight">{n.name}</p>
                          <p className="mt-0.5 truncate text-[9px] text-muted-foreground">{n.role}</p>
                          {n.id === "s1" && (
                            <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px]">
                              💍
                            </span>
                          )}
                          {n.id === "s2" && (
                            <span className="absolute -top-1.5 -left-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px]">
                              💍
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-4 mt-4 rounded-3xl border border-border/60 bg-card p-4">
        <p className="text-[10px] uppercase tracking-wider text-primary">Fiche membre</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/40 text-3xl">
            {active.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-lg leading-tight">{active.name}</p>
            <p className="text-[11px] text-muted-foreground">{active.role}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">Présent le 12 juin</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">Table 3</span>
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="rounded-full bg-foreground py-2 text-xs font-bold text-background">Voir souvenirs</button>
          <button className="rounded-full border border-border/70 py-2 text-xs font-bold">Ajouter photo</button>
        </div>
      </section>

      <section className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Enrichir avec l'IA</p>
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Détecter les liens manquants</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          MaFeliza analyse les prénoms, dates de naissance et photos partagées pour proposer les branches manquantes.
        </p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Lancer l'analyse
        </button>
      </section>
    </div>
  );
}
