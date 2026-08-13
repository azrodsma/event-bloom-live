import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mic2, Heart, Clock } from "lucide-react";

export const Route = createFileRoute("/events/$slug/speeches")({
  component: Speeches,
  head: () => ({
    meta: [
      { title: "Discours · MaFeliza" },
      { name: "description", content: "Ordre de passage, minutages et coach IA pour les discours." },
      { property: "og:title", content: "Discours · MaFeliza" },
      { property: "og:description", content: "Chaque mot compte. Chaque minute aussi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const speakers = [
  { l: "Père de la mariée", h: "20:15", dur: "4 min", status: "Prêt", tone: "Ému et fier" },
  { l: "Témoin du marié · Antoine", h: "20:22", dur: "5 min", status: "En relecture", tone: "Drôle" },
  { l: "Témoines de la mariée · Sarah & Julie", h: "20:30", dur: "6 min", status: "Prêt", tone: "Chanson + anecdotes" },
  { l: "Mère du marié", h: "20:40", dur: "3 min", status: "Confidentiel", tone: "Tendre" },
  { l: "Les mariés", h: "20:45", dur: "5 min", status: "Prêt", tone: "Remerciements" },
];

function Speeches() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Discours</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">5 prises de parole · 23 min total</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Mic2 className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white">
          <p className="text-xs uppercase tracking-widest opacity-80">Créneau protégé</p>
          <h2 className="mt-2 font-display text-2xl">20:15 → 20:50 · Après l'entrée</h2>
          <p className="mt-2 text-sm opacity-90">Micro HF + retour scène, prompteur discret pour ceux qui le souhaitent, lumière tamisée sur la piste.</p>
        </section>

        <section className="space-y-3">
          {speakers.map((s) => (
            <div key={s.l} className="rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:ring-primary/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium">{s.l}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.h} · {s.dur}</span>
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{s.tone}</span>
                  </div>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{s.status}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[26px] bg-gradient-mesh p-6 shadow-card ring-1 ring-border/60">
          <p className="font-display text-lg">Coach IA discours</p>
          <p className="text-xs text-muted-foreground mt-1">Structurez, chronométrez, retirez les longueurs. Ton, humour, émotion : suggestions personnalisées.</p>
          <button className="mt-3 rounded-full bg-foreground px-5 py-2.5 text-sm text-white">Lancer une session</button>
        </section>
      </main>
    </div>
  );
}
