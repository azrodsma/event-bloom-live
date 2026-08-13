import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Package2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/events/$slug/rentals")({
  component: Rentals,
  head: () => ({
    meta: [
      { title: "Location matériel · MaFeliza" },
      { name: "description", content: "Suivi des locations mobilier, vaisselle et arts de la table." },
      { property: "og:title", content: "Location matériel · MaFeliza" },
      { property: "og:description", content: "1 200 pièces livrées, comptées, restituées." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const cats = [
  { l: "Vaisselle porcelaine blanche filet or", qty: "444 assiettes (3 par pers.)", cost: "620 €", vendor: "Options · Bordeaux" },
  { l: "Verrerie cristal Zwiesel", qty: "592 verres (4 par pers.)", cost: "480 €", vendor: "Options · Bordeaux" },
  { l: "Couverts inox 18/10 mat", qty: "888 pièces", cost: "310 €", vendor: "Options · Bordeaux" },
  { l: "Chaises Napoléon III doré", qty: "150", cost: "525 €", vendor: "Alter Ego Réceptions" },
  { l: "Nappes lin naturel", qty: "18 x 3m", cost: "395 €", vendor: "Le Cercle du Lin" },
  { l: "Chandeliers en laiton vintage", qty: "54", cost: "195 €", vendor: "Alter Ego Réceptions" },
  { l: "Cabine photobooth années 30", qty: "1", cost: "890 €", vendor: "Retrophoto" },
  { l: "Chapiteau bambou 8x15m repli", qty: "1", cost: "1 240 €", vendor: "Bam'Boo Events" },
];

function Rentals() {
  const total = cats.reduce((a, c) => a + parseInt(c.cost.replace(/\D/g, "")), 0);
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link
            to="/events/$slug"
            params={{ slug: "mariage-lea-thomas" }}
            className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95"
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Location matériel</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">8 catégories · 4 loueurs partenaires</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Package2 className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-foreground to-primary-dark p-7 text-white shadow-modal">
          <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gold/25 blur-3xl" />
          <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-white/95">
            <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> Inventaire vérifié
          </span>
          <h2 className="mt-3 font-serif text-3xl leading-[1.05] sm:text-4xl">Livré, compté, restitué.</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
            Inventaire double au dépôt et à la restitution · caution récupérée à 100 % sur nos 84 derniers événements.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { v: `${total.toLocaleString("fr-FR")} €`, l: "total location" },
              { v: "4", l: "loueurs" },
              { v: "2 j", l: "forfait" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl px-3 py-3 text-center">
                <p className="font-serif text-xl leading-none text-white">{s.v}</p>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-white/70">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {cats.map((c) => (
            <div
              key={c.l}
              className="rounded-[26px] bg-surface p-5 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/30"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-serif text-base leading-snug">{c.l}</p>
                <span className="shrink-0 rounded-full bg-gold-light px-2.5 py-1 text-[11px] font-semibold text-gold">{c.cost}</span>
              </div>
              <p className="mt-2.5 inline-flex rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-medium text-primary">{c.qty}</p>
              <p className="mt-3 text-[11px] text-muted-foreground">via {c.vendor}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
