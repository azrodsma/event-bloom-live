import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Map, Globe2 } from "lucide-react";

export const Route = createFileRoute("/app/venues-map")({
  component: VenuesMap,
  head: () => ({
    meta: [
      { title: "Lieux partenaires · Memento Live" },
      { name: "description", content: "342 lieux d'exception partenaires Memento partout en France." },
      { property: "og:title", content: "Lieux partenaires · Memento Live" },
      { property: "og:description", content: "Châteaux, granges, phares, plages : chaque lieu visité par nos équipes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const regions = [
  { l: "Île-de-France", n: 48, star: "Château de Ferrières" },
  { l: "Provence-Côte d'Azur", n: 62, star: "Bastide de Gordes" },
  { l: "Nouvelle-Aquitaine", n: 71, star: "Château de Malviès" },
  { l: "Bretagne", n: 32, star: "Manoir de Kerhuel" },
  { l: "Auvergne-Rhône-Alpes", n: 44, star: "Domaine Divonne" },
  { l: "Occitanie", n: 35, star: "Abbaye de Fontfroide" },
  { l: "Normandie", n: 24, star: "Deauville Beach Club" },
  { l: "Grand Est", n: 15, star: "Château de Cirey" },
  { l: "Corse", n: 11, star: "U Capu Biancu" },
];

function VenuesMap() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/app" className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Lieux partenaires</h1>
            <p className="text-xs text-muted-foreground">342 domaines · visite d'équipe obligatoire</p>
          </div>
          <Map className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-6 text-white">
          <Globe2 className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Pas de photo Instagram bidon. Uniquement des lieux qu'on a vécus.</h2>
          <p className="mt-3 text-sm opacity-90">Chaque domaine est audité par un membre de l'équipe Memento : mariage-test, dîner immersion, revue coulisses.</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Par région</h3>
          <div className="grid grid-cols-2 gap-3">
            {regions.map((r) => (
              <div key={r.l} className="rounded-2xl border border-border/50 bg-card p-4">
                <p className="font-medium text-sm">{r.l}</p>
                <p className="font-display text-2xl mt-1 text-primary">{r.n}</p>
                <p className="text-xs text-muted-foreground">Coup de cœur · {r.star}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Recommander un lieu</p>
          <p className="text-xs text-muted-foreground mt-1">Vous connaissez un domaine méconnu qui mérite d'être connu ? Envoyez-nous vos photos, on programme la visite.</p>
        </div>
      </main>
    </div>
  );
}
