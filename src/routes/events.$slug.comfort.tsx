import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Snowflake, Sun, Umbrella, Wind } from "lucide-react";

export const Route = createFileRoute("/events/$slug/comfort")({
  component: Comfort,
  head: () => ({
    meta: [
      { title: "Confort invités · Memento Live" },
      { name: "description", content: "Anticipez chaque détail pour que vos invités oublient tout sauf la joie." },
      { property: "og:title", content: "Confort invités · Memento Live" },
      { property: "og:description", content: "Le luxe c'est de ne penser à rien." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const kits = [
  { icon: Sun, label: "Kit soleil", items: ["Éventails paille", "Crème SPF 50", "Lunettes recyclées", "Brumisateurs"], ok: 142, color: "from-gold to-primary" },
  { icon: Umbrella, label: "Kit pluie", items: ["Parapluies transparents", "Bottines caoutchouc", "Ponchos beige", "Serviettes chaudes"], ok: 60, color: "from-primary-dark to-foreground" },
  { icon: Wind, label: "Kit frais", items: ["Plaids ivoire", "Bougies extérieur", "Boissons chaudes", "Chauffages design"], ok: 40, color: "from-primary to-primary-dark" },
  { icon: Snowflake, label: "Kit détente", items: ["Chaussons cocoon", "Rafraîchisseur pieds", "Barre à baumes", "Kit couture d'urgence"], ok: 30, color: "from-cream to-gold" },
];

function Comfort() {
  const { slug } = useParams({ from: "/events/$slug/comfort" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Confort invités</p>
          <p className="text-xs text-muted-foreground">4 kits actifs · 272 attentions</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/10 to-gold/20 p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">Concept</p>
          <p className="mt-2 font-serif text-3xl leading-tight">Le luxe, c'est de ne penser à rien.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Nous anticipons météo, fatigue et petits imprévus — pour que vos invités n'aient qu'à profiter.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-3">
          {kits.map((k) => (
            <article key={k.label} className={`overflow-hidden rounded-3xl bg-gradient-to-br ${k.color} p-5 text-white shadow-soft`}>
              <div className="flex items-center gap-3">
                <k.icon className="h-6 w-6" />
                <div>
                  <p className="font-serif text-xl leading-tight">{k.label}</p>
                  <p className="text-xs opacity-80">{k.ok} attentions préparées</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {k.items.map((it) => (
                  <span key={it} className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium">{it}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <p className="font-serif text-lg leading-tight">Bar à petits soins</p>
          <p className="mt-1 text-sm opacity-80">
            Un espace discret entre bar et vestiaires : pansements, lingettes, mouchoirs brodés, épingles à nourrice, mini-dentifrices.
          </p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold">Commander le bar — 148 €</button>
        </section>
      </main>
    </div>
  );
}
