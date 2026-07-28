import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, PartyPopper, Music2 } from "lucide-react";

export const Route = createFileRoute("/events/$slug/bachelor-party")({
  component: BachelorParty,
  head: () => ({
    meta: [
      { title: "EVJF / EVG · Memento Live" },
      { name: "description", content: "Organisation de l'enterrement de vie de jeune fille et garçon." },
      { property: "og:title", content: "EVJF / EVG · Memento Live" },
      { property: "og:description", content: "Deux week-ends. Zéro cliché." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const evjf = { date: "16-18 mai · Lisbonne", org: "Sarah + Julie", people: 9, budget: "480 € / pers.", program: [
  "Vendredi · vol · dîner Cervejaria Ramiro",
  "Samedi · cours de céramique · surf débutant Costa Caparica",
  "Samedi soir · rooftop Park Bar · fado privé",
  "Dimanche · brunch bord de mer · vol retour"
]};

const evg = { date: "23-25 mai · Marseille", org: "Marc + Antoine", people: 11, budget: "395 € / pers.", program: [
  "Vendredi · train · apéro Vieux-Port",
  "Samedi · plongée calanques · pastis tasting Longchamp",
  "Samedi soir · dîner Chez Fonfon · Baby O club",
  "Dimanche · bouillabaisse · retour"
]};

function Card({ t, d }: { t: string; d: typeof evjf }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">{t}</p>
          <p className="font-display text-2xl mt-1">{d.date}</p>
        </div>
        <span className="text-xs text-muted-foreground">{d.people} pers.</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Organisation · {d.org} · Budget {d.budget}</p>
      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
        {d.program.map((p) => <li key={p}>· {p}</li>)}
      </ul>
    </div>
  );
}

function BachelorParty() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">EVJF & EVG</h1>
            <p className="text-xs text-muted-foreground">Deux week-ends, deux ambiances</p>
          </div>
          <PartyPopper className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white">
          <Music2 className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Célébrer, sans humilier.</h2>
          <p className="mt-3 text-sm opacity-90">Le pool budget est privé, les mariés n'ont accès qu'aux photos qu'on veut bien leur montrer. Message aux organisateurs : allez-y en douceur.</p>
        </section>

        <Card t="Enterrement de vie de jeune fille" d={evjf} />
        <Card t="Enterrement de vie de garçon" d={evg} />

        <section className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Cagnotte partagée</p>
          <p className="text-xs text-muted-foreground mt-1">Suivi en temps réel · 8 240 € collectés sur 9 850 € prévus. Remboursements automatiques si annulation.</p>
        </section>
      </main>
    </div>
  );
}
