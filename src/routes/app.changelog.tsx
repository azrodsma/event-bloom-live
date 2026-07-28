import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Newspaper, Sparkles, Clock } from "lucide-react";

export const Route = createFileRoute("/app/changelog")({
  component: Changelog,
  head: () => ({
    meta: [
      { title: "Nouveautés · Memento Live" },
      { name: "description", content: "Les dernières fonctionnalités et améliorations de Memento Live." },
      { property: "og:title", content: "Nouveautés · Memento Live" },
      { property: "og:description", content: "Suivez l'évolution de l'app." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const entries = [
  {
    v: "3.7",
    date: "28 juil. 2026",
    tag: "Nouveauté",
    title: "Studio de portraits IA",
    body: "Générez un portrait de couple dans 12 styles artistiques à partir de vos photos.",
    color: "from-primary to-primary-dark",
  },
  {
    v: "3.6",
    date: "14 juil. 2026",
    tag: "Amélioration",
    title: "Timeline média plus fluide",
    body: "Réordonnancement drag & drop et synchronisation instantanée avec l'équipe photo.",
    color: "from-gold to-primary-dark",
  },
  {
    v: "3.5",
    date: "30 juin 2026",
    tag: "Nouveauté",
    title: "Partage des frais",
    body: "Répartissez EVJF, EVG et cadeaux entre témoins sans manipuler un centime.",
    color: "from-primary to-gold",
  },
  {
    v: "3.4",
    date: "12 juin 2026",
    tag: "Correctif",
    title: "Notifications live plus précises",
    body: "Fin des doublons quand plusieurs caméras diffusent simultanément.",
    color: "from-muted to-foreground",
  },
  {
    v: "3.3",
    date: "1 juin 2026",
    tag: "Nouveauté",
    title: "Traductions live",
    body: "Sous-titres automatiques en 12 langues pour vos invités internationaux.",
    color: "from-primary-dark to-foreground",
  },
];

const tagColor: Record<string, string> = {
  Nouveauté: "bg-primary text-white",
  Amélioration: "bg-gold text-foreground",
  Correctif: "bg-cream text-primary-dark",
};

function Changelog() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Nouveautés</p>
          <p className="text-xs text-muted-foreground">v3.7 · {entries.length} entrées</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <Newspaper className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">L'app évolue chaque semaine</p>
          <p className="mt-2 text-sm opacity-90">
            Chaque idée d'utilisateur est lue, votée et priorisée par notre équipe produit.
          </p>
          <button className="mt-4 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur">
            <Sparkles className="mr-1 inline h-3.5 w-3.5" /> Proposer une idée
          </button>
        </section>

        <div className="relative">
          <div className="absolute left-[22px] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-4">
            {entries.map((e) => (
              <article key={e.v} className="relative flex gap-3">
                <div className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${e.color} font-bold text-white shadow-glow`}>
                  {e.v}
                </div>
                <div className="min-w-0 flex-1 rounded-2xl bg-surface p-4 shadow-soft">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${tagColor[e.tag]}`}>
                      {e.tag}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {e.date}
                    </span>
                  </div>
                  <p className="mt-2 font-serif text-lg leading-tight">{e.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <section className="rounded-3xl bg-cream p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">Prochainement</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">🎙️ Podcast automatique des souvenirs vocaux</li>
            <li className="flex items-center gap-2">🌍 Événements collaboratifs à distance</li>
            <li className="flex items-center gap-2">🧠 Coach IA de placement de table</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
