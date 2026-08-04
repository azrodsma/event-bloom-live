import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Beaker, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/labs")({
  component: Labs,
  head: () => ({
    meta: [
      { title: "Labs · MaFeliza" },
      { name: "description", content: "Testez en avant-première nos expérimentations : AR, hologrammes, IA vocale." },
      { property: "og:title", content: "Labs · MaFeliza" },
      { property: "og:description", content: "Les fonctionnalités de demain, activables aujourd'hui." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const experiments = [
  { l: "Filtres AR faire-part", tag: "Beta publique", desc: "Scannez le faire-part avec votre téléphone : le couple apparaît en 3D et vous invite en vidéo.", users: "1 240 testeurs" },
  { l: "Voix cloning invités absents", tag: "Alpha fermée", desc: "Vos proches trop loin enregistrent 30 sec, l'IA génère leur discours complet en synchro labiale.", users: "82 testeurs" },
  { l: "Hologramme des mariés", tag: "Concept", desc: "Projection Pepper's ghost pour les invités qui ne peuvent pas venir. Location cabine dédiée.", users: "En R&D" },
  { l: "Robot barman NAO", tag: "Pilote", desc: "Un bras robotisé prépare 4 cocktails signature. En test au Château de Chantilly juin 2026.", users: "6 événements" },
  { l: "Traduction simultanée AirPods", tag: "Beta fermée", desc: "Les discours sont traduits en direct dans les oreillettes de chaque invité (12 langues).", users: "340 testeurs" },
  { l: "Reconnaissance visage photos", tag: "Beta publique", desc: "Chaque invité retrouve automatiquement ses photos dans l'album (opt-in, chiffré local).", users: "3 100 testeurs" },
];

function Labs() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/app" className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">MaFeliza Labs</h1>
            <p className="text-xs text-muted-foreground">6 expérimentations · rejoignez la beta</p>
          </div>
          <Beaker className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white">
          <Sparkles className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Le futur des célébrations. En bêta.</h2>
          <p className="mt-3 text-sm opacity-90">Les Labs MaFeliza sont notre terrain de jeu R&D. Testez, cassez, dites-nous tout : on itère chaque semaine.</p>
        </section>

        <section className="space-y-3">
          {experiments.map((e) => (
            <div key={e.l} className="rounded-2xl border border-border/50 bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-lg">{e.l}</p>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary shrink-0">{e.tag}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{e.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{e.users}</span>
                <button className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-white">Rejoindre</button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
