import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Users, Heart, Sparkles, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/app/community")({
  component: Community,
  head: () => ({
    meta: [
      { title: "Communauté · Memento Live" },
      { name: "description", content: "Rencontrez d'autres organisateurs, échangez conseils, prestataires et inspirations." },
      { property: "og:title", content: "Communauté · Memento Live" },
      { property: "og:description", content: "Vous n'organisez plus seul(e)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const circles = [
  { name: "Mariés été 2026", members: 1240, active: 87, tone: "from-primary to-primary-dark", emoji: "💍" },
  { name: "Baptêmes bohèmes", members: 320, active: 12, tone: "from-gold to-primary", emoji: "🕊️" },
  { name: "40 ans mémorable", members: 480, active: 34, tone: "from-primary-dark to-foreground", emoji: "🎂" },
  { name: "Éco-célébrations", members: 890, active: 61, tone: "from-success to-primary", emoji: "🌿" },
];

const threads = [
  { author: "Élodie", tone: "Astuce", title: "Notre plan B pluie qui a sauvé la journée", replies: 42, likes: 128 },
  { author: "Karim", tone: "Question", title: "Un traiteur casher-friendly sur Lyon ?", replies: 18, likes: 24 },
  { author: "Nour", tone: "Inspiration", title: "Palette pêche & terracotta — feedback ?", replies: 63, likes: 210 },
  { author: "Julien", tone: "Retour d'exp.", title: "Le live YouTube a bluffé mes grands-parents", replies: 27, likes: 96 },
];

const toneColor: Record<string, string> = {
  Astuce: "bg-primary text-white",
  Question: "bg-gold text-foreground",
  Inspiration: "bg-cream text-primary-dark",
  "Retour d'exp.": "bg-foreground text-background",
};

function Community() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Communauté</p>
          <p className="text-xs text-muted-foreground">3 240 membres actifs cette semaine</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <Users className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Vous n'organisez plus seul(e)</p>
          <p className="mt-2 text-sm opacity-90">
            Cercles thématiques, entraide bienveillante, prestataires recommandés par la communauté.
          </p>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cercles pour vous</p>
          <div className="grid grid-cols-2 gap-2">
            {circles.map((c) => (
              <button key={c.name} className="text-left">
                <div className={`rounded-2xl bg-gradient-to-br ${c.tone} p-4 text-white shadow-soft`}>
                  <div className="text-2xl">{c.emoji}</div>
                  <p className="mt-2 text-sm font-semibold leading-tight">{c.name}</p>
                  <p className="mt-2 text-[10px] uppercase opacity-80">{c.members} membres</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> {c.active} en ligne
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conversations chaudes</p>
          <div className="space-y-2">
            {threads.map((t) => (
              <article key={t.title} className="rounded-2xl bg-surface p-3.5 shadow-soft">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${toneColor[t.tone]}`}>
                    {t.tone}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{t.author}</span>
                </div>
                <p className="mt-2 text-sm font-semibold leading-tight">{t.title}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {t.replies}</span>
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-primary" /> {t.likes}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-cream p-5">
          <Sparkles className="h-5 w-5 text-primary-dark" />
          <p className="mt-2 font-serif text-lg leading-tight">Charte bienveillance</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Modération humaine + IA · zéro tolérance haine · verified pros identifiés d'un liseré doré.
          </p>
        </section>
      </main>
    </div>
  );
}
