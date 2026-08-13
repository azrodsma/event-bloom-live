import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Wand2, Star } from "lucide-react";

export const Route = createFileRoute("/app/ai-studio")({
  component: AIStudio,
  head: () => ({
    meta: [
      { title: "Studio IA · MaFeliza" },
      { name: "description", content: "Vos assistants créatifs : plans de table, discours, mood board." },
      { property: "og:title", content: "Studio IA · MaFeliza" },
      { property: "og:description", content: "L'IA au service de votre plus beau jour." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const assistants = [
  { l: "Assistant vœux", d: "Rédigez, améliorez, chronométrez vos vœux avec un coach empathique.", tag: "Populaire", uses: "12 400 vœux" },
  { l: "Générateur mood board", d: "Décrivez votre univers · obtenez 6 planches d'inspiration.", tag: "Créatif", uses: "8 200 planches" },
  { l: "Rédacteur remerciements", d: "Un mot personnalisé pour chaque invité, en 30 secondes.", tag: "Gain de temps", uses: "24 600 cartes" },
  { l: "Plan de table optimiseur", d: "Contraintes familiales, affinités, allergies : le placement idéal.", tag: "Malin", uses: "3 800 mariages" },
  { l: "DJ conseiller playlist", d: "Analyse vos morceaux favoris · propose une playlist cohérente.", tag: "Musical", uses: "1 240 sets" },
  { l: "Traducteur live", d: "Sous-titres en 12 langues pendant la cérémonie et les discours.", tag: "Multilingue", uses: "620 événements" },
];

function AIStudio() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/app" className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Studio IA</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">6 assistants créatifs</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Wand2 className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white">
          <Sparkles className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">L'IA ne remplace pas l'émotion. Elle libère du temps pour la vivre.</h2>
          <p className="mt-3 text-sm opacity-90">Modèles hébergés en Europe · aucune donnée réutilisée pour l'entraînement.</p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {assistants.map((a) => (
            <div key={a.l} className="rounded-[26px] bg-surface p-5 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/30">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{a.tag}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" />{a.uses}</span>
              </div>
              <p className="mt-2 font-display text-lg">{a.l}</p>
              <p className="mt-1 text-xs text-muted-foreground">{a.d}</p>
              <button className="mt-3 w-full rounded-full bg-foreground py-2 text-sm text-white">Lancer</button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
