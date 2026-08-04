import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, HandHeart, Package, Trees, Utensils } from "lucide-react";

export const Route = createFileRoute("/events/$slug/leftovers")({
  component: Leftovers,
  head: () => ({
    meta: [
      { title: "Anti-gaspi · MaFeliza" },
      { name: "description", content: "Redonnez une seconde vie à chaque plat, fleur et bouteille." },
      { property: "og:title", content: "Anti-gaspi · MaFeliza" },
      { property: "og:description", content: "Le lendemain compte autant que le jour J." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const streams = [
  { l: "Plats non servis", partner: "Linkee · Bel Ordinaire", qty: "18 portions", icon: Utensils, color: "from-primary to-primary-dark" },
  { l: "Compositions florales", partner: "Fleurs d'Ici · EHPAD Les Tilleuls", qty: "22 bouquets", icon: Trees, color: "from-gold to-primary" },
  { l: "Boissons intactes", partner: "Bar solidaire Emmaüs", qty: "38 bouteilles", icon: Package, color: "from-primary-dark to-foreground" },
  { l: "Textiles & décor", partner: "Ressourcerie du Cœur", qty: "3 palettes", icon: HandHeart, color: "from-foreground to-primary" },
];

function Leftovers() {
  const { slug } = useParams({ from: "/events/$slug/leftovers" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Anti-gaspi</p>
          <p className="text-xs text-muted-foreground">4 partenaires · collecte J+1 · 07h30</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/20 p-6 shadow-card">
          <HandHeart className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Le lendemain compte autant que le jour J</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Aucun surplus ne finit à la poubelle : plats, fleurs et boissons sont redistribués à des associations locales.
          </p>
        </section>

        <section className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-2xl bg-primary/10 p-3">
            <p className="font-serif text-2xl text-primary-dark">142 kg</p>
            <p className="mt-0.5 text-muted-foreground">redistribués</p>
          </div>
          <div className="rounded-2xl bg-gold/25 p-3">
            <p className="font-serif text-2xl text-foreground">198 €</p>
            <p className="mt-0.5 text-muted-foreground">économisés</p>
          </div>
          <div className="rounded-2xl bg-foreground p-3 text-background">
            <p className="font-serif text-2xl">-84%</p>
            <p className="mt-0.5 opacity-80">déchets</p>
          </div>
        </section>

        <section className="space-y-2">
          {streams.map((s) => (
            <article key={s.l} className={`overflow-hidden rounded-2xl bg-gradient-to-br ${s.color} p-4 text-white shadow-soft`}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white/20">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-lg leading-tight">{s.l}</p>
                  <p className="text-xs opacity-85">{s.partner}</p>
                </div>
                <span className="rounded-full bg-white/25 px-2.5 py-1 text-[11px] font-semibold">{s.qty}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <p className="font-serif text-lg leading-tight">Certificat de générosité</p>
          <p className="mt-1 text-sm opacity-80">
            Vos invités reçoivent un email élégant récapitulant les dons effectués grâce à leur présence.
          </p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold">Prévisualiser le certificat</button>
        </section>
      </main>
    </div>
  );
}
