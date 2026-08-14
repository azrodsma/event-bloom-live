import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Users, Sparkles, Video } from "lucide-react";

export const Route = createFileRoute("/app/masterclasses")({
  component: Masterclasses,
  head: () => ({
    meta: [
      { title: "Masterclass · MaFeliza" },
      { name: "description", content: "Apprenez auprès des meilleurs experts de l'événementiel." },
      { property: "og:title", content: "Masterclass · MaFeliza" },
      { property: "og:description", content: "L'école MaFeliza — savoir-faire d'exception." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const upcoming = [
  { l: "L'art du discours qui émeut", teacher: "Fanny Ruwet · humoriste", date: "12 mai · 20h", price: 24, color: "from-primary to-primary-dark" },
  { l: "Photographier une émotion", teacher: "Théo Combes · photographe Vogue", date: "24 mai · 19h", price: 32, color: "from-gold to-primary" },
  { l: "Cérémonie laïque · écrire son texte", teacher: "Adèle Bréau · officiante", date: "3 juin · 20h", price: 18, color: "from-foreground to-primary-dark" },
];

const replays = [
  { l: "Playlist de mariage qui fait danser 4h", teacher: "DJ Milan", views: "2 481", duration: "58 min" },
  { l: "Photographier son enfant en fête", teacher: "Léa Nassif", views: "1 924", duration: "42 min" },
  { l: "Le plan de table sans drame familial", teacher: "Sophie Vernier", views: "3 217", duration: "36 min" },
];

function Masterclasses() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Masterclass</p>
          <p className="text-xs text-muted-foreground">L'école MaFeliza</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white shadow-card">
          <Sparkles className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Savoir-faire d'exception</p>
          <p className="mt-2 text-sm opacity-90">
            Cours vidéo en direct + replay, animés par des experts du secteur. Nombre de places limité pour préserver l'intimité.
          </p>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prochaines sessions live</p>
          <div className="space-y-3">
            {upcoming.map((m) => (
              <article key={m.l} className={`overflow-hidden rounded-2xl bg-gradient-to-br ${m.color} p-5 text-white shadow-soft`}>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">Live</span>
                <p className="mt-2 font-serif text-xl leading-tight">{m.l}</p>
                <p className="mt-1 text-xs opacity-85">Par {m.teacher}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="opacity-90">{m.date}</span>
                  <span className="rounded-full bg-white/25 px-2 py-1 font-semibold">{m.price} €</span>
                </div>
                <button className="mt-3 w-full rounded-full bg-white py-2 text-xs font-semibold text-primary-dark">
                  Réserver ma place
                </button>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Video className="h-3.5 w-3.5" /> Replays les plus regardés
          </p>
          <div className="space-y-2">
            {replays.map((r) => (
              <article key={r.l} className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-soft">
                <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold to-primary text-white">
                  <Video className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{r.l}</p>
                  <p className="text-[11px] text-muted-foreground">{r.teacher} · {r.duration}</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Users className="h-3 w-3" /> {r.views}
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
