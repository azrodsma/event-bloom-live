import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Rocket, Sparkles, Calendar } from "lucide-react";

export const Route = createFileRoute("/app/roadmap")({
  component: Roadmap,
  head: () => ({
    meta: [
      { title: "Roadmap publique · MaFeliza" },
      { name: "description", content: "Ce que nous construisons, ce que nous préparons." },
      { property: "og:title", content: "Roadmap publique · MaFeliza" },
      { property: "og:description", content: "Nous construisons devant vous." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const columns = [
  {
    l: "En cours", color: "from-primary to-primary-dark",
    items: [
      { l: "Sous-titres live multilingues", votes: 341, eta: "Q2 2026" },
      { l: "Import Google Photos", votes: 218, eta: "Q2 2026" },
      { l: "Widget iOS 17 lock screen", votes: 189, eta: "Q3 2026" },
    ],
  },
  {
    l: "Bientôt", color: "from-gold to-primary",
    items: [
      { l: "Livre album auto-généré IA", votes: 512, eta: "Q3 2026" },
      { l: "Mode replay avec chapitres", votes: 287, eta: "Q3 2026" },
      { l: "Notes vocales dans le guestbook", votes: 245, eta: "Q3 2026" },
    ],
  },
  {
    l: "Étudié", color: "from-primary-dark to-foreground",
    items: [
      { l: "Web app hors-ligne complète", votes: 476, eta: "Q4 2026" },
      { l: "Assistant vocal jour J", votes: 398, eta: "2027" },
      { l: "Réalité augmentée plan de table", votes: 165, eta: "2027" },
    ],
  },
];

function Roadmap() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Roadmap publique</p>
          <p className="text-xs text-muted-foreground">Votez, orientez, suivez</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-foreground via-primary-dark to-primary p-6 text-white shadow-card">
          <Rocket className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Nous construisons devant vous</p>
          <p className="mt-2 text-sm opacity-90">
            Chaque trimestre, vos votes orientent nos priorités. Pas de promesse en l'air : ce qui figure ici est engagé.
          </p>
        </section>

        {columns.map((c) => (
          <section key={c.l}>
            <div className={`inline-block rounded-full bg-gradient-to-br ${c.color} px-3 py-1 text-[10px] font-bold uppercase text-white`}>
              {c.l}
            </div>
            <div className="mt-3 space-y-2">
              {c.items.map((it) => (
                <article key={it.l} className="rounded-2xl bg-surface p-4 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{it.l}</p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" /> {it.eta}
                      </p>
                    </div>
                    <button className="flex flex-col items-center rounded-2xl bg-primary/15 px-3 py-2 text-primary-dark">
                      <span className="text-xs">▲</span>
                      <span className="font-serif text-lg leading-none">{it.votes}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-3xl bg-cream p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">
            <Sparkles className="h-3.5 w-3.5" /> Proposer une idée
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Décrivez le besoin en 2 phrases. Les idées populaires sont revues à chaque comité produit.
          </p>
          <button className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">Écrire une idée</button>
        </section>
      </main>
    </div>
  );
}
