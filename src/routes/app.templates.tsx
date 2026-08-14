import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Palette, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/app/templates")({
  component: Templates,
  head: () => ({
    meta: [
      { title: "Modèles d'événement · MaFeliza" },
      { name: "description", content: "Démarrez en 3 clics avec un modèle inspirant." },
      { property: "og:title", content: "Modèles d'événement · MaFeliza" },
      { property: "og:description", content: "Chaque célébration a son décor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const templates = [
  { l: "Mariage bohème", d: "Champ de lavande, teintes ivoire, guinguette", vibe: "Bohème doux", palette: ["#F5D5B5", "#E8C09F", "#8B7355"], time: "12 modules" },
  { l: "Mariage minimal", d: "Blanc cassé, verre soufflé, orchidée unique", vibe: "Minimal élégant", palette: ["#FFF8F4", "#D4CAB6", "#3F3B37"], time: "9 modules" },
  { l: "Baptême doux", d: "Aquarelle, bleu ciel, biscuits maison", vibe: "Tendre nuage", palette: ["#E6F0F5", "#FADCC6", "#D9A441"], time: "7 modules" },
  { l: "Anniversaire 40 ans", d: "Néon subtil, gastronomie, DJ vinyle", vibe: "Rétro-chic", palette: ["#2A1E2C", "#E85D8E", "#F5D66F"], time: "10 modules" },
  { l: "Cérémonie laïque", d: "Rituels du sable et du ruban", vibe: "Symbolique", palette: ["#D9A441", "#FFF8F4", "#8B4F5A"], time: "8 modules" },
  { l: "Fiançailles surprise", d: "Rooftop, coucher de soleil, jazz live", vibe: "Romance urbaine", palette: ["#E85D8E", "#3F3B37", "#F5D66F"], time: "6 modules" },
];

function Templates() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Modèles d'événement</p>
          <p className="text-xs text-muted-foreground">Démarrer en 3 clics</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary/25 via-cream to-gold/25 p-6 shadow-card">
          <Palette className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Chaque célébration a son décor</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Modèles pré-configurés avec modules, palette, typographie et checklist. Tout se personnalise ensuite.
          </p>
        </section>

        <section className="grid gap-3">
          {templates.map((t) => (
            <article key={t.l} className="overflow-hidden rounded-3xl bg-surface shadow-soft">
              <div className="flex h-24 items-center" style={{ background: `linear-gradient(120deg, ${t.palette[0]}, ${t.palette[1]}, ${t.palette[2]})` }} />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-serif text-xl leading-tight">{t.l}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{t.d}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-dark">
                    {t.vibe}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {t.palette.map((c) => (
                      <span key={c} className="h-5 w-5 rounded-full border-2 border-background" style={{ background: c }} />
                    ))}
                    <span className="ml-2 text-[11px] text-muted-foreground">{t.time}</span>
                  </div>
                  <button className="flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
                    Utiliser <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80">
            <Sparkles className="h-3.5 w-3.5" /> Modèle IA sur-mesure
          </div>
          <p className="mt-2 text-sm">Décrivez votre vibe en 2 phrases, notre IA construit un modèle personnalisé.</p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">Créer avec l'IA</button>
        </section>
      </main>
    </div>
  );
}
