import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Heart, Sparkles, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/gratitude-wall")({
  component: GratitudeWall,
  head: () => ({
    meta: [
      { title: "Mur de gratitude · MaFeliza" },
      { name: "description", content: "Un mur collaboratif où chaque invité dépose un mot de gratitude." },
      { property: "og:title", content: "Mur de gratitude · MaFeliza" },
      { property: "og:description", content: "Les mercis qui restent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const notes = [
  { from: "Maman", to: "Sarah", msg: "Ma fille, je suis si fière du chemin parcouru.", color: "from-primary/70 to-primary" },
  { from: "Tom", to: "Sarah", msg: "Merci d'être ma maison, mon rire, ma paix.", color: "from-gold/60 to-primary-dark" },
  { from: "Léa (témoin)", to: "Sarah & Tom", msg: "Vous voir ensemble, c'est croire à l'évidence.", color: "from-primary to-gold" },
  { from: "Papi Jean", to: "Tous", msg: "Prenez soin l'un de l'autre, le reste suit.", color: "from-foreground to-primary-dark" },
  { from: "Nour", to: "Sarah", msg: "Mon amie de toujours — merci pour 20 ans de fous rires.", color: "from-primary-dark to-gold" },
  { from: "Karim", to: "Tom", msg: "Frère de cœur, tu m'inspires chaque jour.", color: "from-gold to-primary" },
];

function GratitudeWall() {
  const { slug } = useParams({ from: "/events/$slug/gratitude-wall" });
  const [to, setTo] = useState("Sarah & Tom");
  const [msg, setMsg] = useState("");

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Mur de gratitude</p>
          <p className="text-xs text-muted-foreground">{notes.length} mercis · anonyme possible</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/20 p-6 shadow-card">
          <Heart className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Les mercis qui restent</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Un mot, une pensée, une reconnaissance. Ils resteront gravés dans votre livre souvenir.
          </p>
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Déposer un merci</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Sarah & Tom", "Sarah", "Tom", "Les parents", "Les témoins"].map((t) => (
              <button
                key={t}
                onClick={() => setTo(t)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  to === t ? "bg-primary text-white" : "bg-cream text-muted-foreground"
                }`}
              >
                Pour {t}
              </button>
            ))}
          </div>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Écrivez vos mots…"
            rows={3}
            className="mt-3 w-full resize-none rounded-2xl bg-cream p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark py-3 text-sm font-semibold text-white shadow-card">
            <Send className="h-4 w-4" /> Envoyer avec amour
          </button>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mots reçus</p>
          <div className="grid grid-cols-2 gap-2">
            {notes.map((n, i) => (
              <article
                key={i}
                className={`rounded-2xl bg-gradient-to-br ${n.color} p-3.5 text-white shadow-soft`}
                style={{ transform: `rotate(${i % 2 === 0 ? -1.2 : 1.2}deg)` }}
              >
                <p className="text-[10px] font-bold uppercase opacity-80">Pour {n.to}</p>
                <p className="mt-2 font-serif text-sm leading-snug">« {n.msg} »</p>
                <p className="mt-2 text-[11px] opacity-90">— {n.from}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="mt-2 font-serif text-lg leading-tight">Livre relié imprimé</p>
          <p className="mt-1 text-sm opacity-80">
            Tous les mercis compilés en un livre premium livré 15 jours après l'événement.
          </p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold">Commander le livre — 49 €</button>
        </section>
      </main>
    </div>
  );
}
