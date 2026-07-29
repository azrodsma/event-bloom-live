import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Users, Sparkles, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/events/$slug/witnesses")({
  component: Witnesses,
  head: () => ({
    meta: [
      { title: "Témoins · Memento Live" },
      { name: "description", content: "Coordonnez vos témoins et leurs missions." },
      { property: "og:title", content: "Témoins · Memento Live" },
      { property: "og:description", content: "Ceux qui tiennent le fil du grand jour." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const witnesses = [
  { name: "Julie", side: "Mariée", mission: "EVJF · discours · aide vestimentaire", color: "from-primary to-gold" },
  { name: "Alice", side: "Mariée", mission: "Logistique J-1 · bouquet · dépôt cadeaux", color: "from-gold to-primary-dark" },
  { name: "Léo", side: "Marié", mission: "EVG · discours · escorte cortège", color: "from-primary-dark to-foreground" },
  { name: "Karim", side: "Marié", mission: "Alliances · musique · playlist bal", color: "from-foreground to-primary" },
];

const briefs = [
  { l: "Réunion virtuelle", d: "J-30 · 20h", note: "Répartition des missions" },
  { l: "Dernier point", d: "J-3 · 18h", note: "Répétition discours" },
  { l: "Débrief au calme", d: "J+7", note: "Retours et souvenirs" },
];

function Witnesses() {
  const { slug } = useParams({ from: "/events/$slug/witnesses" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Témoins</p>
          <p className="text-xs text-muted-foreground">4 témoins · 12 missions</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/20 p-6 shadow-card">
          <HeartHandshake className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Ceux qui tiennent le fil du grand jour</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Un espace privé pour vos témoins : missions, budget commun, groupe messagerie et discours en préparation.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-2">
          {witnesses.map((w) => (
            <article key={w.name} className={`overflow-hidden rounded-2xl bg-gradient-to-br ${w.color} p-4 text-white shadow-soft`}>
              <div className="flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white/25 font-bold">{w.name[0]}</div>
                <div className="min-w-0">
                  <p className="font-serif text-lg leading-tight">{w.name}</p>
                  <p className="text-[10px] font-bold uppercase opacity-80">Côté {w.side}</p>
                </div>
              </div>
              <p className="mt-3 text-xs opacity-90">{w.mission}</p>
            </article>
          ))}
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> Points de coordination
          </p>
          <div className="space-y-2">
            {briefs.map((b) => (
              <article key={b.l} className="flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-soft">
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-primary/15 text-primary-dark">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{b.l}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{b.d} · {b.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <button className="w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background">Ouvrir le canal témoins</button>
      </main>
    </div>
  );
}
