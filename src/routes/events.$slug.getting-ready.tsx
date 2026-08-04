import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, ClipboardCheck, Timer } from "lucide-react";

export const Route = createFileRoute("/events/$slug/getting-ready")({
  component: GettingReady,
  head: () => ({
    meta: [
      { title: "Préparatifs · MaFeliza" },
      { name: "description", content: "Le matin du grand jour, minute par minute." },
      { property: "og:title", content: "Préparatifs · MaFeliza" },
      { property: "og:description", content: "Un matin fluide, doux, sans oubli." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const timeline = [
  { t: "07:30", l: "Réveil doux", d: "Petit-déjeuner en famille · playlist calme" },
  { t: "08:30", l: "Arrivée coiffeuse Léna", d: "Suite nuptiale · 3 personnes" },
  { t: "10:00", l: "Maquillage Nadia", d: "Studio lumineux · retouches prévues" },
  { t: "11:15", l: "Photos préparatifs", d: "Théo photographe · robe suspendue" },
  { t: "12:00", l: "Déjeuner léger", d: "Plateau végétarien · thé blanc" },
  { t: "13:00", l: "Habillage & bijoux", d: "Corset · voile · alliance temporaire" },
  { t: "13:45", l: "First look parents", d: "Salon privé · moment intime" },
  { t: "14:30", l: "Départ voiture", d: "Rolls Silver Cloud · escorte témoins" },
];

const checklist = [
  "Alliances confiées au témoin", "Discours imprimé x2", "Batterie externe HF",
  "Kit couture d'urgence", "Voile brossé", "Chaussures rodées", "Bouquet en eau",
];

function GettingReady() {
  const { slug } = useParams({ from: "/events/$slug/getting-ready" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Préparatifs du matin</p>
          <p className="text-xs text-muted-foreground">Le grand jour, minute par minute</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/25 p-6 shadow-card">
          <Sparkles className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Un matin fluide, sans oubli</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Timing partagé avec la coiffeuse, la MUA, le photographe et vos témoins. Chacun sait où être, à quelle heure, avec quoi.
          </p>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Timer className="h-3.5 w-3.5" /> Fil du matin
          </p>
          <div className="space-y-2">
            {timeline.map((s) => (
              <article key={s.t} className="flex gap-4 rounded-2xl bg-surface p-4 shadow-soft">
                <div className="flex-shrink-0">
                  <p className="font-serif text-2xl text-primary-dark">{s.t}</p>
                </div>
                <div className="min-w-0 flex-1 border-l border-border/60 pl-4">
                  <p className="text-sm font-semibold">{s.l}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{s.d}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80">
            <ClipboardCheck className="h-3.5 w-3.5" /> À vérifier avant de partir
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {checklist.map((c) => (
              <li key={c} className="flex items-center gap-2 rounded-full bg-background/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {c}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
