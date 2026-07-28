import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Headphones, MessageCircle, Search } from "lucide-react";

export const Route = createFileRoute("/app/support")({
  component: Support,
  head: () => ({
    meta: [
      { title: "Support · Memento Live" },
      { name: "description", content: "Une équipe humaine, disponible 7j/7." },
      { property: "og:title", content: "Support · Memento Live" },
      { property: "og:description", content: "Un humain vous répond en moins de 3 minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const channels = [
  { l: "Chat en direct", d: "Réponse humaine < 3 min · 7h → 23h", cta: "Ouvrir le chat", color: "from-primary to-primary-dark" },
  { l: "SOS jour J", d: "Numéro dédié le jour de votre événement", cta: "Voir mon numéro", color: "from-gold to-primary" },
  { l: "Visio conseil", d: "30 min avec un conseiller · sur rendez-vous", cta: "Réserver", color: "from-primary-dark to-foreground" },
];

const topics = [
  { l: "Modifier une invitation envoyée", views: 8421 },
  { l: "Ajouter un co-organisateur", views: 6120 },
  { l: "Basculer la cagnotte vers un autre service", views: 4980 },
  { l: "Récupérer un album après l'événement", views: 3812 },
  { l: "Facture et TVA", views: 2604 },
];

function Support() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Support</p>
          <p className="text-xs text-muted-foreground">Équipe basée à Lyon · humaine et empathique</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white shadow-card">
          <Headphones className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Un humain vous répond</p>
          <p className="mt-2 text-sm opacity-90">
            Zéro bot au premier contact. Nos conseillers connaissent l'organisation d'événement — beaucoup en ont vécu l'expérience.
          </p>
        </section>

        <label className="flex items-center gap-2 rounded-2xl bg-surface px-4 py-3 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Chercher une réponse…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </label>

        <section className="grid gap-2">
          {channels.map((c) => (
            <article key={c.l} className={`rounded-2xl bg-gradient-to-br ${c.color} p-5 text-white shadow-soft`}>
              <p className="font-serif text-xl leading-tight">{c.l}</p>
              <p className="mt-1 text-xs opacity-90">{c.d}</p>
              <button className="mt-3 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-primary-dark">{c.cta}</button>
            </article>
          ))}
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MessageCircle className="h-3.5 w-3.5" /> Sujets les plus consultés
          </p>
          <div className="space-y-2">
            {topics.map((t) => (
              <article key={t.l} className="flex items-center justify-between rounded-2xl bg-cream p-3.5 shadow-soft">
                <p className="text-sm font-semibold">{t.l}</p>
                <span className="text-[11px] text-muted-foreground">{t.views.toLocaleString("fr")} vues</span>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Engagement de service</p>
          <p className="mt-2 text-sm">Temps de réponse moyen : 2 min 41 · satisfaction 4,8/5 · 12 conseillers en France.</p>
        </section>
      </main>
    </div>
  );
}
