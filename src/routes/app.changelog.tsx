import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/changelog")({
  component: Changelog,
  head: () => ({
    meta: [
      { title: "Nouveautés · MaFeliza" },
      { name: "description", content: "Toutes les nouveautés MaFeliza, semaine après semaine." },
      { property: "og:title", content: "Changelog · MaFeliza" },
      { property: "og:description", content: "Fonctionnalités livrées et améliorations continues." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const entries = [
  { d: "28 juil. 2026", t: "Studio de design IA", tag: "Nouveau", b: ["Génération de moodboards à partir d'un texte", "50 palettes prégénérées", "Export haute déf pour prestataires"] },
  { d: "21 juil. 2026", t: "Timeline photo intelligente", tag: "Nouveau", b: ["Calcul auto du golden hour", "Suggestion de créneaux famille", "Sync avec le photographe"] },
  { d: "14 juil. 2026", t: "Cortège musical", tag: "Amélioration", b: ["4 nouveaux styles disponibles", "Partition PDF pour musiciens live"] },
  { d: "07 juil. 2026", t: "Cave du jour J", tag: "Nouveau", b: ["Fiches cuvées MOF sommelier", "Analyse budget /pers", "Accords mets-vins"] },
  { d: "30 juin 2026", t: "Bilan carbone ADEME", tag: "Nouveau", b: ["Calcul officiel 3 scopes", "Compensation via Reforest'Action", "Export rapport RSE"] },
  { d: "23 juin 2026", t: "Traduction live LSF", tag: "Nouveau", b: ["Interprète LSF réservable H24", "Sous-titres live automatiques", "3 langues supplémentaires (AR, RU, JA)"] },
];

function Changelog() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/app" className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Nouveautés</h1>
            <p className="text-xs text-muted-foreground">Livré chaque mardi, sans exception</p>
          </div>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        {entries.map((e) => (
          <article key={e.d} className="rounded-3xl border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{e.d}</span>
              <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${e.tag === "Nouveau" ? "bg-primary/10 text-primary" : "bg-gold/20 text-gold-dark"}`}>{e.tag}</span>
            </div>
            <h2 className="font-display text-2xl mt-2">{e.t}</h2>
            <ul className="mt-3 space-y-1.5">
              {e.b.map((li) => (
                <li key={li} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary shrink-0">·</span>{li}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </main>
    </div>
  );
}
