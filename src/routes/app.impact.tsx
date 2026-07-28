import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Leaf, Award, Recycle } from "lucide-react";

export const Route = createFileRoute("/app/impact")({
  component: Impact,
  head: () => ({
    meta: [
      { title: "Impact & engagements · Memento Live" },
      { name: "description", content: "Nos engagements sociaux, environnementaux et solidaires." },
      { property: "og:title", content: "Impact · Memento Live" },
      { property: "og:description", content: "Célébrer, sans compromis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const stats = [
  { l: "Fleurs redistribuées en EHPAD", v: "12 480 bouquets", icon: Leaf },
  { l: "Repas sauvés du gaspillage", v: "38 200", icon: Recycle },
  { l: "Prestataires locaux référencés", v: "1 240", icon: Award },
];

function Impact() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/app" className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Impact</h1>
            <p className="text-xs text-muted-foreground">Bilan 2026 & engagements</p>
          </div>
          <Leaf className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white">
          <p className="text-xs uppercase tracking-widest opacity-80">Notre promesse</p>
          <h2 className="mt-2 font-display text-3xl leading-tight">Un événement ne devrait jamais coûter à la planète ce qu'il apporte aux cœurs.</h2>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Chiffres 2026</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.l} className="rounded-2xl border border-border/50 bg-card p-4">
                <s.icon className="h-4 w-4 text-primary" />
                <p className="mt-2 font-display text-2xl">{s.v}</p>
                <p className="text-xs text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-5 space-y-3">
          <p className="font-display text-lg">Labels & certifications</p>
          <div className="flex flex-wrap gap-2">
            {["B Corp certifié", "Numérique responsable", "1% for the Planet", "Great Place to Work"].map((b) => (
              <span key={b} className="rounded-full bg-cream px-3 py-1.5 text-xs">{b}</span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-cream p-5">
          <p className="font-display text-lg">Rapport intégré 2026</p>
          <p className="text-xs text-muted-foreground mt-1">Bilan carbone Scope 1-2-3, diversité, gouvernance et redistribution.</p>
          <button className="mt-3 rounded-full bg-foreground px-5 py-2.5 text-sm text-white">Télécharger le PDF (4,2 Mo)</button>
        </section>
      </main>
    </div>
  );
}
