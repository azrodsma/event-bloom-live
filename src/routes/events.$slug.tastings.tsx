import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Utensils, Wine, Flame, Leaf, ChefHat, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/tastings")({
  component: Tastings,
  head: () => ({
    meta: [
      { title: "Dégustations · MaFeliza" },
      { name: "description", content: "Planifiez et notez vos dégustations traiteur, vins et pâtisseries avant le grand jour." },
      { property: "og:title", content: "Dégustations · MaFeliza" },
      { property: "og:description", content: "Choisir en confiance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Session = {
  id: string;
  date: string;
  vendor: string;
  type: "traiteur" | "vin" | "cake" | "cocktail";
  status: "à venir" | "notée" | "à noter";
  items: { name: string; score?: number }[];
  cover: string;
};

const sessions: Session[] = [
  { id: "t1", date: "Sam 8 févr. · 11h", vendor: "Maison Lenoir", type: "traiteur", status: "notée", cover: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600", items: [{ name: "Tartare de bœuf-condiments", score: 5 }, { name: "Filet mignon jus corsé", score: 4 }, { name: "Risotto crémeux truffe", score: 5 }] },
  { id: "t2", date: "Dim 16 févr. · 14h", vendor: "Cave Beaumont", type: "vin", status: "à noter", cover: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600", items: [{ name: "Chablis 1er cru 2022" }, { name: "Bourgogne rouge Volnay" }, { name: "Crémant brut rosé" }] },
  { id: "t3", date: "Sam 1 mars · 10h30", vendor: "Pâtisserie Chloé", type: "cake", status: "à venir", cover: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600", items: [{ name: "Layer vanille framboise" }, { name: "Cheesecake basque" }, { name: "Naked cake amande" }] },
  { id: "t4", date: "Ven 14 mars · 19h", vendor: "Bar Signature", type: "cocktail", status: "à venir", cover: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600", items: [{ name: "Rose spritz maison" }, { name: "Old fashioned miel" }, { name: "Mocktail litchi rose" }] },
];

const typeIcon = { traiteur: Utensils, vin: Wine, cake: ChefHat, cocktail: Flame } as const;

function Tastings() {
  const { slug } = useParams({ from: "/events/$slug/tastings" });
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});

  const setScore = (sid: string, name: string, s: number) =>
    setScores((prev) => ({ ...prev, [sid]: { ...(prev[sid] ?? {}), [name]: s } }));

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Dégustations</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-accent/30 to-background px-4 pb-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Leaf className="h-3.5 w-3.5 text-primary" /> Avant le grand jour
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">4 rendez-vous<br />pour choisir juste</h1>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-background/70 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">1</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Notée</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none text-primary">1</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">À noter</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">2</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">À venir</p>
          </div>
        </div>
      </section>

      <ul className="space-y-4 px-4 pt-4">
        {sessions.map((s) => {
          const Icon = typeIcon[s.type];
          return (
            <li key={s.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
              <div className="relative h-32 w-full">
                <img src={s.cover} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase text-primary backdrop-blur">
                  {s.status}
                </span>
                <div className="absolute inset-x-4 bottom-3 text-white">
                  <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/80">
                    <Icon className="h-3 w-3" /> {s.type}
                  </p>
                  <p className="mt-0.5 font-serif text-lg leading-tight">{s.vendor}</p>
                  <p className="flex items-center gap-1 text-[11px] text-white/80">
                    <Clock className="h-3 w-3" /> {s.date}
                  </p>
                </div>
              </div>

              <div className="space-y-2 p-4">
                {s.items.map((it) => {
                  const score = scores[s.id]?.[it.name] ?? it.score;
                  return (
                    <div key={it.name} className="flex items-center justify-between gap-2 rounded-2xl bg-secondary/60 px-3 py-2">
                      <p className="min-w-0 flex-1 truncate text-[13px]">{it.name}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() => setScore(s.id, it.name, n)}
                            className={`h-6 w-6 rounded-full text-[10px] font-bold transition ${
                              (score ?? 0) >= n ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                            }`}
                            aria-label={`Note ${n}`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Rapport final</p>
        <p className="mt-2 font-serif text-lg leading-tight">Synthèse & recommandations</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Une fois les 4 sessions notées, MaFeliza génère un PDF récapitulatif à envoyer à vos prestataires.
        </p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Aperçu du rapport
        </button>
      </section>
    </div>
  );
}
