import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Check, Trees, Wind, Droplets, Sun, HeartHandshake } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/rituals")({
  component: Rituals,
  head: () => ({
    meta: [
      { title: "Rituels & symboles · Memento Live" },
      { name: "description", content: "Composez la trame symbolique de votre cérémonie — rituels laïques, textes, engagements." },
      { property: "og:title", content: "Rituels de cérémonie · Memento Live" },
      { property: "og:description", content: "Une trame émotion sur-mesure." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Ritual = {
  id: string;
  name: string;
  emoji: string;
  duration: string;
  intensity: "doux" | "fort" | "intense";
  description: string;
  needs: string[];
  icon: typeof Trees;
};

const catalog: Ritual[] = [
  { id: "r1", name: "Rituel du sable", emoji: "⏳", duration: "4 min", intensity: "doux", description: "Deux couleurs de sable s'unissent dans un vase — mémoire indélébile.", needs: ["Vase gravé", "Sable rose & doré"], icon: Droplets },
  { id: "r2", name: "Rituel de l'arbre", emoji: "🌳", duration: "6 min", intensity: "fort", description: "Chacun verse un peu de terre autour d'un jeune arbre planté au domaine.", needs: ["Jeune plant", "Pelles rubanées"], icon: Trees },
  { id: "r3", name: "Rituel des rubans", emoji: "🎗️", duration: "8 min", intensity: "fort", description: "Les proches nouent un ruban autour des poignets liés des mariés.", needs: ["Rubans satinés", "Panier"], icon: HeartHandshake },
  { id: "r4", name: "Rituel de la lumière", emoji: "🕯️", duration: "3 min", intensity: "doux", description: "Deux bougies allument une troisième — union des flammes.", needs: ["Bougies × 3", "Chandeliers"], icon: Sun },
  { id: "r5", name: "Lâcher de vœux", emoji: "🎈", duration: "5 min", intensity: "intense", description: "Bulles ou colombes — un vœu s'envole pour chaque promesse.", needs: ["Bulles biodégradables"], icon: Wind },
];

const intensityColor = {
  doux: "bg-emerald-50 text-emerald-700",
  fort: "bg-amber-50 text-amber-700",
  intense: "bg-rose-50 text-rose-700",
} as const;

function Rituals() {
  const { slug } = useParams({ from: "/events/$slug/rituals" });
  const [selected, setSelected] = useState<Set<string>>(new Set(["r1", "r3"]));

  const total = selected.size;
  const totalMin = catalog.filter((r) => selected.has(r.id)).reduce((s, r) => s + parseInt(r.duration), 0);

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Rituels</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/40 via-primary/10 to-background" />
        <div className="relative px-4 py-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Cérémonie laïque
          </div>
          <h1 className="mt-2 font-serif text-3xl leading-tight">La trame de vos symboles</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Choisissez 2 à 4 rituels pour donner du relief à votre cérémonie — nous préparons la logistique.
          </p>
        </div>
      </section>

      <ul className="space-y-3 px-4 pt-4">
        {catalog.map((r) => {
          const Icon = r.icon;
          const on = selected.has(r.id);
          return (
            <li
              key={r.id}
              onClick={() => setSelected((s) => { const n = new Set(s); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; })}
              className={`cursor-pointer rounded-3xl border p-4 transition ${on ? "border-primary bg-primary/5" : "border-border/60 bg-card hover:border-primary/40"}`}
            >
              <div className="flex items-start gap-3">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg ${on ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                  {on ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5 text-primary" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-serif text-lg leading-tight">
                      {r.emoji} {r.name}
                    </p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{r.duration}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-muted-foreground">{r.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${intensityColor[r.intensity]}`}>
                      {r.intensity}
                    </span>
                    {r.needs.map((n) => (
                      <span key={n} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Suggestion Memento</p>
        <p className="mt-2 font-serif text-lg leading-tight">Rituel des grands-mères</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Chaque grand-mère bénit un objet transmis. Idéal si votre famille est nombreuse et intergénérationnelle.
        </p>
        <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          <Sparkles className="h-3.5 w-3.5" /> Ajouter à ma trame
        </button>
      </section>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/95 p-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="flex-1 text-xs">
            <p className="font-medium">{total} rituel{total > 1 ? "s" : ""} · ~{totalMin} min</p>
            <p className="text-muted-foreground">Envoyé à votre officiant·e et au coordinateur</p>
          </div>
          <button
            disabled={total === 0}
            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-40"
          >
            Valider ma trame
          </button>
        </div>
      </div>
    </div>
  );
}
