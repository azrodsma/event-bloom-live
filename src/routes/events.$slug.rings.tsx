import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Gem, Shield, Sparkles } from "lucide-react";

export const Route = createFileRoute("/events/$slug/rings")({
  component: Rings,
  head: () => ({
    meta: [
      { title: "Alliances · Memento Live" },
      { name: "description", content: "Suivez, assurez et gravez vos alliances." },
      { property: "og:title", content: "Alliances · Memento Live" },
      { property: "og:description", content: "Le symbole le plus précieux, sécurisé." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const rings = [
  { l: "Alliance mariée", jeweler: "Atelier Vanrycke · Paris", metal: "Or rose 18k", size: "52", gravure: "M+T · 06.09.26", price: 1240 },
  { l: "Alliance marié", jeweler: "Atelier Vanrycke · Paris", metal: "Or gris brossé 18k", size: "63", gravure: "T+M · 06.09.26", price: 980 },
];

const steps = [
  { l: "Commande passée", d: "12 février", done: true },
  { l: "Essayage bijoutier", d: "18 mars", done: true },
  { l: "Gravure finalisée", d: "2 mai", done: true },
  { l: "Récupération", d: "28 août", done: false },
  { l: "Remise au témoin", d: "5 septembre · 18h", done: false },
];

function Rings() {
  const { slug } = useParams({ from: "/events/$slug/rings" });
  const total = rings.reduce((s, r) => s + r.price, 0);
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Alliances</p>
          <p className="text-xs text-muted-foreground">Suivi bijoutier · assurance incluse</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-gold via-primary to-primary-dark p-6 text-white shadow-card">
          <Gem className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Le symbole le plus précieux</p>
          <p className="mt-2 text-sm opacity-90">
            Traçabilité or éthique, assurance temporaire jour J incluse, et coffre-fort numérique pour les certificats.
          </p>
        </section>

        <section className="grid gap-2">
          {rings.map((r) => (
            <article key={r.l} className="rounded-2xl bg-surface p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="font-serif text-lg text-primary-dark">{r.l}</p>
                <span className="font-serif text-xl">{r.price} €</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{r.jeweler}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="rounded-xl bg-cream p-2">
                  <p className="text-muted-foreground">Métal</p>
                  <p className="mt-0.5 font-semibold">{r.metal}</p>
                </div>
                <div className="rounded-xl bg-cream p-2">
                  <p className="text-muted-foreground">Taille</p>
                  <p className="mt-0.5 font-semibold">{r.size}</p>
                </div>
                <div className="rounded-xl bg-cream p-2">
                  <p className="text-muted-foreground">Gravure</p>
                  <p className="mt-0.5 font-semibold">{r.gravure}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Étapes
          </p>
          <div className="space-y-2">
            {steps.map((s) => (
              <article key={s.l} className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-soft">
                <span className={`h-2.5 w-2.5 rounded-full ${s.done ? "bg-primary" : "bg-gold"}`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{s.l}</p>
                  <p className="text-[11px] text-muted-foreground">{s.d}</p>
                </div>
                {s.done && <span className="text-[10px] font-bold uppercase text-primary-dark">Fait</span>}
              </article>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-between rounded-3xl bg-foreground p-5 text-background shadow-card">
          <div>
            <div className="flex items-center gap-2 text-xs opacity-80"><Shield className="h-3.5 w-3.5" /> Assurance jour J</div>
            <p className="mt-1 font-serif text-2xl">Couvert jusqu'à {(total * 3).toLocaleString("fr")} €</p>
            <p className="text-[11px] opacity-70">Vol, perte, casse — franchise 0 €</p>
          </div>
        </section>
      </main>
    </div>
  );
}
