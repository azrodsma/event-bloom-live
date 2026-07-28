import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Handshake, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/ambassadors")({
  component: Ambassadors,
  head: () => ({
    meta: [
      { title: "Ambassadeurs Memento · Memento Live" },
      { name: "description", content: "Programme ambassadeurs : parrainez, gagnez, célébrez." },
      { property: "og:title", content: "Ambassadeurs · Memento Live" },
      { property: "og:description", content: "Vos amis se marient ? Faites-leur découvrir Memento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const tiers = [
  { l: "Confident", cond: "1 parrainage réussi", perks: ["50 € offerts en crédit", "Badge doré profil"] },
  { l: "Complice", cond: "5 parrainages", perks: ["Pack impression premium offert", "Accès bêta anticipé", "Un ticket concert Memento Live"] },
  { l: "Icône", cond: "20 parrainages", perks: ["Week-end découverte lieu partenaire", "Nom gravé sur le mur des ambassadeurs Lyon HQ", "Consultation privée avec CEO"] },
];

const currentAmb = [
  { n: "Camille Rousseau", city: "Bordeaux", ref: 47, tier: "Icône" },
  { n: "Jules Bertrand", city: "Marseille", ref: 23, tier: "Icône" },
  { n: "Sarah Ndiaye", city: "Paris", ref: 12, tier: "Complice" },
  { n: "Vous", city: "—", ref: 3, tier: "Confident" },
];

function Ambassadors() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/app" className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Ambassadeurs</h1>
            <p className="text-xs text-muted-foreground">2 847 ambassadeurs actifs</p>
          </div>
          <Handshake className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-gold/20 via-cream to-primary/10 p-6">
          <p className="text-xs uppercase tracking-widest text-primary">Votre code</p>
          <p className="mt-2 font-display text-4xl">LEA-2026</p>
          <p className="mt-2 text-sm text-muted-foreground">Chaque personne qui organise un événement avec votre code reçoit 30 € offerts. Vous aussi.</p>
          <button className="mt-4 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-white">Partager le lien</button>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Paliers</h3>
          <div className="space-y-3">
            {tiers.map((t) => (
              <div key={t.l} className="rounded-2xl border border-border/50 bg-card p-5">
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg">{t.l}</p>
                  <span className="text-xs text-muted-foreground">{t.cond}</span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {t.perks.map((p) => <li key={p}>· {p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />Classement mensuel</h3>
          <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/50">
            {currentAmb.map((a, i) => (
              <div key={a.n} className={`p-4 flex items-center gap-3 ${a.n === "Vous" ? "bg-primary/5" : ""}`}>
                <span className="font-display text-lg w-6">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.n}</p>
                  <p className="text-xs text-muted-foreground">{a.city} · {a.tier}</p>
                </div>
                <span className="text-sm text-primary">{a.ref}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
