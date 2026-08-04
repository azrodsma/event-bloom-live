import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Leaf, Sparkles, Recycle, Utensils, Car, Zap, ChevronRight, TreeDeciduous } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/eco")({
  component: Eco,
  head: () => ({
    meta: [
      { title: "Impact écologique · MaFeliza" },
      { name: "description", content: "Mesurez et réduisez l'empreinte carbone de votre événement." },
      { property: "og:title", content: "Impact écologique · MaFeliza" },
      { property: "og:description", content: "Célébrer, en douceur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Category = { id: string; label: string; icon: typeof Car; value: number; trend: number; color: string; tips: string[] };

const cats: Category[] = [
  {
    id: "transport",
    label: "Transports",
    icon: Car,
    value: 620,
    trend: -12,
    color: "bg-primary",
    tips: ["Organiser un covoiturage groupé (–35 %)", "Proposer une navette collective", "Encourager le train pour les invités éloignés"],
  },
  {
    id: "food",
    label: "Repas",
    icon: Utensils,
    value: 340,
    trend: -8,
    color: "bg-emerald-500",
    tips: ["50 % de plats végétariens (–120 kg)", "Producteurs locaux (< 100 km)", "Anticiper les portions pour éviter le gaspillage"],
  },
  {
    id: "energy",
    label: "Énergie & lumière",
    icon: Zap,
    value: 85,
    trend: -3,
    color: "bg-amber-500",
    tips: ["Guirlandes LED basse conso", "Ambiance bougies après 22 h", "Coupure automatique du bar à minuit"],
  },
  {
    id: "waste",
    label: "Déchets",
    icon: Recycle,
    value: 40,
    trend: -6,
    color: "bg-sky-500",
    tips: ["Vaisselle réutilisable louée (–80 %)", "Tri sélectif sur zone", "Compost des restes alimentaires"],
  },
];

const total = cats.reduce((s, c) => s + c.value, 0);
const trend = Math.round(cats.reduce((s, c) => s + c.trend, 0) / cats.length);

const offsets = [
  {
    id: "o1",
    emoji: "🌳",
    title: "Planter 42 arbres",
    partner: "Reforest'Action",
    price: 84,
    desc: "Une forêt en Occitanie, chaque invité y aura son arbre nommé.",
    recommended: true,
  },
  {
    id: "o2",
    emoji: "🌊",
    title: "Protection océans",
    partner: "Surfrider Foundation",
    price: 45,
    desc: "Nettoyage de 1,2 tonne de déchets marins.",
  },
  {
    id: "o3",
    emoji: "🐝",
    title: "Sauver 3 ruches",
    partner: "Un toit pour les abeilles",
    price: 60,
    desc: "Parrainage annuel d'un rucher en Provence.",
  },
];

const commitments = [
  { done: true, label: "Traiteur bio & local sélectionné" },
  { done: true, label: "Faire-part imprimé sur papier recyclé" },
  { done: false, label: "Confirmer covoiturage avec > 50 % des invités" },
  { done: false, label: "Contrat de location vaisselle signé" },
];

function Eco() {
  const { slug } = useParams({ from: "/events/$slug/eco" });
  const [selected, setSelected] = useState<string>("transport");
  const active = cats.find((c) => c.id === selected)!;
  const score = Math.max(0, Math.min(100, 100 - Math.round(total / 20)));

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Impact écologique</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/60 via-accent/30 to-transparent" />
        <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="relative px-4 pb-6 pt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Leaf className="h-3.5 w-3.5 text-emerald-600" /> Estimation en temps réel
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-tight">
            Célébrer,<br />
            <span className="italic text-primary">en douceur</span>
          </h1>

          <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-4 rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur">
            <div className="relative grid h-24 w-24 place-items-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                <circle cx="50" cy="50" r="42" strokeWidth="10" className="fill-none stroke-secondary" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="10"
                  strokeLinecap="round"
                  className="fill-none stroke-emerald-500"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - score / 100)}
                />
              </svg>
              <div className="text-center">
                <p className="font-serif text-2xl leading-none">{score}</p>
                <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Éco-score</p>
              </div>
            </div>
            <div className="min-w-0">
              <p className="font-serif text-xl leading-tight">{total} kg CO₂e</p>
              <p className="text-[11px] text-muted-foreground">
                Total estimé · <span className="font-semibold text-emerald-700">{trend}%</span> vs événement standard
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Équivaut à environ {Math.round(total / 5)} trajets Paris–Lyon en voiture.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-2 px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Par catégorie</p>
        <div className="mt-3 space-y-2">
          {cats.map((c) => {
            const Icon = c.icon;
            const pct = (c.value / total) * 100;
            const active = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                  active ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${c.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{c.label}</p>
                    <p className="text-xs">
                      <span className="font-bold">{c.value}</span>{" "}
                      <span className="text-[10px] text-muted-foreground">kg</span>
                    </p>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-[10px] font-semibold text-emerald-700">
                    ↓ {Math.abs(c.trend)}% vs moyenne
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-3xl border border-border/60 bg-card p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Leviers pour {active.label.toLowerCase()}
          </div>
          <ul className="mt-3 space-y-2">
            {active.tips.map((t) => (
              <li key={t} className="flex items-start gap-2 text-[12px]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 px-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          <TreeDeciduous className="h-3.5 w-3.5" /> Compensation carbone
        </div>
        <p className="mt-2 font-serif text-2xl leading-tight">Aller plus loin, ensemble</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Financez un projet vérifié pour compenser les émissions restantes.
        </p>

        <ul className="mt-4 space-y-2">
          {offsets.map((o) => (
            <li
              key={o.id}
              className={`overflow-hidden rounded-3xl border ${o.recommended ? "border-primary" : "border-border/60"} bg-card`}
            >
              <div className="flex items-start gap-3 p-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-3xl">{o.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold">{o.title}</p>
                    {o.recommended && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                        Recommandé
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">via {o.partner}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{o.desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 bg-secondary/30 px-4 py-2.5">
                <span className="font-serif text-lg">{o.price} €</span>
                <button className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white">
                  Contribuer <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-4 mt-8 rounded-3xl bg-card p-4 ring-1 ring-border/60">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Vos engagements</p>
        <ul className="mt-3 space-y-2">
          {commitments.map((c) => (
            <li key={c.label} className="flex items-center gap-2 text-[12px]">
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-white ${
                  c.done ? "bg-emerald-500" : "bg-secondary text-muted-foreground"
                }`}
              >
                {c.done ? "✓" : ""}
              </span>
              <span className={c.done ? "line-through text-muted-foreground" : ""}>{c.label}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
