import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ScrollText, Users } from "lucide-react";

export const Route = createFileRoute("/events/$slug/civil")({
  component: Civil,
  head: () => ({
    meta: [
      { title: "Mairie · MaFeliza" },
      { name: "description", content: "Dossier civil, témoins et coordination avec la mairie." },
      { property: "og:title", content: "Cérémonie civile · MaFeliza" },
      { property: "og:description", content: "Le vrai début. Signé, tamponné, célébré." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const docs = [
  { l: "Extraits d'acte de naissance (moins de 3 mois)", ok: true },
  { l: "Justificatif de domicile x2", ok: true },
  { l: "Pièces d'identité", ok: true },
  { l: "Liste des témoins (2 à 4)", ok: true },
  { l: "Contrat de mariage (facultatif)", ok: true, note: "Séparation de biens · Maître Lefèvre" },
  { l: "Attestation sur l'honneur célibat", ok: false, note: "À signer en mairie J-15" },
];

const witnesses = [
  { n: "Julie Martin", role: "Témoin mariée", born: "12/04/1994", pro: "Architecte" },
  { n: "Sarah Cohen", role: "Témoin mariée", born: "03/09/1995", pro: "Médecin" },
  { n: "Marc Dubois", role: "Témoin marié", born: "27/07/1992", pro: "Développeur" },
  { n: "Antoine Roche", role: "Témoin marié", born: "18/11/1993", pro: "Journaliste" },
];

function Civil() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Mairie · Civil</h1>
            <p className="text-xs text-muted-foreground">Saint-Émilion · 5 juin 11h00</p>
          </div>
          <ScrollText className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-6 text-white">
          <h2 className="font-display text-3xl leading-tight">Salle des mariages · 11h00.</h2>
          <p className="mt-2 text-sm opacity-90">Officiant : Madame le Maire, Isabelle Roquevert. Durée 30 min. Capacité 60 personnes assises.</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Dossier civil</h3>
          <div className="space-y-2">
            {docs.map((d) => (
              <div key={d.l} className="rounded-2xl border border-border/50 bg-card p-4 flex items-start gap-3">
                <span className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${d.ok ? "bg-primary text-white" : "bg-cream text-foreground border border-border"}`}>{d.ok ? "✓" : "!"}</span>
                <div className="flex-1">
                  <p className="text-sm">{d.l}</p>
                  {d.note && <p className="text-xs text-muted-foreground mt-1">{d.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3 flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Témoins</h3>
          <div className="space-y-2">
            {witnesses.map((w) => (
              <div key={w.n} className="rounded-2xl border border-border/50 bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{w.n}</p>
                    <p className="text-xs text-muted-foreground">{w.role}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{w.born}</p>
                    <p>{w.pro}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
