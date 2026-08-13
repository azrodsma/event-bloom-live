import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookHeart, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/app/love-stories")({
  component: LoveStories,
  head: () => ({
    meta: [
      { title: "Histoires vraies · MaFeliza" },
      { name: "description", content: "Ils se sont mariés avec MaFeliza. Voici leurs récits." },
      { property: "og:title", content: "Histoires vraies · MaFeliza" },
      { property: "og:description", content: "12 mariages, 12 leçons, 12 films émouvants." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const stories = [
  { c: "Lucie & Aymeric", loc: "Provence · 220 invités", ex: "Elle est infirmière, il est agriculteur bio. Leur banquet 100% local a nourri les invités avec 4 hectares du domaine.", d: "12 min" },
  { c: "Fatou & Malik", loc: "Dakar → Paris · 340 invités", ex: "Un mariage sur deux continents relié en live 4G, retransmis dans un cinéma parisien.", d: "9 min" },
  { c: "Chloé & Nils", loc: "Islande · 22 invités", ex: "Élopement au pied du glacier Sólheimajökull. Officiante norvégienne, vœux en trois langues.", d: "7 min" },
  { c: "Anaïs & Jean", loc: "Bretagne · 180 invités", ex: "Pluie battante et plan de repli parfait sous chapiteau baldaquin. Le nord ne pleure jamais.", d: "11 min" },
  { c: "Sophie & Elena", loc: "Corse · 90 invités", ex: "Union civile mixte, cérémonie laïque sur la plage de Palombaggia, feu d'artifice tiré depuis un voilier.", d: "10 min" },
  { c: "Julia & Ravi", loc: "Rajasthan → Lyon · 400 invités", ex: "Deux jours : cérémonie hindoue à Udaipur, puis vin d'honneur français à Fourvière. Deux robes, deux costumes, une seule histoire.", d: "14 min" },
];

function LoveStories() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/app" className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Histoires vraies</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">12 films documentaires</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <BookHeart className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white">
          <BookHeart className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">De vrais couples. De vraies journées. Zéro filtre.</h2>
          <p className="mt-3 text-sm opacity-90">Nos réalisatrices Emma et Nina passent 48h avec les couples pour un film honnête, jamais promotionnel.</p>
        </section>

        <section className="space-y-3">
          {stories.map((s) => (
            <article key={s.c} className="rounded-3xl border border-border/50 bg-card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider text-primary">{s.loc}</span>
                <span className="text-xs text-muted-foreground">{s.d} · film</span>
              </div>
              <h2 className="font-display text-2xl">{s.c}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.ex}</p>
              <button className="mt-4 inline-flex items-center gap-2 text-sm text-primary">
                Regarder le film <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
