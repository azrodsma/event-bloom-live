import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Star, Heart } from "lucide-react";

export const Route = createFileRoute("/events/$slug/testimonials")({
  component: Testimonials,
  head: () => ({
    meta: [
      { title: "Témoignages · Memento Live" },
      { name: "description", content: "Messages laissés par vos proches en amont du jour J." },
      { property: "og:title", content: "Témoignages · Memento Live" },
      { property: "og:description", content: "Les mots qui touchent, avant même la cérémonie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const messages = [
  { author: "Mamie Odette", relation: "Grand-mère · 82 ans", text: "Ma petite-fille chérie, je te vois grandir depuis 30 ans. Aujourd'hui je danse dans mon cœur pour toi. Papi t'envoie un baiser du ciel.", vocal: true },
  { author: "Antoine", relation: "Témoin & meilleur ami", text: "Thomas, tu as trouvé ta perle. Léa, tu as trouvé le meilleur d'entre nous. Je vous aime comme deux frères de plus.", vocal: false },
  { author: "Camille & Hugo", relation: "Amis d'enfance", text: "On a hâte de voir vos yeux briller. Préparez le rimmel waterproof, ça va couler.", vocal: false },
  { author: "Papa", relation: "Père de la mariée", text: "Ma fille, tu seras toujours ma petite fille, même dans ta robe de mariée. Fais-lui confiance, il en est digne.", vocal: true },
  { author: "Julie", relation: "Sœur de la mariée", text: "13 ans que j'attends ce jour depuis que tu m'as dit « c'est lui ». Je vous aime.", vocal: false },
];

function Testimonials() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Mots doux</h1>
            <p className="text-xs text-muted-foreground">28 messages · 12 vocaux</p>
          </div>
          <MessageCircle className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary/15 via-cream to-gold/20 p-6 text-center">
          <Heart className="h-6 w-6 text-primary mx-auto" />
          <h2 className="mt-2 font-display text-2xl">Vos proches ont écrit pour vous</h2>
          <p className="mt-2 text-sm text-muted-foreground italic">À découvrir au bon moment. Notre astuce : la veille au soir, seuls, un verre à la main.</p>
        </section>

        <section className="space-y-3">
          {messages.map((m) => (
            <div key={m.author} className="rounded-2xl border border-border/50 bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{m.author}</p>
                  <p className="text-xs text-muted-foreground">{m.relation}</p>
                </div>
                {m.vocal && <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">🎙️ Vocal</span>}
              </div>
              <p className="mt-3 text-sm italic leading-relaxed">« {m.text} »</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-gold text-gold" />
                <span>Épingler pour le livre souvenir</span>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-cream p-5 text-center">
          <p className="font-display text-lg">Fenêtre encore ouverte</p>
          <p className="text-xs text-muted-foreground mt-1">Vos proches peuvent envoyer un message jusqu'au J-1.</p>
        </section>
      </main>
    </div>
  );
}
