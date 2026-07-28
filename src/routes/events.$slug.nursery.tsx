import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Baby, Heart, Sparkles, Calendar } from "lucide-react";

export const Route = createFileRoute("/events/$slug/nursery")({
  component: Nursery,
  head: () => ({
    meta: [
      { title: "Nursery & bébés · Memento Live" },
      { name: "description", content: "Espace change, sieste, nounous et alertes discrètes pour parents en soirée." },
      { property: "og:title", content: "Nursery & bébés · Memento Live" },
      { property: "og:description", content: "Les tout-petits chouchoutés." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const babies = [
  { name: "Anna", age: "8 mois", parents: "Sarah & Tom", sleep: "19h30", allergy: "Œufs" },
  { name: "Léo", age: "2 ans", parents: "Karim & Nour", sleep: "20h00", allergy: "—" },
  { name: "Iris", age: "14 mois", parents: "Julie & Max", sleep: "19h00", allergy: "Fruits à coque" },
  { name: "Nino", age: "4 mois", parents: "Emma & Léo", sleep: "sur demande", allergy: "—" },
];

const rooms = [
  { name: "Nursery pastel", capacity: 4, features: ["Table à langer", "Berceau × 2", "Chauffe-biberon"], color: "from-primary/70 to-primary" },
  { name: "Sieste calme", capacity: 6, features: ["Lumière tamisée", "Diffuseur lavande", "Musique douce"], color: "from-gold/60 to-primary-dark" },
];

function Nursery() {
  const { slug } = useParams({ from: "/events/$slug/nursery" });

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Nursery & bébés</p>
          <p className="text-xs text-muted-foreground">{babies.length} tout-petits · 2 nounous certifiées</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/20 p-6 shadow-card">
          <Baby className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight text-foreground">Les tout-petits, chouchoutés</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Deux nounous diplômées, deux espaces dédiés et une messagerie discrète pour prévenir les parents sans quitter la piste.
          </p>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Espaces bébés</p>
          <div className="grid grid-cols-2 gap-2">
            {rooms.map((r) => (
              <div key={r.name} className={`rounded-2xl bg-gradient-to-br ${r.color} p-4 text-white shadow-soft`}>
                <p className="text-[10px] font-bold uppercase opacity-80">Capacité {r.capacity}</p>
                <p className="mt-1 font-serif text-lg leading-tight">{r.name}</p>
                <ul className="mt-3 space-y-1 text-[11px] opacity-90">
                  {r.features.map((f) => <li key={f}>· {f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inscrits</p>
          <div className="space-y-2">
            {babies.map((b) => (
              <article key={b.name} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-soft">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cream text-2xl">
                  {b.age.includes("mois") && parseInt(b.age) < 12 ? "👶" : "🧒"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{b.name} · {b.age}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{b.parents}</p>
                </div>
                <div className="text-right">
                  <p className="flex items-center justify-end gap-1 text-[11px] text-primary-dark">
                    <Calendar className="h-3 w-3" /> Dodo {b.sleep}
                  </p>
                  {b.allergy !== "—" && (
                    <p className="mt-0.5 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
                      ⚠ {b.allergy}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <Heart className="h-5 w-5 text-primary" />
          <p className="mt-2 font-serif text-lg leading-tight">Alertes discrètes</p>
          <p className="mt-1 text-sm opacity-80">
            Les nounous vous préviennent d'un tap : montre vibre, écran s'allume — pas de son.
          </p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold">
            <Sparkles className="mr-1 inline h-3.5 w-3.5" /> Tester l'alerte
          </button>
        </section>
      </main>
    </div>
  );
}
