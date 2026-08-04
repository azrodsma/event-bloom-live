import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, HeartHandshake, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/events/$slug/first-look")({
  component: FirstLook,
  head: () => ({
    meta: [
      { title: "First look · MaFeliza" },
      { name: "description", content: "Orchestration de la première rencontre entre les mariés." },
      { property: "og:title", content: "First look · MaFeliza" },
      { property: "og:description", content: "Ce moment suspendu, avant les autres." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const steps = [
  { h: "14:45", l: "Photographe en position", d: "Objectif 85mm · lumière côté jardin roseraie" },
  { h: "14:50", l: "Thomas placé dos tourné", d: "Bosquet de rosiers · silence demandé aux témoins" },
  { h: "14:55", l: "Léa avance en silence", d: "Robe portée par témoine · voile ajusté" },
  { h: "15:00", l: "Tape épaule + retournement", d: "3 minutes seuls · aucun invité autour" },
  { h: "15:05", l: "Bulle d'échange", d: "Cadeaux mutuels + lecture d'une lettre" },
  { h: "15:20", l: "Fin & départ vers cérémonie", d: "Retouche coiffure/maquillage rapide" },
];

function FirstLook() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">First look</h1>
            <p className="text-xs text-muted-foreground">14:45 → 15:20 · Roseraie</p>
          </div>
          <HeartHandshake className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white">
          <Sparkles className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Se voir avant tout le monde. Respirer.</h2>
          <p className="mt-3 text-sm opacity-90">35 minutes hors du temps. Personne d'autre que vous, le photographe, et le silence des roses.</p>
        </section>

        <section className="space-y-3">
          {steps.map((s, i) => (
            <div key={s.h} className="rounded-2xl border border-border/50 bg-card p-4 flex gap-4">
              <div className="flex flex-col items-center">
                <span className="rounded-full bg-primary text-white w-8 h-8 flex items-center justify-center font-display text-sm">{i + 1}</span>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{s.l}</p>
                  <span className="text-xs text-primary">{s.h}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-border/50 bg-card p-4 flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-sm">Personnes autorisées sur la zone</p>
            <p className="text-xs text-muted-foreground">Photographe (Marion) · vidéaste (Studio Paloma) · témoines de la mariée pour aide robe · personne d'autre.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
