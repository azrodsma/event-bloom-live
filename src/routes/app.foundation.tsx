import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, HeartHandshake, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/foundation")({
  component: Foundation,
  head: () => ({
    meta: [
      { title: "Fondation MaFeliza · MaFeliza" },
      { name: "description", content: "Notre fondation soutient les familles endeuillées et les mariages solidaires." },
      { property: "og:title", content: "Fondation MaFeliza · MaFeliza" },
      { property: "og:description", content: "1% du chiffre d'affaires reversé chaque année." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const programs = [
  { l: "Mariages solidaires", desc: "Offre 100% gratuite pour les couples aux revenus modestes ou en situation de handicap. 240 mariages financés depuis 2024.", budget: "180 000 €" },
  { l: "Baptêmes en soins palliatifs", desc: "Coordination d'urgence en 48h pour familles hospitalisées. Prestataires bénévoles, souvenirs offerts.", budget: "45 000 €" },
  { l: "Fonds mémoire", desc: "Archivage numérique gratuit à vie des événements des familles endeuillées.", budget: "12 000 €" },
  { l: "Écoles de la joie", desc: "Ateliers dans les écoles primaires : célébrer sans consommer. 12 écoles pilotes en Île-de-France.", budget: "28 000 €" },
  { l: "Bourse Jeunes Artisans", desc: "10 bourses annuelles de 5 000 € pour de jeunes calligraphes, fleuristes, pâtissiers.", budget: "50 000 €" },
];

function Foundation() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/app" className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Fondation MaFeliza</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Reconnue d'intérêt général · 2024</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <HeartHandshake className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white">
          <Sparkles className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">1% de nos revenus. 100% des moments qui comptent.</h2>
          <p className="mt-3 text-sm opacity-90">La Fondation MaFeliza agit pour que la joie ne soit jamais réservée à ceux qui peuvent se la payer.</p>
          <div className="mt-5 grid grid-cols-3 gap-4 text-center">
            <div><p className="font-display text-2xl">315 K€</p><p className="text-[10px] opacity-70">budget 2026</p></div>
            <div><p className="font-display text-2xl">240</p><p className="text-[10px] opacity-70">mariages offerts</p></div>
            <div><p className="font-display text-2xl">18</p><p className="text-[10px] opacity-70">bénévoles actifs</p></div>
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Nos programmes</h3>
          <div className="space-y-3">
            {programs.map((p) => (
              <div key={p.l} className="rounded-2xl border border-border/50 bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-lg">{p.l}</p>
                  <span className="text-xs text-primary shrink-0">{p.budget}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-cream p-5">
          <p className="font-medium text-sm">Soutenir la fondation</p>
          <p className="text-xs text-muted-foreground mt-1">Don ponctuel · déductible à 66% des impôts (loi française) · reçu fiscal envoyé sous 15 jours.</p>
          <button className="mt-3 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white">Faire un don</button>
        </section>
      </main>
    </div>
  );
}
