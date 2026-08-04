import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, HelpCircle, MessageCircle, Book, Video, Search, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/help")({
  component: Help,
  head: () => ({
    meta: [
      { title: "Centre d'aide · MaFeliza" },
      { name: "description", content: "Réponses, tutoriels vidéo et support humain 7j/7 pour vos événements." },
      { property: "og:title", content: "Centre d'aide · MaFeliza" },
      { property: "og:description", content: "Une équipe humaine pour vous accompagner." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const topics = [
  { icon: "🎥", label: "Configurer un live", articles: 12 },
  { icon: "💌", label: "Faire-part & invitations", articles: 8 },
  { icon: "💰", label: "Cagnotte externe", articles: 5 },
  { icon: "📸", label: "Album collaboratif", articles: 9 },
  { icon: "🎊", label: "Le jour J", articles: 14 },
  { icon: "🔒", label: "Sécurité & vie privée", articles: 6 },
];

const faqs = [
  { q: "MaFeliza gère-t-il l'argent de la cagnotte ?", a: "Non. Nous encapsulons votre cagnotte externe (Leetchi, Lydia, PayPal Pool…). Les fonds ne transitent jamais par nos serveurs." },
  { q: "Le live est-il hébergé chez vous ?", a: "Non. Nous encapsulons YouTube Live ou Twitch pour éviter les coûts et vous offrir la meilleure qualité." },
  { q: "Puis-je limiter l'accès à mes proches ?", a: "Oui. Chaque événement dispose d'un code invité, d'un QR code et d'une whitelist optionnelle." },
  { q: "Que devient mon événement après la date ?", a: "Il devient un souvenir vivant : replay, livre d'or, album, rétrospective. Archive cloud illimitée offerte 1 an." },
];

function Help() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Centre d'aide</p>
          <p className="text-xs text-muted-foreground">Réponses en 2 min · humains en 15 min</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <HelpCircle className="h-6 w-6" />
          <p className="mt-3 font-serif text-2xl leading-tight">Comment pouvons-nous vous aider ?</p>
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Rechercher une question…"
              className="w-full rounded-full bg-white pl-11 pr-4 py-3 text-sm text-foreground outline-none"
            />
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          <button className="rounded-2xl bg-surface p-4 text-center shadow-soft transition hover:shadow-card">
            <MessageCircle className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 text-xs font-semibold">Chat live</p>
          </button>
          <button className="rounded-2xl bg-surface p-4 text-center shadow-soft transition hover:shadow-card">
            <Video className="mx-auto h-5 w-5 text-primary-dark" />
            <p className="mt-2 text-xs font-semibold">Tutoriels</p>
          </button>
          <button className="rounded-2xl bg-surface p-4 text-center shadow-soft transition hover:shadow-card">
            <Book className="mx-auto h-5 w-5 text-gold" />
            <p className="mt-2 text-xs font-semibold">Guides</p>
          </button>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Thématiques</p>
          <div className="grid grid-cols-2 gap-2">
            {topics.map((t) => (
              <button key={t.label} className="flex items-center gap-3 rounded-2xl bg-surface p-3 text-left shadow-soft transition hover:shadow-card">
                <span className="text-2xl">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{t.label}</p>
                  <p className="text-[10px] text-muted-foreground">{t.articles} articles</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Questions fréquentes</p>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <div key={i} className="overflow-hidden rounded-2xl bg-surface shadow-soft">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <p className="text-sm font-semibold">{f.q}</p>
                  <ChevronRight
                    className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${
                      open === i ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {open === i && (
                  <p className="border-t border-border/60 bg-cream p-4 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Toujours coincé·e ?</p>
          <p className="mt-2 font-serif text-xl leading-tight">Écrivez à notre équipe humaine.</p>
          <p className="mt-1 text-xs opacity-70">Temps de réponse moyen : 12 minutes.</p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
            Contacter l'équipe
          </button>
        </section>
      </main>
    </div>
  );
}
