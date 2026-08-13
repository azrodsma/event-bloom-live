import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageSquare, Star } from "lucide-react";

export const Route = createFileRoute("/app/feedback")({
  component: Feedback,
  head: () => ({
    meta: [
      { title: "Votre avis · MaFeliza" },
      { name: "description", content: "Partagez votre retour d'expérience et aidez-nous à améliorer MaFeliza." },
      { property: "og:title", content: "Votre avis · MaFeliza" },
      { property: "og:description", content: "Nous répondons personnellement à chaque retour sous 48h." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const topics = [
  { l: "Une idée de fonctionnalité", icon: "💡" },
  { l: "Un bug à signaler", icon: "🐛" },
  { l: "Un compliment à faire", icon: "💌" },
  { l: "Une critique constructive", icon: "🎯" },
  { l: "Un partenariat à proposer", icon: "🤝" },
  { l: "Autre chose", icon: "✏️" },
];

const recent = [
  { user: "Marie L.", role: "Mariée mai 2026", stars: 5, txt: "L'app a sauvé notre organisation. Le plan de table intelligent, une révélation." },
  { user: "Thomas B.", role: "Papa d'un bapt.", stars: 5, txt: "Enfin quelque chose qui respecte le rite catholique tout en étant moderne." },
  { user: "Chef Camille", role: "Prestataire", stars: 4, txt: "Le brief cuisine est révolutionnaire. J'aimerais juste pouvoir modifier les allergies depuis mon compte pro." },
];

function Feedback() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/app" className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Votre avis</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Lu par l'équipe fondatrice · réponse sous 48h</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <MessageSquare className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-6 text-white">
          <h2 className="font-display text-3xl leading-tight">Chaque retour, une décision produit.</h2>
          <p className="mt-3 text-sm opacity-90">Nos 32 dernières fonctionnalités sont nées d'un message d'utilisateur. Vraiment.</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">De quoi voulez-vous nous parler ?</h3>
          <div className="grid grid-cols-2 gap-3">
            {topics.map((t) => (
              <button key={t.l} className="rounded-2xl border border-border/50 bg-card p-4 text-left hover:border-primary transition">
                <p className="text-2xl">{t.icon}</p>
                <p className="mt-2 text-sm font-medium">{t.l}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Derniers messages publiés</h3>
          <div className="space-y-3">
            {recent.map((r) => (
              <div key={r.user} className="rounded-2xl border border-border/50 bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{r.user}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </div>
                  <div className="flex gap-0.5 text-primary">
                    {Array.from({ length: r.stars }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground italic">"{r.txt}"</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
