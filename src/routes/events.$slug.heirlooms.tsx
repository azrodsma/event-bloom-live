import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Gem, Lock } from "lucide-react";

export const Route = createFileRoute("/events/$slug/heirlooms")({
  component: Heirlooms,
  head: () => ({
    meta: [
      { title: "Objets de famille · Memento Live" },
      { name: "description", content: "Inventaire des objets de famille utilisés le jour J." },
      { property: "og:title", content: "Objets de famille · Memento Live" },
      { property: "og:description", content: "Le voile de grand-mère, la broche de tante Éliane. Chaque histoire tracée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const items = [
  { l: "Voile de mariée en dentelle de Calais", from: "Grand-mère Colette (1958)", worn: "Cérémonie et vin d'honneur", value: "Inestimable" },
  { l: "Broche saphir art déco", from: "Tante Éliane (1932)", worn: "Épinglée au bouquet · something blue", value: "12 000 €" },
  { l: "Alliance en or rose gravée", from: "Grand-père Louis (1961)", worn: "Cérémonie · redimensionnée", value: "Sentimentale" },
  { l: "Mouchoir brodé « M »", from: "Arrière-grand-mère Marthe", worn: "Discret dans la poche · larmes de joie", value: "Sentimentale" },
  { l: "Peigne à cheveux en écaille", from: "Mère de la mariée", worn: "Coiffure préparatifs", value: "800 €" },
  { l: "Bible familiale reliée", from: "Famille Dubois (1889)", worn: "Signature registre paroissial", value: "Sentimentale" },
];

function Heirlooms() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Objets de famille</h1>
            <p className="text-xs text-muted-foreground">6 pièces · assurées le jour J</p>
          </div>
          <Gem className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-primary/10 p-6">
          <Lock className="h-5 w-5 text-primary" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Chaque objet, son histoire. Chaque histoire, sa garde.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Photos, provenance et itinéraire du jour J. Coffre-fort à la réception, garde-corps désigné pour chaque pièce.</p>
        </section>

        <section className="space-y-3">
          {items.map((i) => (
            <div key={i.l} className="rounded-2xl border border-border/50 bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-lg">{i.l}</p>
                <span className="text-xs text-primary shrink-0">{i.value}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Provenance · {i.from}</p>
              <p className="text-xs text-muted-foreground mt-1">Porté · {i.worn}</p>
            </div>
          ))}
        </section>

        <p className="text-xs text-center text-muted-foreground italic">Assurance objets précieux jour J incluse dans l'offre Signature — jusqu'à 25 000 € par pièce.</p>
      </main>
    </div>
  );
}
