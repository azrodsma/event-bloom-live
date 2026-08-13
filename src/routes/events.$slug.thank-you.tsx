import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/events/$slug/thank-you")({
  component: ThankYou,
  head: () => ({
    meta: [
      { title: "Remerciements · MaFeliza" },
      { name: "description", content: "Cartes de remerciement personnalisées envoyées après l'événement." },
      { property: "og:title", content: "Remerciements · MaFeliza" },
      { property: "og:description", content: "Un mot juste pour chaque invité, sans y passer trois week-ends." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const cards = [
  { n: "Famille Dubois", gift: "Service à thé Hermès", note: "Écrit à la main · illustration aquarelle personnalisée" },
  { n: "Marc & Julie", gift: "Contribution voyage de noces (300 €)", note: "Photo polaroid + carte pliée · en préparation" },
  { n: "Grand-mère Colette", gift: "Édredon brodé par ses soins", note: "Carte manuscrite + fleur pressée du bouquet · envoyée" },
  { n: "Collègues bureau", gift: "Robot Kitchenaid", note: "Photo groupée dédicacée · à envoyer" },
  { n: "Sofia & Pedro", gift: "Céramiques portugaises", note: "Carte bilingue FR/PT · à écrire" },
];

function ThankYou() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Remerciements</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">62 cartes · 18 envoyées · 44 en préparation</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Heart className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white">
          <MessageCircle className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Le mot qui compte, écrit dans les 30 jours.</h2>
          <p className="mt-3 text-sm opacity-90">L'IA rédige une ébauche personnalisée par cadeau reçu · vous relisez, corrigez, envoyez. Papier Original Crown Mill.</p>
        </section>

        <section className="space-y-2">
          {cards.map((c) => (
            <div key={c.n} className="rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:ring-primary/30">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">{c.n}</p>
                <span className="text-xs text-primary">{c.gift}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{c.note}</p>
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Impression & envoi groupé</p>
          <p className="text-xs text-muted-foreground mt-1">1,80 € par carte · timbre inclus · calligraphie main disponible (+2 €). Prochain envoi vendredi 12 juin.</p>
        </div>
      </main>
    </div>
  );
}
