import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield, FileText, Users, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/app/legal")({
  component: Legal,
  head: () => ({
    meta: [
      { title: "Confidentialité & mentions · MaFeliza" },
      { name: "description", content: "Toute la clarté sur vos droits et nos engagements." },
      { property: "og:title", content: "Confidentialité · MaFeliza" },
      { property: "og:description", content: "RGPD, hébergement UE, chiffrement bout-en-bout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const commitments = [
  { title: "Hébergement 100% Union européenne", desc: "Serveurs OVH Roubaix · redondance Gravelines. Aucune donnée quittant l'UE.", icon: Shield },
  { title: "Chiffrement bout-en-bout", desc: "Vos souvenirs, messages vocaux et livres d'or sont chiffrés AES-256 côté client.", icon: FileText },
  { title: "Zéro revente de données", desc: "Nous ne monétisons jamais vos contenus ou vos listes d'invités.", icon: Users },
];

const docs = [
  { name: "Conditions générales", updated: "12 mars 2026" },
  { name: "Politique de confidentialité", updated: "12 mars 2026" },
  { name: "Politique cookies", updated: "05 février 2026" },
  { name: "Charte modération IA", updated: "22 janvier 2026" },
  { name: "Registre des sous-traitants", updated: "08 mars 2026" },
  { name: "Contact DPO", updated: "permanent" },
];

function Legal() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Confidentialité</p>
          <p className="text-xs text-muted-foreground">Vos droits, sans jargon</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-foreground via-primary-dark to-primary p-6 text-white shadow-card">
          <Shield className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Ce que vous partagez vous appartient</p>
          <p className="mt-2 text-sm opacity-90">
            Aucune donnée sensible n'est utilisée à des fins publicitaires. Vous pouvez tout exporter ou supprimer à tout moment.
          </p>
        </section>

        <section className="space-y-2">
          {commitments.map((c) => (
            <article key={c.title} className="flex gap-3 rounded-2xl bg-surface p-4 shadow-soft">
              <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary/15 text-primary-dark">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{c.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
              </div>
            </article>
          ))}
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Documents</p>
          <div className="overflow-hidden rounded-2xl bg-surface shadow-soft">
            {docs.map((d, i) => (
              <button key={d.name} className={`flex w-full items-center gap-3 p-4 text-left ${i > 0 ? "border-t border-border/40" : ""}`}>
                <FileText className="h-4 w-4 text-primary-dark" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground">Mise à jour · {d.updated}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-cream p-5 shadow-soft">
          <p className="font-serif text-lg leading-tight">Exercer mes droits RGPD</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Accès, portabilité, rectification, opposition, effacement — réponse sous 72 h.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background">Demander mes données</button>
            <button className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">Supprimer mon compte</button>
          </div>
        </section>
      </main>
    </div>
  );
}
