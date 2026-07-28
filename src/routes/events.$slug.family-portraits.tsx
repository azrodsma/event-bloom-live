import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Camera, Download, Heart } from "lucide-react";

export const Route = createFileRoute("/events/$slug/family-portraits")({
  component: FamilyPortraits,
  head: () => ({
    meta: [
      { title: "Photos de famille · Memento Live" },
      { name: "description", content: "Liste chronométrée des portraits de famille pour ne rater personne." },
      { property: "og:title", content: "Photos de famille · Memento Live" },
      { property: "og:description", content: "22 combinaisons, 25 minutes, zéro oubli." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const shots = [
  { t: "17:15", l: "Couple + parents mariée", ppl: 4 },
  { t: "17:17", l: "Couple + parents marié", ppl: 4 },
  { t: "17:19", l: "Couple + 4 parents", ppl: 6 },
  { t: "17:22", l: "Grande famille mariée (grands-parents inclus)", ppl: 14 },
  { t: "17:26", l: "Grande famille marié", ppl: 12 },
  { t: "17:30", l: "Couple + frères & sœurs", ppl: 6 },
  { t: "17:33", l: "Couple + témoins", ppl: 8 },
  { t: "17:36", l: "Couple + demoiselles d'honneur", ppl: 7 },
  { t: "17:38", l: "Couple + garçons d'honneur", ppl: 5 },
  { t: "17:40", l: "Enfants d'honneur", ppl: 4 },
];

function FamilyPortraits() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Photos de famille</h1>
            <p className="text-xs text-muted-foreground">22 combinaisons · 25 min chrono</p>
          </div>
          <Camera className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-primary/10 p-6">
          <Heart className="h-5 w-5 text-primary" />
          <h2 className="mt-2 font-display text-2xl leading-tight">La liste que le photographe attend en premier.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Chronométrée, testée sur 400 mariages. Un référent famille par côté annonce les groupes au micro.</p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
            <Download className="h-4 w-4" /> Exporter en PDF pour le photographe
          </button>
        </section>

        <section className="space-y-2">
          {shots.map((s) => (
            <div key={s.l} className="rounded-2xl border border-border/50 bg-card p-4 flex items-center gap-4">
              <span className="font-display text-lg text-primary w-14">{s.t}</span>
              <p className="flex-1 text-sm">{s.l}</p>
              <span className="text-xs text-muted-foreground">{s.ppl} pers.</span>
            </div>
          ))}
        </section>

        <p className="text-xs text-center text-muted-foreground italic">Référent famille mariée : Julie · Référent famille marié : Marc</p>
      </main>
    </div>
  );
}
