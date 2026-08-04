import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Send, Clock } from "lucide-react";

export const Route = createFileRoute("/events/$slug/save-the-date")({
  component: SaveTheDate,
  head: () => ({
    meta: [
      { title: "Save the date · MaFeliza" },
      { name: "description", content: "Réservez la date bien avant l'invitation officielle." },
      { property: "og:title", content: "Save the date · MaFeliza" },
      { property: "og:description", content: "Une annonce élégante par SMS, email ou vidéo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const templates = [
  { name: "Polaroid vintage", vibe: "Nostalgique", color: "from-cream to-gold" },
  { name: "Minimal serif", vibe: "Épuré", color: "from-background to-primary/20" },
  { name: "Vidéo cinématique", vibe: "Immersif", color: "from-foreground to-primary-dark" },
  { name: "Aquarelle botanique", vibe: "Romantique", color: "from-primary/40 to-gold" },
];

const channels = [
  { name: "SMS", reach: "142 numéros", delivery: "Immédiat", price: "0,08 €/sms" },
  { name: "Email", reach: "158 adresses", delivery: "Immédiat", price: "Inclus" },
  { name: "Story vidéo", reach: "Réseaux privés", delivery: "MP4 15s", price: "12 €" },
];

function SaveTheDate() {
  const { slug } = useParams({ from: "/events/$slug/save-the-date" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Save the date</p>
          <p className="text-xs text-muted-foreground">Envoi J-180 recommandé</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Save the date</p>
          <p className="mt-3 font-serif text-4xl leading-tight">Léa & Thomas</p>
          <p className="mt-1 font-serif text-2xl opacity-90">14 · 06 · 2026</p>
          <p className="mt-3 text-sm opacity-80">Domaine des Cyprès · Luberon</p>
          <div className="mt-4 flex items-center gap-2 text-xs opacity-90">
            <Clock className="h-3.5 w-3.5" /> Invitation officielle à J-90
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Templates</p>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((t) => (
              <article key={t.name} className={`rounded-2xl bg-gradient-to-br ${t.color} p-4 shadow-soft`}>
                <p className="font-serif text-lg leading-tight text-foreground">{t.name}</p>
                <p className="mt-1 text-xs text-foreground/70">{t.vibe}</p>
                <button className="mt-3 rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold text-background">Prévisualiser</button>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Canaux d'envoi</p>
          <div className="space-y-2">
            {channels.map((c) => (
              <article key={c.name} className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-soft">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 font-bold text-primary-dark">
                  {c.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.reach} · {c.delivery}</p>
                </div>
                <p className="text-xs font-semibold text-primary-dark">{c.price}</p>
              </article>
            ))}
          </div>
        </section>

        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-white shadow-glow">
          <Send className="h-4 w-4" /> Programmer l'envoi
        </button>

        <section className="rounded-3xl bg-surface p-5 shadow-soft">
          <Sparkles className="h-5 w-5 text-primary-dark" />
          <p className="mt-2 font-serif text-lg leading-tight">Ajout automatique au calendrier</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Les invités reçoivent un lien Apple/Google Calendar avec rappel J-30 et J-1 pré-configurés.
          </p>
        </section>
      </main>
    </div>
  );
}
