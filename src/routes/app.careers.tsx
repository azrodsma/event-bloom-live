import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Handshake, Sparkles, MapPin } from "lucide-react";

export const Route = createFileRoute("/app/careers")({
  component: Careers,
  head: () => ({
    meta: [
      { title: "Carrières · MaFeliza" },
      { name: "description", content: "Rejoignez l'équipe qui préserve la mémoire des moments." },
      { property: "og:title", content: "Carrières · MaFeliza" },
      { property: "og:description", content: "Construisez avec nous la mémoire des célébrations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const openings = [
  { l: "Ingénieur·e produit senior", team: "Tech", loc: "Lyon · hybride", type: "CDI", color: "from-primary to-primary-dark" },
  { l: "Designer d'interaction", team: "Design", loc: "Paris · full remote", type: "CDI", color: "from-gold to-primary" },
  { l: "Chargé·e de relation utilisateur", team: "Support", loc: "Lyon · sur site", type: "CDI", color: "from-primary-dark to-foreground" },
  { l: "Développeur·se mobile React Native", team: "Tech", loc: "Full remote UE", type: "CDI", color: "from-foreground to-primary" },
  { l: "Stagiaire growth éditorial", team: "Marketing", loc: "Lyon", type: "Stage 6 mois", color: "from-primary/70 to-gold" },
];

const values = [
  { l: "Émotion d'abord", d: "Chaque décision teste ce qu'elle change pour l'utilisateur final." },
  { l: "Sobriété numérique", d: "Nous mesurons, réduisons, compensons — sans greenwashing." },
  { l: "Care en équipe", d: "Semaine de 4 jours, mutuelle famille, 8 semaines de congé parental additionnels." },
];

function Careers() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Carrières</p>
          <p className="text-xs text-muted-foreground">32 humains · 5 postes ouverts</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white shadow-card">
          <Handshake className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Construire la mémoire des célébrations</p>
          <p className="mt-2 text-sm opacity-90">
            On grandit doucement, on ne recrute qu'en cas de vraie nécessité, et chaque personne compte à parts égales.
          </p>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Postes ouverts</p>
          <div className="space-y-2">
            {openings.map((o) => (
              <article key={o.l} className={`overflow-hidden rounded-2xl bg-gradient-to-br ${o.color} p-4 text-white shadow-soft`}>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold uppercase">{o.team}</span>
                  <span className="text-[10px] opacity-90">{o.type}</span>
                </div>
                <p className="mt-2 font-serif text-lg leading-tight">{o.l}</p>
                <div className="mt-2 flex items-center gap-1 text-[11px] opacity-90">
                  <MapPin className="h-3 w-3" /> {o.loc}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Notre culture
          </p>
          <div className="space-y-2">
            {values.map((v) => (
              <article key={v.l} className="rounded-2xl bg-surface p-4 shadow-soft">
                <p className="text-sm font-semibold">{v.l}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{v.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-cream p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">Candidature spontanée</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Aucun poste correspondant ? Nous lisons tout. Envoyez-nous une lettre de motivation qui vous ressemble.
          </p>
          <button className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">Écrire à Delphine, RH</button>
        </section>
      </main>
    </div>
  );
}
