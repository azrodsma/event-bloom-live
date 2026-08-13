import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Map, Globe2 } from "lucide-react";

export const Route = createFileRoute("/app/venues-map")({
  component: VenuesMap,
  head: () => ({
    meta: [
      { title: "Lieux partenaires · MaFeliza" },
      { name: "description", content: "342 lieux d'exception partenaires MaFeliza partout en France." },
      { property: "og:title", content: "Lieux partenaires · MaFeliza" },
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
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/app" className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Lieux partenaires</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">342 domaines · visite d'équipe obligatoire</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Map className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-foreground to-primary-dark p-7 text-white shadow-modal">
          <Globe2 className="h-6 w-6" />
          <h2 className="mt-2 font-serif text-3xl leading-[1.05] sm:text-4xl">Pas de photo Instagram bidon. Uniquement des lieux qu'on a vécus.</h2>
          <p className="mt-3 text-sm opacity-90">Chaque domaine est audité par un membre de l'équipe MaFeliza : mariage-test, dîner immersion, revue coulisses.</p>
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
