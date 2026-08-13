import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Newspaper, Radio, Video } from "lucide-react";

export const Route = createFileRoute("/app/newsroom")({
  component: Newsroom,
  head: () => ({
    meta: [
      { title: "Newsroom · MaFeliza" },
      { name: "description", content: "Annonces produits, levées de fonds et prises de parole." },
      { property: "og:title", content: "Newsroom · MaFeliza" },
      { property: "og:description", content: "L'actualité de MaFeliza en un seul endroit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const posts = [
  { date: "Jul 2026", tag: "Produit", l: "MaFeliza franchit les 50 000 événements orchestrés", d: "Bilan chiffré de 18 mois de croissance et retour sur les fonctionnalités les plus utilisées." },
  { date: "Jun 2026", tag: "Levée", l: "3,2 M€ menés par Point Nine pour accélérer en Europe", d: "Ouverture de bureaux à Barcelone et Milan, +18 recrutements prévus d'ici fin 2026." },
  { date: "May 2026", tag: "Presse", l: "Vogue Business classe MaFeliza parmi les 25 start-up à suivre", d: "Article complet dans le numéro de juin, focus sur l'expérience premium et l'écosystème partenaires." },
  { date: "Apr 2026", tag: "Impact", l: "Certification B Corp obtenue avec la note 92,4", d: "Score dans le top 10% des entreprises tech européennes évaluées cette année." },
  { date: "Mar 2026", tag: "Produit", l: "Lancement du Studio IA et de l'assistant vœux", d: "Coaching empathique, chronométrage automatique, suggestions personnalisées : disponible pour tous les plans." },
];

const media = [
  { l: "Interview CEO · France Inter", icon: Radio, when: "Jun 2026" },
  { l: "Documentaire Konbini business", icon: Video, when: "Feb 2026" },
  { l: "Tribune Les Echos", icon: Newspaper, when: "Jan 2026" },
];

function Newsroom() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/app" className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Newsroom</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Communiqués, presse & médias</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Newspaper className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-foreground to-primary-dark p-7 text-white shadow-modal">
          <p className="text-xs uppercase tracking-widest opacity-70">À la une</p>
          <h2 className="mt-2 font-display text-2xl leading-tight">MaFeliza franchit les 50 000 événements orchestrés</h2>
          <p className="mt-2 text-sm opacity-90">18 mois de croissance, une équipe de 42 personnes, et un cap : devenir la référence européenne des célébrations privées.</p>
        </section>

        <section className="space-y-3">
          {posts.map((p) => (
            <div key={p.l} className="rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:ring-primary/30">
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{p.tag}</span>
                <span className="text-muted-foreground">{p.date}</span>
              </div>
              <p className="mt-2 font-display text-lg">{p.l}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Interventions médias</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {media.map((m) => (
              <div key={m.l} className="rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:ring-primary/30">
                <m.icon className="h-4 w-4 text-primary" />
                <p className="mt-2 font-medium text-sm">{m.l}</p>
                <p className="text-xs text-muted-foreground">{m.when}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
