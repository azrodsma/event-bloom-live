import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/billing")({
  component: Billing,
  head: () => ({
    meta: [
      { title: "Abonnement · MaFeliza" },
      { name: "description", content: "Gérez votre formule MaFeliza et vos options premium." },
      { property: "og:title", content: "Abonnement · MaFeliza" },
      { property: "og:description", content: "Une formule pensée pour chaque événement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const plans = [
  { name: "Découverte", price: "Gratuit", tag: "Actuel", features: ["1 événement", "Livre d'or basique", "50 invités max", "Publicité douce"], color: "from-surface to-cream", active: true },
  { name: "Signature", price: "9 €", period: "/ événement", features: ["Événements illimités", "Livre d'or multimédia HD", "500 invités", "Aucune publicité", "Album collaboratif 4K"], color: "from-primary to-primary-dark", featured: true },
  { name: "Prestige", price: "29 €", period: "/ événement", features: ["Tout Signature", "Concierge IA prioritaire", "Domaine personnalisé", "Impression livre inclus", "Support 24/7"], color: "from-foreground to-primary-dark" },
];

function Billing() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Abonnement</p>
          <p className="text-xs text-muted-foreground">Formule Découverte · sans engagement</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/20 p-6 shadow-card">
          <Sparkles className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Un tarif par événement, sans abonnement caché</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Vous ne payez que lorsque vous célébrez. Aucun renouvellement automatique.
          </p>
        </section>

        <div className="space-y-3">
          {plans.map((p) => (
            <article key={p.name} className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${p.color} p-5 shadow-card ${p.featured ? "text-white" : "text-foreground"}`}>
              {p.featured && (
                <span className="absolute right-4 top-4 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase text-foreground">
                  Recommandé
                </span>
              )}
              {p.active && (
                <span className="absolute right-4 top-4 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase text-background">
                  Actuel
                </span>
              )}
              <p className={`text-xs font-semibold uppercase tracking-wider ${p.featured ? "opacity-80" : "text-muted-foreground"}`}>
                {p.tag ?? "Formule"}
              </p>
              <p className="mt-2 font-serif text-3xl leading-tight">{p.name}</p>
              <p className="mt-1 font-serif text-4xl leading-none">
                {p.price}
                {p.period && <span className={`ml-1 text-sm ${p.featured ? "opacity-70" : "text-muted-foreground"}`}>{p.period}</span>}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${p.featured ? "text-white" : "text-primary-dark"}`} />
                    <span className={p.featured ? "opacity-95" : ""}>{f}</span>
                  </li>
                ))}
              </ul>
              {!p.active && (
                <button className={`mt-5 w-full rounded-full py-2.5 text-sm font-semibold ${p.featured ? "bg-white text-primary-dark" : "bg-foreground text-background"}`}>
                  Choisir cette formule
                </button>
              )}
            </article>
          ))}
        </div>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5" /> Moyens de paiement
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Carte, Apple Pay, Google Pay, virement SEPA. Facture PDF automatique après paiement.
          </p>
        </section>
      </main>
    </div>
  );
}
