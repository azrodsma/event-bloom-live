import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert, Phone } from "lucide-react";

export const Route = createFileRoute("/events/$slug/crisis")({
  component: Crisis,
  head: () => ({
    meta: [
      { title: "Cellule de crise · MaFeliza" },
      { name: "description", content: "Numéros d'urgence, protocoles, rôle de chacun." },
      { property: "og:title", content: "Crise · MaFeliza" },
      { property: "og:description", content: "Prévu, écrit, entraîné : chaque scénario a sa parade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const scenarios = [
  { s: "Blessure invité", who: "Sofia (SST)", steps: "Trousse secours · appel 15 · isolement zone infirmerie" },
  { s: "Malaise mariée", who: "Wedding planner", steps: "Alerter témoins · loge climatisée · glucose · médecin de garde 04 68 22 xx" },
  { s: "Orage éclair", who: "MC + régie", steps: "Repli cocktail sous chapiteau · sécuriser DJ · bâches sono" },
  { s: "Retard traiteur >45 min", who: "Wedding planner", steps: "Backup Auberge du Pressoir · plateaux amuse-bouche · rallonger cocktail" },
  { s: "Panne son > 5 min", who: "DJ Nova", steps: "Bascule sono cellule mobile · playlist Spotify offline · fanfare live d'appoint" },
  { s: "Invité alcoolisé conflictuel", who: "MC + agent sécu", steps: "Espace décompression · appeler taxi Chauffeur Ludo (partenaire)" },
  { s: "Incendie grange", who: "Château + 18", steps: "Évacuation par 3 issues · point rassemblement parking VIP · check nominatif" },
];

const numbers = [
  { l: "SAMU", n: "15" },
  { l: "Pompiers", n: "18" },
  { l: "Gendarmerie Malviès", n: "04 68 76 xx xx" },
  { l: "Médecin de garde", n: "04 68 22 xx xx" },
  { l: "Wedding planner (24/7)", n: "06 71 xx xx xx" },
  { l: "Assurance Allianz sinistre", n: "01 58 38 xx xx" },
];

function Crisis() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Cellule de crise</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">7 scénarios · 6 contacts urgence</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <ShieldAlert className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-red-950 to-foreground p-6 text-white">
          <ShieldAlert className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Ne pas improviser. Jamais.</h2>
          <p className="mt-3 text-sm opacity-90">Chaque scénario a été co-écrit avec une infirmière urgentiste et un ancien capitaine des pompiers de Carcassonne.</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Numéros d'urgence</h3>
          <div className="grid grid-cols-2 gap-2">
            {numbers.map((c) => (
              <a key={c.l} href={`tel:${c.n.replace(/\s/g, "")}`} className="rounded-2xl border border-border/50 bg-card p-3 flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground truncate">{c.l}</p>
                  <p className="font-mono text-sm">{c.n}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Scénarios</h3>
          <div className="space-y-3">
            {scenarios.map((sc) => (
              <div key={sc.s} className="rounded-[26px] bg-surface p-5 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/30">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{sc.s}</p>
                  <span className="text-[10px] text-primary shrink-0 bg-primary/10 px-2 py-1 rounded-full">{sc.who}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{sc.steps}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
