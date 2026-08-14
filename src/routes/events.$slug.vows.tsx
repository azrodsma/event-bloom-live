import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ScrollText, Sparkles, Pen } from "lucide-react";

export const Route = createFileRoute("/events/$slug/vows")({
  component: Vows,
  head: () => ({
    meta: [
      { title: "Vœux · MaFeliza" },
      { name: "description", content: "Écrivez, répétez et gardez précieusement vos vœux." },
      { property: "og:title", content: "Vœux · MaFeliza" },
      { property: "og:description", content: "Les mots qui changent une vie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const drafts = [
  { author: "Camille", version: 4, words: 342, duration: "2 min 45", locked: true },
  { author: "Théo", version: 6, words: 298, duration: "2 min 20", locked: false },
];

const prompts = [
  "Le moment exact où j'ai su que c'était toi.",
  "Trois promesses concrètes que je te fais.",
  "Ce que tu m'as appris sur moi-même.",
  "Un souvenir précieux qui nous ressemble.",
  "Comment je nous vois dans vingt ans.",
];

function Vows() {
  const { slug } = useParams({ from: "/events/$slug/vows" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Vœux</p>
          <p className="text-xs text-muted-foreground">Confidentiel · chiffré bout-en-bout</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary/20 via-cream to-gold/20 p-6 shadow-card">
          <ScrollText className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Les mots qui changent une vie</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Chacun écrit dans son espace privé — invisible pour l'autre jusqu'à la cérémonie. Aucune fuite possible.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-2">
          {drafts.map((d) => (
            <article key={d.author} className="rounded-2xl bg-surface p-4 shadow-soft">
              <p className="font-serif text-xl">{d.author}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">v{d.version} · {d.words} mots</p>
              <p className="mt-2 text-[11px] font-semibold text-primary-dark">{d.duration}</p>
              <span className={`mt-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                d.locked ? "bg-primary/15 text-primary-dark" : "bg-gold/25 text-foreground"
              }`}>
                {d.locked ? "Scellé" : "En rédaction"}
              </span>
            </article>
          ))}
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Pen className="h-3.5 w-3.5" /> Amorces d'inspiration
          </p>
          <div className="space-y-2">
            {prompts.map((p, i) => (
              <article key={p} className="flex items-start gap-3 rounded-2xl bg-cream p-3.5 shadow-soft">
                <span className="font-serif text-lg text-primary-dark">{i + 1}.</span>
                <p className="text-sm text-foreground">{p}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80">
            <Sparkles className="h-3.5 w-3.5" /> Coach IA vœux
          </div>
          <p className="mt-2 text-sm">
            Relit votre brouillon, propose des variantes, minute la lecture. Zéro donnée conservée après la cérémonie.
          </p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">Ouvrir le coach</button>
        </section>
      </main>
    </div>
  );
}
