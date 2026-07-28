import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Heart, Users, Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/vows")({
  component: Vows,
  head: () => ({
    meta: [
      { title: "Vœux secrets · Memento Live" },
      { name: "description", content: "Rédigez vos vœux dans un espace privé et chiffré, révélés le jour J." },
      { property: "og:title", content: "Vœux secrets · Memento Live" },
      { property: "og:description", content: "Vos mots, pour toujours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const prompts = [
  "Le moment où j'ai su que c'était toi…",
  "Ce que j'admire le plus chez toi…",
  "Ma promesse pour les 50 prochaines années…",
  "Notre plus beau souvenir ensemble…",
  "Ce que je veux qu'on construise…",
];

function Vows() {
  const { slug } = useParams({ from: "/events/$slug/vows" });
  const [text, setText] = useState(
    "Le jour où je t'ai rencontrée, j'ignorais que ma vie changerait à jamais. Aujourd'hui, devant nos familles, je te promets…"
  );
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Vœux secrets</p>
          <p className="text-xs text-muted-foreground">Chiffrés · révélés le jour J</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-90">
            <Heart className="h-3.5 w-3.5 fill-current" /> Espace privé
          </div>
          <p className="mt-2 font-serif text-2xl leading-tight">Vos vœux, pour vous seul·e·s</p>
          <p className="mt-2 text-sm opacity-90">
            Personne — pas même votre partenaire — ne peut lire ces mots avant le jour J.
          </p>
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brouillon</p>
            <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
              {words} mots · ~{Math.ceil(words / 130)} min
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="w-full resize-none rounded-2xl bg-cream p-4 font-serif text-base leading-relaxed outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="mt-3 flex gap-2">
            <button className="flex-1 rounded-full bg-primary py-2.5 text-xs font-semibold text-white">Sauvegarder</button>
            <button className="rounded-full bg-cream px-4 py-2.5 text-xs font-semibold">Verrouiller</button>
          </div>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Inspirations
          </p>
          <div className="space-y-2">
            {prompts.map((p, i) => (
              <button
                key={i}
                onClick={() => setText((t) => t + "\n\n" + p + " ")}
                className="flex w-full items-center gap-3 rounded-2xl bg-surface p-3 text-left shadow-soft transition hover:shadow-card"
              >
                <Star className="h-4 w-4 flex-shrink-0 text-gold" />
                <p className="text-sm">{p}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-cream p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-dark">
            <Users className="h-4 w-4" /> Coach vœux — optionnel
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Faites relire vos vœux par un coach Memento (confidentialité garantie) pour affiner le ton et la longueur.
          </p>
          <button className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
            Réserver une relecture · 39 €
          </button>
        </section>
      </main>
    </div>
  );
}
