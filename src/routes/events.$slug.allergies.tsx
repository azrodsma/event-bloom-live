import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Utensils, Sparkles, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/events/$slug/allergies")({
  component: Allergies,
  head: () => ({
    meta: [
      { title: "Allergies & régimes · MaFeliza" },
      { name: "description", content: "Cartographie des allergies et régimes pour un service sans stress." },
      { property: "og:title", content: "Allergies · MaFeliza" },
      { property: "og:description", content: "Aucun invité oublié." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const diets = [
  { l: "Végétarien", n: 18, color: "from-primary to-primary-dark", icon: "🌿" },
  { l: "Végan", n: 6, color: "from-primary-dark to-gold", icon: "🌱" },
  { l: "Sans gluten", n: 9, color: "from-gold to-primary", icon: "🌾" },
  { l: "Halal", n: 14, color: "from-primary to-gold", icon: "☪️" },
  { l: "Casher", n: 3, color: "from-foreground to-primary-dark", icon: "✡️" },
  { l: "Sans lactose", n: 5, color: "from-primary-dark to-primary", icon: "🥛" },
];

const critical = [
  { name: "Anna P.", allergy: "Arachides", severity: "Sévère · EpiPen", table: "Pivoine" },
  { name: "Marc L.", allergy: "Crustacés", severity: "Modéré", table: "Rosier" },
  { name: "Iris D.", allergy: "Fruits à coque", severity: "Sévère · EpiPen", table: "Kids" },
  { name: "Sofia B.", allergy: "Œufs", severity: "Léger", table: "Camélia" },
];

function Allergies() {
  const { slug } = useParams({ from: "/events/$slug/allergies" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Allergies & régimes</p>
          <p className="text-xs text-muted-foreground">4 allergies sévères · brief chef à J-3</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/20 p-6 shadow-card">
          <Utensils className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Aucun invité oublié</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Chaque contrainte remonte automatiquement en cuisine, avec pictogrammes discrets sur le menu personnalisé.
          </p>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Régimes</p>
          <div className="grid grid-cols-3 gap-2">
            {diets.map((d) => (
              <div key={d.l} className={`rounded-2xl bg-gradient-to-br ${d.color} p-3 text-white shadow-soft`}>
                <p className="text-xl">{d.icon}</p>
                <p className="mt-1 text-[10px] font-bold uppercase opacity-80">{d.l}</p>
                <p className="font-serif text-2xl leading-tight">{d.n}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-destructive">
            <AlertCircle className="h-3.5 w-3.5" /> Allergies critiques
          </p>
          <div className="space-y-2">
            {critical.map((c) => (
              <article key={c.name} className="rounded-2xl bg-surface p-3.5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Table {c.table}</p>
                  </div>
                  <div className="text-right">
                    <p className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
                      ⚠ {c.allergy}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{c.severity}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="mt-2 font-serif text-lg leading-tight">Menu personnalisé imprimé</p>
          <p className="mt-1 text-sm opacity-80">
            Chaque assiette est marquée d'un pictogramme discret pour guider le service sans stigmatiser.
          </p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold">Exporter la fiche chef</button>
        </section>
      </main>
    </div>
  );
}
