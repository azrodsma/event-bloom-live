import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Baby, Cake } from "lucide-react";

export const Route = createFileRoute("/events/$slug/baptism-liturgy")({
  component: BaptismLiturgy,
  head: () => ({
    meta: [
      { title: "Liturgie du baptême · Memento Live" },
      { name: "description", content: "Chaque rite expliqué, chaque chant préparé." },
      { property: "og:title", content: "Liturgie · Memento Live" },
      { property: "og:description", content: "Rituels catholiques, choix des textes, coordination célébrant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const rites = [
  { n: "01", t: "Accueil au parvis", d: "Le prêtre trace la croix sur le front. Parrain et marraine reprennent le geste." },
  { n: "02", t: "Liturgie de la Parole", d: "Lecture Isaïe 43,1-7 · Psaume 22 · Évangile Marc 10,13-16." },
  { n: "03", t: "Prière des fidèles", d: "5 intentions rédigées par les parents · lues par cousine Chloé." },
  { n: "04", t: "Renonciation au mal", d: "Trois questions posées aux parents et parrains-marraines." },
  { n: "05", t: "Onction avec l'huile", d: "Saint-chrême sur le front · signe royal." },
  { n: "06", t: "Baptême par l'eau", d: "Triple aspersion · prénom Léonie Marie Josèphe." },
  { n: "07", t: "Vêtement blanc & cierge", d: "Robe familiale de 1954 · cierge allumé au cierge pascal." },
  { n: "08", t: "Bénédiction finale", d: "Marche vers la Vierge · dépôt d'un lys blanc." },
];

function BaptismLiturgy() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "bapteme-leonie" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Liturgie du baptême</h1>
            <p className="text-xs text-muted-foreground">Père Emmanuel · 8 rites</p>
          </div>
          <Baby className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-primary/10 p-6">
          <Cake className="h-5 w-5 text-primary" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Comprendre chaque geste. Le vivre pleinement.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Nous avons construit ce guide avec 4 curés et 2 diacres pour rendre la cérémonie limpide, y compris pour les familles peu pratiquantes.</p>
        </section>

        <section className="space-y-3">
          {rites.map((r) => (
            <div key={r.n} className="rounded-2xl border border-border/50 bg-card p-5 flex gap-4">
              <span className="font-display text-4xl text-primary/40 shrink-0">{r.n}</span>
              <div>
                <p className="font-display text-lg">{r.t}</p>
                <p className="text-sm text-muted-foreground mt-1">{r.d}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Chants choisis</p>
          <p className="text-xs text-muted-foreground mt-1">Entrée · Peuple de Dieu, marche joyeux · Communion · Comme lui savoir dresser la table · Sortie · Que soit béni le Nom de Dieu.</p>
        </div>
      </main>
    </div>
  );
}
