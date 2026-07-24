import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Wallet, Camera, Utensils, Music, Flower, Sparkles, Church, Car, MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/budget")({
  component: Budget,
  head: () => ({
    meta: [
      { title: "Budget · Memento Live" },
      { name: "description", content: "Suivez chaque dépense de votre événement, catégorie par catégorie, avec un budget total transparent." },
      { property: "og:title", content: "Budget de l'événement · Memento Live" },
      { property: "og:description", content: "Un suivi budgétaire clair pour votre événement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Cat = "Lieu" | "Traiteur" | "Prestataires" | "Fleurs & Déco" | "Musique" | "Tenues" | "Transport" | "Divers";

interface Line {
  id: string;
  label: string;
  category: Cat;
  planned: number;
  spent: number;
  status: "Payé" | "Acompte" | "À prévoir";
}

const catMeta: Record<Cat, { icon: typeof Camera; color: string }> = {
  Lieu: { icon: Church, color: "bg-primary/15 text-primary" },
  Traiteur: { icon: Utensils, color: "bg-accent/30 text-foreground" },
  Prestataires: { icon: Camera, color: "bg-secondary text-foreground" },
  "Fleurs & Déco": { icon: Flower, color: "bg-primary/10 text-primary" },
  Musique: { icon: Music, color: "bg-accent/40 text-foreground" },
  Tenues: { icon: Sparkles, color: "bg-primary/20 text-primary" },
  Transport: { icon: Car, color: "bg-muted text-foreground" },
  Divers: { icon: MoreHorizontal, color: "bg-secondary text-muted-foreground" },
};

const seed: Line[] = [
  { id: "b1", label: "Domaine des Oliviers", category: "Lieu", planned: 8500, spent: 8500, status: "Payé" },
  { id: "b2", label: "Traiteur Riviera", category: "Traiteur", planned: 12000, spent: 3600, status: "Acompte" },
  { id: "b3", label: "Photographe Studio Lumen", category: "Prestataires", planned: 3200, spent: 1600, status: "Acompte" },
  { id: "b4", label: "Vidéaste Golden Hour", category: "Prestataires", planned: 2400, spent: 800, status: "Acompte" },
  { id: "b5", label: "DJ Aurélien Kass", category: "Musique", planned: 1500, spent: 500, status: "Acompte" },
  { id: "b6", label: "Fleuriste Rose & Pivoine", category: "Fleurs & Déco", planned: 2200, spent: 0, status: "À prévoir" },
  { id: "b7", label: "Robe & Costumes", category: "Tenues", planned: 3800, spent: 3800, status: "Payé" },
  { id: "b8", label: "Location Combi VW", category: "Transport", planned: 650, spent: 0, status: "À prévoir" },
  { id: "b9", label: "Papeterie & faire-part", category: "Divers", planned: 480, spent: 480, status: "Payé" },
];

const statusStyles = {
  "Payé": "bg-primary/10 text-primary",
  "Acompte": "bg-accent/30 text-foreground",
  "À prévoir": "bg-muted text-muted-foreground",
} as const;

function euro(n: number) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function Budget() {
  const { slug } = useParams({ from: "/events/$slug/budget" });
  const [lines] = useState(seed);
  const [totalBudget] = useState(38000);

  const stats = useMemo(() => {
    const planned = lines.reduce((a, l) => a + l.planned, 0);
    const spent = lines.reduce((a, l) => a + l.spent, 0);
    const remaining = totalBudget - planned;
    return { planned, spent, remaining, percentSpent: Math.round((spent / totalBudget) * 100), percentPlanned: Math.round((planned / totalBudget) * 100) };
  }, [lines, totalBudget]);

  const byCategory = useMemo(() => {
    const map = new Map<Cat, { planned: number; spent: number }>();
    for (const l of lines) {
      const cur = map.get(l.category) ?? { planned: 0, spent: 0 };
      cur.planned += l.planned;
      cur.spent += l.spent;
      map.set(l.category, cur);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].planned - a[1].planned);
  }, [lines]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Budget</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Nouvelle dépense">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-accent/15 to-transparent px-4 pb-8 pt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Budget total</p>
        <h1 className="mt-1 font-serif text-4xl leading-tight">{euro(totalBudget)}</h1>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-background/70">
          <div className="flex h-full">
            <div className="h-full bg-primary" style={{ width: `${stats.percentSpent}%` }} />
            <div className="h-full bg-primary/40" style={{ width: `${Math.max(0, stats.percentPlanned - stats.percentSpent)}%` }} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-background/70 p-3 backdrop-blur">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Dépensé</p>
            <p className="mt-1 font-serif text-lg leading-none">{euro(stats.spent)}</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3 backdrop-blur">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Engagé</p>
            <p className="mt-1 font-serif text-lg leading-none">{euro(stats.planned - stats.spent)}</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3 backdrop-blur">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Restant</p>
            <p className={`mt-1 font-serif text-lg leading-none ${stats.remaining < 0 ? "text-danger" : "text-primary"}`}>
              {euro(stats.remaining)}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-serif text-lg">Répartition par catégorie</h2>
        <ul className="space-y-2">
          {byCategory.map(([cat, val]) => {
            const meta = catMeta[cat];
            const Icon = meta.icon;
            const percent = Math.round((val.planned / stats.planned) * 100);
            return (
              <li key={cat} className="rounded-2xl border border-border/60 bg-card p-3">
                <div className="flex items-center gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${meta.color}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-medium">{cat}</p>
                      <p className="text-xs font-mono">{euro(val.planned)}</p>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{percent}%</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-4 pt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">Dépenses détaillées</h2>
          <span className="text-xs text-muted-foreground">{lines.length} lignes</span>
        </div>
        <ul className="space-y-2">
          {lines.map((l) => {
            const meta = catMeta[l.category];
            const Icon = meta.icon;
            const remaining = l.planned - l.spent;
            return (
              <li key={l.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${meta.color}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.label}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[l.status]}`}>{l.status}</span>
                    {remaining > 0 && l.status !== "Payé" && (
                      <span className="text-[10px] text-muted-foreground">Reste {euro(remaining)}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-medium">{euro(l.planned)}</p>
                  {l.spent > 0 && l.spent < l.planned && (
                    <p className="font-mono text-[10px] text-muted-foreground">Versé {euro(l.spent)}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-4 mt-8 rounded-3xl bg-gradient-to-br from-foreground to-foreground/80 p-6 text-background">
        <div className="flex items-center gap-3">
          <Wallet className="h-6 w-6" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] opacity-80">Cagnotte externe</p>
            <p className="font-serif text-lg">Contributions reçues : {euro(2340)}</p>
          </div>
        </div>
        <p className="mt-3 text-xs opacity-80">
          Ces contributions viennent en soutien de votre budget mais restent gérées sur votre plateforme externe (Leetchi, Lydia…).
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-background/10 px-3 py-2 text-xs">
          <TrendingUp className="h-3.5 w-3.5" /> +{euro(420)} cette semaine
          <span className="mx-2 h-3 w-px bg-background/30" />
          <TrendingDown className="h-3.5 w-3.5" /> Objectif {euro(5000)}
        </div>
      </section>
    </div>
  );
}
