import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, Award } from "lucide-react";

export const Route = createFileRoute("/app/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "À propos · MaFeliza" },
      { name: "description", content: "L'histoire, l'équipe et les valeurs de MaFeliza." },
      { property: "og:title", content: "À propos · MaFeliza" },
      { property: "og:description", content: "Le réseau social privé des plus beaux moments, imaginé à Lyon en 2023." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const team = [
  { n: "Éléonore Marchetti", role: "Co-fondatrice · CEO", bio: "Ex-mariée compulsive de 32 ans, ex-produit chez BlaBlaCar." },
  { n: "Adrien Passerat", role: "Co-fondateur · CTO", bio: "Ancien Datadog, obsédé par les événements en temps réel." },
  { n: "Louise Kim", role: "Directrice design", bio: "Formée à l'ENSAAMA, passée par Airbnb et Frichti." },
  { n: "Karim Bencheikh", role: "Head of Trust & Care", bio: "12 ans de coordination événementielle terrain." },
];

const values = [
  { l: "L'humain d'abord", desc: "Chaque support est traité par une personne, pas un chatbot. 24 minutes de délai moyen de réponse." },
  { l: "La beauté est un droit", desc: "1% du CA reversé à la Fondation pour rendre les célébrations accessibles à tous." },
  { l: "La sobriété comme luxe", desc: "Zéro gaspillage numérique. Nos serveurs sont alimentés à 100% en énergies renouvelables." },
  { l: "L'ambition d'un standard", desc: "Nous voulons devenir l'infrastructure des moments qui comptent en Europe, pas simplement une app." },
];

function About() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/app" className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">À propos</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Lyon · fondée en janvier 2024</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Building2 className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-foreground to-primary-dark p-7 text-white shadow-modal">
          <Award className="h-6 w-6" />
          <h2 className="mt-2 font-display text-4xl leading-tight">Les plus beaux jours méritent une infrastructure à leur hauteur.</h2>
          <p className="mt-4 text-sm opacity-90">Née d'un mariage raté à cause d'un Excel partagé. Une équipe de 24 personnes basée à Lyon, une mission : que plus jamais un moment de vie ne soit gâché par un outil médiocre.</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">L'équipe fondatrice</h3>
          <div className="space-y-3">
            {team.map((t) => (
              <div key={t.n} className="rounded-2xl border border-border/50 bg-card p-4 flex gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-gold shrink-0" />
                <div>
                  <p className="font-medium text-sm">{t.n}</p>
                  <p className="text-xs text-primary">{t.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Nos convictions</h3>
          <div className="space-y-3">
            {values.map((v) => (
              <div key={v.l} className="rounded-[26px] bg-surface p-5 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/30">
                <p className="font-display text-lg">{v.l}</p>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">MaFeliza SAS</p>
          <p className="text-xs text-muted-foreground mt-1">42 rue Auguste Comte, 69002 Lyon · RCS Lyon 927 384 552 · Société à mission depuis mai 2025.</p>
        </div>
      </main>
    </div>
  );
}
