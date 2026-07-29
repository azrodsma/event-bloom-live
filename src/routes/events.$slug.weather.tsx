import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Cloud, Sun, Umbrella, Wind } from "lucide-react";

export const Route = createFileRoute("/events/$slug/weather")({
  component: Weather,
  head: () => ({
    meta: [
      { title: "Météo du jour J · Memento Live" },
      { name: "description", content: "Prévisions détaillées et plan de repli intelligent." },
      { property: "og:title", content: "Météo · Memento Live" },
      { property: "og:description", content: "Anticiper, adapter, sourire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const forecast = [
  { h: "10:00", t: "18°", c: "Ensoleillé", icon: Sun, wind: "8 km/h" },
  { h: "14:00", t: "24°", c: "Ciel dégagé", icon: Sun, wind: "12 km/h" },
  { h: "16:30", t: "26°", c: "Voile nuageux", icon: Cloud, wind: "14 km/h" },
  { h: "19:00", t: "23°", c: "Golden hour parfaite", icon: Sun, wind: "10 km/h" },
  { h: "22:00", t: "19°", c: "Ciel clair", icon: Cloud, wind: "6 km/h" },
  { h: "02:00", t: "15°", c: "Rosée", icon: Cloud, wind: "4 km/h" },
];

function Weather() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Météo du jour J</h1>
            <p className="text-xs text-muted-foreground">Mise à jour toutes les 30 min · Météo France</p>
          </div>
          <Sun className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-gold/30 via-primary/10 to-cream p-6 text-center">
          <Sun className="h-10 w-10 text-primary mx-auto" />
          <h2 className="mt-2 font-display text-5xl">24°</h2>
          <p className="text-sm text-muted-foreground">Ciel dégagé · Fiabilité 92%</p>
          <p className="mt-2 text-xs text-primary">Excellente journée en perspective</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Prévisions détaillées</h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {forecast.map((f) => (
              <div key={f.h} className="rounded-2xl border border-border/50 bg-card p-3 text-center">
                <p className="text-xs text-muted-foreground">{f.h}</p>
                <f.icon className="h-5 w-5 text-primary mx-auto my-1" />
                <p className="font-display text-lg">{f.t}</p>
                <p className="text-[10px] text-muted-foreground">{f.wind}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2">
            <Umbrella className="h-4 w-4 text-primary" />
            <p className="font-display text-lg">Plan de repli</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Non activé · seuil de bascule à 40% de risque de pluie. Décision automatique à J-1 à 12h.</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-cream p-2">Orangerie disponible</div>
            <div className="rounded-lg bg-cream p-2">Chapiteau alt. 5 min montage</div>
          </div>
        </section>

        <section className="rounded-2xl bg-cream p-4 flex items-start gap-3">
          <Wind className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm">Alerte vent</p>
            <p className="text-xs text-muted-foreground">Rafales max prévues : 22 km/h. Voiles cérémonie sécurisées avec lest 15kg.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
