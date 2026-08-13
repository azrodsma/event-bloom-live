import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Wind } from "lucide-react";

export const Route = createFileRoute("/events/$slug/exit")({
  component: Exit,
  head: () => ({
    meta: [
      { title: "Sortie des mariés · MaFeliza" },
      { name: "description", content: "Scénographie de la sortie de cérémonie et lâcher symbolique." },
      { property: "og:title", content: "Sortie des mariés · MaFeliza" },
      { property: "og:description", content: "La photo emblématique se prépare, elle ne se croise pas les doigts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const options = [
  { l: "Pluie de pétales", cost: "180 €", eco: "★★★★★", desc: "Pétales de roses séchées naturelles · biodégradables · 4 kg", ok: true },
  { l: "Bulles géantes", cost: "95 €", eco: "★★★★☆", desc: "40 souffleurs à bulles · savon écologique · magique en photo", ok: true },
  { l: "Rubans & bâtons agités", cost: "220 €", eco: "★★★★★", desc: "Rubans de soie recyclée · réutilisables · silencieux", ok: false },
  { l: "Confettis papier", cost: "60 €", eco: "★★★☆☆", desc: "Confettis papier de riz colorés · attention nettoyage", ok: false },
  { l: "Lâcher de papillons", cost: "780 €", eco: "★★☆☆☆", desc: "60 papillons vivants · autorisation préfecture · debattable éthiquement", ok: false },
];

const timing = [
  { t: "16:30", l: "Fin de cérémonie · signature registres" },
  { t: "16:33", l: "Invités sortent devant l'église · haie d'honneur formée" },
  { t: "16:35", l: "MC distribue les pétales aux enfants d'honneur" },
  { t: "16:37", l: "Cloches sonnent · portes s'ouvrent" },
  { t: "16:38", l: "Sortie des mariés · pluie de pétales · 45 sec" },
  { t: "16:40", l: "Photo de groupe sur le parvis" },
];

function Exit() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Sortie de cérémonie</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Option retenue : pluie de pétales + bulles</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Sparkles className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white">
          <Wind className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">La sortie que le photographe attendait.</h2>
          <p className="mt-3 text-sm opacity-90">Vent prévu 8 km/h Sud-Ouest · idéal pour un tombé aérien des pétales sans les envoyer dans les cheveux.</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Options envisagées</h3>
          <div className="space-y-3">
            {options.map((o) => (
              <div key={o.l} className={`rounded-2xl border p-4 ${o.ok ? "border-primary bg-primary/5" : "border-border/50 bg-card"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium flex items-center gap-2">{o.l} {o.ok && <span className="text-[10px] rounded-full bg-primary px-2 py-0.5 text-white">Retenu</span>}</p>
                    <p className="text-xs text-primary mt-0.5">Éco {o.eco}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{o.cost}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{o.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Chronologie</h3>
          <div className="space-y-2">
            {timing.map((s) => (
              <div key={s.t} className="rounded-2xl border border-border/50 bg-card p-4 flex gap-4">
                <span className="font-display text-lg text-primary w-14">{s.t}</span>
                <p className="text-sm flex-1">{s.l}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
