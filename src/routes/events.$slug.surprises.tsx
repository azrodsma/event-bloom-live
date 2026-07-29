import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Gift, Sparkles, Users, Lock, Check, Eye } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/surprises")({
  component: Surprises,
  head: () => ({
    meta: [
      { title: "Surprises · Memento Live" },
      { name: "description", content: "Coordonnez les surprises pour les mariés en toute discrétion : flashmob, vidéo, chorale, cadeau collectif." },
      { property: "og:title", content: "Surprises · Memento Live" },
      { property: "og:description", content: "Ce que les hôtes ne doivent surtout pas voir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Surprise = {
  id: string;
  title: string;
  lead: string;
  when: string;
  contributors: number;
  needed: number;
  status: "en préparation" | "prêt" | "recrutement";
  visibility: "témoins" | "famille" | "tous invités";
  emoji: string;
  tasks: { label: string; done: boolean }[];
};

const surprises: Surprise[] = [
  {
    id: "s1",
    title: "Flashmob sur l'entrée en salle",
    lead: "Julie (témoin)",
    when: "Samedi 21h35",
    contributors: 18,
    needed: 24,
    status: "recrutement",
    visibility: "tous invités",
    emoji: "💃",
    tasks: [
      { label: "Chorégraphie envoyée", done: true },
      { label: "Playlist finalisée", done: true },
      { label: "Répétition Zoom vendredi 20h", done: false },
      { label: "Placement piste briefé au DJ", done: false },
    ],
  },
  {
    id: "s2",
    title: "Vidéo montage souvenirs",
    lead: "Antoine (frère)",
    when: "Samedi 22h15",
    contributors: 32,
    needed: 32,
    status: "prêt",
    visibility: "famille",
    emoji: "🎬",
    tasks: [
      { label: "Rushes reçus (32/32)", done: true },
      { label: "Musique droits validés", done: true },
      { label: "Test projecteur J-1", done: true },
    ],
  },
  {
    id: "s3",
    title: "Chorale des cousins", 
    lead: "Camille",
    when: "Cérémonie · sortie",
    contributors: 6,
    needed: 6,
    status: "prêt",
    visibility: "témoins",
    emoji: "🎤",
    tasks: [
      { label: "Partition partagée", done: true },
      { label: "Répétition dimanche", done: true },
      { label: "Micro cravate loué", done: true },
    ],
  },
  {
    id: "s4",
    title: "Cadeau collectif · voyage de noces",
    lead: "Léa",
    when: "Remis à minuit",
    contributors: 47,
    needed: 60,
    status: "en préparation",
    visibility: "tous invités",
    emoji: "🎁",
    tasks: [
      { label: "Cagnotte externe créée (Leetchi)", done: true },
      { label: "Objectif 3 000 € · 1 875 € collectés", done: false },
      { label: "Emballage & carte", done: false },
    ],
  },
];

const statusStyle = {
  prêt: "bg-emerald-50 text-emerald-700",
  "en préparation": "bg-amber-50 text-amber-700",
  recrutement: "bg-primary/10 text-primary",
} as const;

function Surprises() {
  const { slug } = useParams({ from: "/events/$slug/surprises" });
  const [items, setItems] = useState(surprises);

  const toggle = (sid: string, idx: number) =>
    setItems((prev) =>
      prev.map((s) =>
        s.id === sid ? { ...s, tasks: s.tasks.map((t, i) => (i === idx ? { ...t, done: !t.done } : t)) } : s
      )
    );

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Surprises</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Lock className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-foreground via-foreground/95 to-primary/70 px-4 pb-6 pt-8 text-background">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-background/70">
          <Eye className="h-3.5 w-3.5" /> Espace masqué aux hôtes
        </div>
        <h1 className="mt-3 font-serif text-3xl leading-tight">Ce qu'ils ne<br />doivent <em className="not-italic text-primary">surtout</em> pas voir</h1>
        <p className="mt-2 max-w-md text-sm text-background/80">
          Chaque surprise est chiffrée et invisible dans le fil, l'agenda et les notifications des mariés.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-background/10 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">4</p>
            <p className="text-[10px] uppercase tracking-wider text-background/60">Surprises</p>
          </div>
          <div className="rounded-2xl bg-background/10 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none text-primary">103</p>
            <p className="text-[10px] uppercase tracking-wider text-background/60">Complices</p>
          </div>
          <div className="rounded-2xl bg-background/10 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">2</p>
            <p className="text-[10px] uppercase tracking-wider text-background/60">Prêtes</p>
          </div>
        </div>
      </section>

      <ul className="space-y-4 px-4 pt-4">
        {items.map((s) => {
          const percent = Math.round((s.contributors / s.needed) * 100);
          const doneTasks = s.tasks.filter((t) => t.done).length;
          return (
            <li key={s.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
              <div className="flex items-start gap-3 border-b border-border/60 p-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/40 text-2xl">
                  {s.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-serif text-[15px] leading-tight">{s.title}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${statusStyle[s.status]}`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Pilote · <span className="text-foreground">{s.lead}</span> · {s.when}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Lock className="h-3 w-3" /> Visible : {s.visibility}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <div className="flex items-baseline justify-between">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      <Users className="mr-1 inline h-3 w-3" /> Complices
                    </p>
                    <p className="text-[11px]">
                      <span className="font-serif text-base">{s.contributors}</span>
                      <span className="text-muted-foreground">/{s.needed}</span>
                    </p>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${percent}%` }} />
                  </div>
                </div>

                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Check-list · {doneTasks}/{s.tasks.length}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {s.tasks.map((t, i) => (
                    <li key={i}>
                      <button
                        onClick={() => toggle(s.id, i)}
                        className="flex w-full items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2 text-left"
                      >
                        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${t.done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>
                          {t.done && <Check className="h-3 w-3" />}
                        </span>
                        <span className={`flex-1 text-[12px] ${t.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {t.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <button className="mt-4 w-full rounded-full bg-foreground py-2.5 text-xs font-bold text-background">
                  Rejoindre les complices
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Créer une surprise</p>
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Une idée à orchestrer ?</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Choisissez qui peut voir, invitez les complices, et laissez Memento verrouiller le secret jusqu'au jour J.</p>
        <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          <Gift className="h-3.5 w-3.5" /> Nouvelle surprise
        </button>
      </section>
    </div>
  );
}
