import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Baby, Utensils, Bed } from "lucide-react";

export const Route = createFileRoute("/events/$slug/nursery")({
  component: Nursery,
  head: () => ({
    meta: [
      { title: "Nurserie · Memento Live" },
      { name: "description", content: "Espace bébés : biberons, change, sieste, monitoring." },
      { property: "og:title", content: "Nurserie · Memento Live" },
      { property: "og:description", content: "Les tout-petits aussi ont leur cocon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const babies = [
  { l: "Léon · 6 mois", parents: "Camille & Hugo", needs: "Lait maternel (frigo dédié) · sieste 14h & 18h" },
  { l: "Ambre · 14 mois", parents: "Julie & Marc", needs: "Purée sans sel · doudou lapin · sieste 15h30" },
  { l: "Nino · 22 mois", parents: "Sarah & Alex", needs: "Allergie arachide · marche autonome" },
];

function Nursery() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Nurserie</h1>
            <p className="text-xs text-muted-foreground">3 bébés · 2 auxiliaires diplômées</p>
          </div>
          <Baby className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-primary/10 p-6">
          <p className="text-xs uppercase tracking-widest text-primary">Suite parentale · 2ᵉ étage</p>
          <h2 className="mt-2 font-display text-2xl">Cocon lumière tamisée & babyphone vidéo</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl bg-white/70 p-3"><Bed className="h-4 w-4 text-primary mb-1" />4 berceaux</div>
            <div className="rounded-xl bg-white/70 p-3"><Utensils className="h-4 w-4 text-primary mb-1" />Chauffe-biberon</div>
            <div className="rounded-xl bg-white/70 p-3"><Baby className="h-4 w-4 text-primary mb-1" />Table à langer</div>
          </div>
        </section>

        <section className="space-y-3">
          {babies.map((b) => (
            <div key={b.l} className="rounded-2xl border border-border/50 bg-card p-4">
              <p className="font-medium">{b.l}</p>
              <p className="text-xs text-muted-foreground">Parents : {b.parents}</p>
              <p className="mt-2 text-xs rounded-lg bg-cream/70 px-3 py-2">{b.needs}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-primary/10 p-4">
          <p className="font-medium text-sm">Auxiliaires puéricultrices</p>
          <p className="text-xs text-muted-foreground mt-1">Marion (14h → 22h) & Céline (22h → 03h) · agréées PMI · trousse pédiatrique sur place.</p>
        </section>
      </main>
    </div>
  );
}
