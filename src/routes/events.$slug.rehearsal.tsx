import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Heart, Sparkles, Bookmark } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/rehearsal")({
  component: Rehearsal,
  head: () => ({
    meta: [
      { title: "Répétition · Memento Live" },
      { name: "description", content: "Chorégraphie de l'entrée, placements et timing — répétez la cérémonie sereinement." },
      { property: "og:title", content: "Répétition · Memento Live" },
      { property: "og:description", content: "Le jour J, tout coule de source." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Step = { id: number; time: string; title: string; who: string; note: string };

const steps: Step[] = [
  { id: 1, time: "0:00", title: "Placement des invités", who: "Ushers", note: "Rang gauche : famille Sarah · droite : famille Thomas" },
  { id: 2, time: "1:30", title: "Entrée des grand-parents", who: "Sur pied ou bras d'un enfant", note: "Musique douce · marche lente" },
  { id: 3, time: "3:00", title: "Entrée des demoiselles d'honneur", who: "Les 4 témoins", note: "Deux par deux, écart d'un mètre" },
  { id: 4, time: "5:00", title: "Entrée du marié", who: "Thomas + son père", note: "S'arrêter côté autel, saluer l'officiant" },
  { id: 5, time: "6:30", title: "Entrée de la mariée", who: "Sarah + son papa", note: "Regard fixé sur Thomas · sourire" },
  { id: 6, time: "8:00", title: "Discours d'ouverture", who: "Officiant", note: "3 minutes · introduction et bienvenue" },
  { id: 7, time: "11:00", title: "Vœux personnels", who: "Sarah puis Thomas", note: "2 minutes chacun · télécommande micro" },
  { id: 8, time: "17:00", title: "Échange des alliances", who: "Petit garçon d'honneur", note: "Coussin transmis au témoin" },
  { id: 9, time: "20:00", title: "Sortie sous les pétales", who: "Tous les invités", note: "Pétales distribués à l'entrée" },
];

function Rehearsal() {
  const { slug } = useParams({ from: "/events/$slug/rehearsal" });
  const [done, setDone] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const total = steps[steps.length - 1].time;

  const toggle = (id: number) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const completed = Object.values(done).filter(Boolean).length;

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Répétition</p>
          <p className="text-xs text-muted-foreground">Durée totale : {total} min</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <Heart className="h-6 w-6" />
          <p className="mt-3 font-serif text-2xl leading-tight">La cérémonie, minute par minute</p>
          <p className="mt-2 text-sm opacity-90">
            Répétez à blanc la veille : entrées, placements, timing. Zéro stress le jour J.
          </p>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="opacity-90">Progression</span>
            <span className="font-bold">{completed}/{steps.length}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${(completed / steps.length) * 100}%` }}
            />
          </div>
        </section>

        <ol className="relative space-y-3 border-l-2 border-primary/20 pl-6">
          {steps.map((s) => {
            const isDone = !!done[s.id];
            return (
              <li key={s.id} className="relative">
                <span
                  className={`absolute -left-[33px] top-3 grid h-6 w-6 place-items-center rounded-full border-2 ${
                    isDone ? "border-primary bg-primary text-white" : "border-primary/40 bg-background"
                  }`}
                >
                  <span className="text-[10px] font-bold">{s.id}</span>
                </span>
                <button
                  onClick={() => toggle(s.id)}
                  className={`w-full rounded-2xl p-3.5 text-left shadow-soft transition ${
                    isDone ? "bg-cream" : "bg-surface hover:shadow-card"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-serif text-base leading-tight ${isDone ? "line-through opacity-60" : ""}`}>
                      {s.title}
                    </p>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                      {s.time}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-primary-dark">{s.who}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
                </button>
              </li>
            );
          })}
        </ol>

        <section className="rounded-3xl bg-cream p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-dark">
            <Sparkles className="h-4 w-4" /> Astuce Memento
          </div>
          <p className="mt-2 font-serif text-lg leading-tight">
            Enregistrez la répétition en vidéo, l'IA détecte les temps morts et propose des ajustements.
          </p>
          <button className="mt-3 flex items-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
            <Bookmark className="h-3.5 w-3.5" /> Sauver comme modèle
          </button>
        </section>
      </main>
    </div>
  );
}
