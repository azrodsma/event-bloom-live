import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Handshake, Users, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/partners")({
  component: Partners,
  head: () => ({
    meta: [
      { title: "Partenaires · MaFeliza" },
      { name: "description", content: "Programme partenaires : distributeurs, marques et prestataires." },
      { property: "og:title", content: "Partenaires · MaFeliza" },
      { property: "og:description", content: "Grandir ensemble." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const tracks = [
  { l: "Wedding planners", desc: "20% de commission récurrente · onboarding client en 24h", n: "312 pros" },
  { l: "Marques lifestyle", desc: "Placement dans notre catalogue récompenses (1,8 M invités actifs)", n: "48 marques" },
  { l: "Lieux de réception", desc: "Widget MaFeliza intégré à votre site · pré-remplissage événement", n: "620 lieux" },
  { l: "Créateurs & médias", desc: "Programme d'affiliation 15% + kit contenus", n: "1 240 créateurs" },
];

function Partners() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/app" className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Partenaires</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">4 programmes · 2 220 partenaires actifs</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Handshake className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white">
          <p className="text-xs uppercase tracking-widest opacity-80">Rejoindre le club</p>
          <h2 className="mt-2 font-display text-2xl">Aider les organisateurs à célébrer mieux, ensemble.</h2>
          <p className="mt-2 text-sm opacity-90">Reversement moyen mensuel : 2 480 € par partenaire actif. Zéro exclusivité, zéro engagement.</p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {tracks.map((t) => (
            <div key={t.l} className="rounded-[26px] bg-surface p-5 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/30">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <p className="font-display text-lg">{t.l}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <p className="mt-3 text-xs text-primary flex items-center gap-1"><TrendingUp className="h-3 w-3" />{t.n}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[26px] bg-gradient-mesh p-6 shadow-card ring-1 ring-border/60">
          <p className="font-display text-lg">Postuler au programme</p>
          <p className="text-xs text-muted-foreground mt-1">Réponse sous 5 jours ouvrés. Onboarding 100% en ligne.</p>
          <button className="mt-3 rounded-full bg-foreground px-5 py-2.5 text-sm text-white">Candidater</button>
        </section>
      </main>
    </div>
  );
}
