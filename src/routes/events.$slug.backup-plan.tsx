import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sun, Cloud, Umbrella, Snowflake, AlertTriangle, Check, Shield } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/backup-plan")({
  component: Backup,
  head: () => ({
    meta: [
      { title: "Plan B météo · Memento Live" },
      { name: "description", content: "Un plan de repli clair pour chaque scénario météo — briefez toute l'équipe en 30 secondes." },
      { property: "og:title", content: "Plan B · Memento Live" },
      { property: "og:description", content: "Sereins quoi qu'il arrive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Scenario = {
  id: "sun" | "clouds" | "rain" | "storm" | "cold";
  label: string;
  icon: typeof Sun;
  tint: string;
  probability: number;
  ceremony: string;
  cocktail: string;
  dinner: string;
  extras: string[];
  triggerBy: string;
};

const scenarios: Scenario[] = [
  {
    id: "sun", label: "Grand beau", icon: Sun, tint: "from-amber-100 to-primary/10", probability: 55,
    ceremony: "Chapelle du parc · 16h", cocktail: "Terrasse & pelouse · sunset", dinner: "Orangerie ouverte",
    extras: ["Éventails à l'accueil", "Fontaine à eau", "Ombrelles"], triggerBy: "≥ 24°C · sans pluie",
  },
  {
    id: "clouds", label: "Nuageux doux", icon: Cloud, tint: "from-sky-100 to-accent/40", probability: 25,
    ceremony: "Chapelle · idem", cocktail: "Terrasse couverte", dinner: "Orangerie",
    extras: ["Braseros extérieurs", "Plaids brodés"], triggerBy: "16–22°C · nuages",
  },
  {
    id: "rain", label: "Averse", icon: Umbrella, tint: "from-slate-100 to-primary/10", probability: 15,
    ceremony: "Salle des Colonnes · intérieur", cocktail: "Véranda vitrée", dinner: "Orangerie fermée",
    extras: ["30 parapluies bois", "Tapis absorbants entrée", "Vestiaire renforcé"], triggerBy: "Pluie > 2mm/h",
  },
  {
    id: "storm", label: "Orage", icon: AlertTriangle, tint: "from-rose-100 to-primary/20", probability: 4,
    ceremony: "Salle des Colonnes", cocktail: "Salon fumeur", dinner: "Orangerie · sans terrasse",
    extras: ["Groupe électrogène", "Feu d'artifice reporté 22h30", "Contact sécurité domaine"], triggerBy: "Alerte orange météo",
  },
  {
    id: "cold", label: "Froid mordant", icon: Snowflake, tint: "from-slate-100 to-sky-50", probability: 1,
    ceremony: "Chapelle chauffée", cocktail: "Salon cheminée", dinner: "Orangerie chauffage renforcé",
    extras: ["Vin chaud d'accueil", "Plaids sur les chaises", "Chaufferettes toilettes"], triggerBy: "< 8°C ressenti",
  },
];

function Backup() {
  const { slug } = useParams({ from: "/events/$slug/backup-plan" });
  const [active, setActive] = useState<Scenario["id"]>("clouds");
  const s = scenarios.find((x) => x.id === active)!;
  const Icon = s.icon;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Plan B</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Shield className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className={`relative overflow-hidden bg-gradient-to-b ${s.tint} px-4 pb-6 pt-6 transition`}>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Icon className="h-3.5 w-3.5 text-primary" /> Scénario actif
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">{s.label}</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Probabilité <span className="font-serif text-base text-foreground">{s.probability}%</span> · Déclencheur automatique : {s.triggerBy}
        </p>
        <div className="mt-4 rounded-2xl bg-background/70 p-3 backdrop-blur">
          <div className="flex items-baseline justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Confiance météo J-7</span>
            <span>{s.probability}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${s.probability}%` }} />
          </div>
        </div>
      </section>

      <div className="sticky top-14 z-10 bg-background/95 backdrop-blur">
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-3">
          {scenarios.map((sc) => {
            const I = sc.icon;
            const on = active === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setActive(sc.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  on ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                }`}
              >
                <I className="h-3.5 w-3.5" /> {sc.label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="space-y-3 px-4 pt-2">
        {[
          { label: "Cérémonie", value: s.ceremony },
          { label: "Cocktail", value: s.cocktail },
          { label: "Dîner", value: s.dinner },
        ].map((row) => (
          <div key={row.label} className="rounded-3xl border border-border/60 bg-card p-4">
            <p className="text-[10px] uppercase tracking-wider text-primary">{row.label}</p>
            <p className="mt-1 font-serif text-lg leading-tight">{row.value}</p>
          </div>
        ))}

        <div className="rounded-3xl border border-border/60 bg-card p-4">
          <p className="text-[10px] uppercase tracking-wider text-primary">Kit d'ajustement</p>
          <ul className="mt-2 space-y-1.5">
            {s.extras.map((e) => (
              <li key={e} className="flex items-center gap-2 text-[13px]">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                {e}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Décision J-1</p>
        <p className="mt-2 font-serif text-lg leading-tight">Verrouiller le scénario</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Une fois verrouillé, l'équipe (traiteur, DJ, coordinateur) reçoit une notification et met en place le bon plan.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button className="flex-1 rounded-full bg-foreground py-2.5 text-xs font-bold text-background">
            Verrouiller « {s.label} »
          </button>
          <button className="rounded-full border border-border/70 px-4 py-2.5 text-xs font-bold">
            Notifier
          </button>
        </div>
      </section>

      <div className="mx-4 mt-4 flex items-center gap-2 rounded-3xl bg-secondary/60 p-4 text-[11px] text-muted-foreground">
        <AlertTriangle className="h-4 w-4 shrink-0 text-primary" />
        <p>Un basculement automatique sera proposé 48h avant l'événement selon les prévisions officielles.</p>
      </div>
    </div>
  );
}
