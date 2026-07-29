import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, MessageCircle, Users, Zap, Compass } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/icebreakers")({
  component: Icebreakers,
  head: () => ({
    meta: [
      { title: "Brise-glace · Memento Live" },
      { name: "description", content: "Des questions et défis pour que vos invités se rencontrent vraiment." },
      { property: "og:title", content: "Brise-glace · Memento Live" },
      { property: "og:description", content: "Que personne ne reste seul dans un coin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Card = {
  id: string;
  category: "profond" | "léger" | "défi" | "souvenir";
  question: string;
  hint: string;
};

const cards: Card[] = [
  { id: "c1", category: "profond", question: "Quelle est la plus belle chose que Sarah ou Thomas t'a apprise ?", hint: "Prends 30 secondes avant de répondre." },
  { id: "c2", category: "léger", question: "Ton pire souvenir de piste de danse ?", hint: "On veut la vidéo si elle existe." },
  { id: "c3", category: "défi", question: "Trouve une personne qui a le même mois de naissance que toi.", hint: "Bonus si vous êtes le même jour." },
  { id: "c4", category: "souvenir", question: "Raconte comment tu as connu les mariés.", hint: "Une anecdote, pas un CV." },
  { id: "c5", category: "profond", question: "Un couple qui t'inspire depuis toujours ?", hint: "Pas forcément amoureux." },
  { id: "c6", category: "défi", question: "Compose un cocktail-signature avec ton voisin de table.", hint: "Va le proposer au bar." },
  { id: "c7", category: "léger", question: "Le film que tu peux regarder 100 fois sans t'en lasser ?", hint: "Défends-le en 20 secondes." },
  { id: "c8", category: "souvenir", question: "Un mot que tu aurais aimé dire aux mariés avant aujourd'hui ?", hint: "Il n'est pas trop tard." },
];

const catStyle = {
  profond: { tint: "bg-primary text-primary-foreground", grad: "from-primary/25 via-rose-100 to-accent/40", label: "Profond" },
  léger: { tint: "bg-amber-100 text-amber-800", grad: "from-amber-100 via-accent/40 to-primary/10", label: "Léger" },
  défi: { tint: "bg-emerald-100 text-emerald-800", grad: "from-emerald-100 via-accent/30 to-primary/10", label: "Défi" },
  souvenir: { tint: "bg-sky-100 text-sky-800", grad: "from-sky-100 via-accent/30 to-primary/10", label: "Souvenir" },
} as const;

function Icebreakers() {
  const { slug } = useParams({ from: "/events/$slug/icebreakers" });
  const [i, setI] = useState(0);
  const [filter, setFilter] = useState<Card["category"] | "all">("all");

  const list = filter === "all" ? cards : cards.filter((c) => c.category === filter);
  const current = list[i % list.length];
  const style = catStyle[current.category];

  const next = () => setI((v) => v + 1);
  const prev = () => setI((v) => (v - 1 + list.length) % list.length);

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Brise-glace</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <MessageCircle className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="px-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Compass className="h-3.5 w-3.5 text-primary" /> Faire connaissance
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Que personne<br />ne reste seul</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Piochez une carte, engagez la conversation. Les mariés reçoivent un fil de moments partagés.
        </p>
      </section>

      <div className="scrollbar-none mt-4 flex gap-2 overflow-x-auto px-4">
        {(["all", "profond", "léger", "défi", "souvenir"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setI(0); }}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold ${
              filter === f ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
            }`}
          >
            {f === "all" ? "Toutes" : catStyle[f].label}
          </button>
        ))}
      </div>

      <section className="px-4 pt-6">
        <div className={`relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br ${style.grad} p-6`}>
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${style.tint}`}>
              {style.label}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {(i % list.length) + 1}/{list.length}
            </span>
          </div>
          <p className="mt-8 font-serif text-2xl leading-snug">« {current.question} »</p>
          <p className="mt-3 text-[12px] italic text-muted-foreground">{current.hint}</p>
          <div className="mt-8 flex justify-center gap-1">
            {list.slice(0, 8).map((_, idx) => (
              <span
                key={idx}
                className={`h-1 rounded-full transition-all ${
                  idx === i % list.length ? "w-6 bg-primary" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button onClick={prev} className="flex-1 rounded-full border border-border/70 py-3 text-xs font-bold">
            Précédente
          </button>
          <button onClick={next} className="flex-1 rounded-full bg-foreground py-3 text-xs font-bold text-background">
            Piocher une autre
          </button>
        </div>
      </section>

      <section className="mx-4 mt-6 rounded-3xl border border-border/60 bg-card p-4">
        <p className="text-[10px] uppercase tracking-wider text-primary">
          <Users className="mr-1 inline h-3 w-3" /> Rencontres du soir
        </p>
        <div className="mt-3 space-y-2">
          {[
            { a: "Julie", b: "Antoine", note: "Nés le même mois · Août" },
            { a: "Camille", b: "Ismaël", note: "Cocktail-signature du bar" },
            { a: "Léa", b: "Marc", note: "Même souvenir à Rome" },
          ].map((m, k) => (
            <div key={k} className="flex items-center justify-between rounded-2xl bg-secondary/60 px-3 py-2">
              <div className="flex items-center gap-2 text-[13px]">
                <span className="font-serif">{m.a}</span>
                <Zap className="h-3 w-3 text-primary" />
                <span className="font-serif">{m.b}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{m.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Mode table</p>
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Une carte par convive</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Chaque invité pioche via QR code à sa place — l'ambiance monte dès l'entrée.</p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Activer sur toutes les tables
        </button>
      </section>
    </div>
  );
}
