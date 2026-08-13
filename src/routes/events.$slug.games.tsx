import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Gamepad2, Trophy, Users } from "lucide-react";

export const Route = createFileRoute("/events/$slug/games")({
  component: Games,
  head: () => ({
    meta: [
      { title: "Animations & jeux · MaFeliza" },
      { name: "description", content: "Blind test, quiz des mariés, chasse au trésor : brise-glaces sur mesure." },
      { property: "og:title", content: "Animations · MaFeliza" },
      { property: "og:description", content: "L'ambiance ne tient pas à un fil : elle s'orchestre." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const games = [
  { l: "Blind test des mariés", when: "22:30", dur: "20 min", players: "Toutes tables", desc: "30 morceaux qui ont marqué Léa & Thomas · buzzer par table" },
  { l: "Quiz Combien ils se connaissent ?", when: "20:50", dur: "15 min", players: "Le couple + invités", desc: "20 questions truffées de vérités croustillantes" },
  { l: "Chasse au trésor jardin", when: "17:30", dur: "45 min", players: "Enfants 6-12 ans", desc: "8 énigmes, coffre final avec bonbons et trésors" },
  { l: "Photobooth défis", when: "En continu", dur: "—", players: "Libre", desc: "Missions absurdes tirées aléatoirement (embrasser mamie, danser avec le chef...)" },
  { l: "Loterie du champagne", when: "23:15", dur: "10 min", players: "Tous", desc: "Numéros collés sous les chaises · magnums à gagner" },
  { l: "Karaoké VIP", when: "01:00", dur: "1h30", players: "Volontaires", desc: "Salon isolé · 12 000 titres · micros HF Shure" },
];

function Games() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link
            to="/events/$slug"
            params={{ slug: "mariage-lea-thomas" }}
            className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95"
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Animations & jeux</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">6 animations · MC : Antoine</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Gamepad2 className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary via-primary-dark to-foreground p-7 text-white shadow-modal">
          <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gold/25 blur-3xl" />
          <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-white/95">
            <Trophy className="h-3.5 w-3.5 text-gold" /> Programme signé
          </span>
          <h2 className="mt-3 font-serif text-3xl leading-[1.05] sm:text-4xl">Une soirée sans temps mort</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
            Rythme travaillé avec le MC, transitions musicales, briefings prestataires. On ne laisse rien retomber.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {games.map((g) => (
            <div
              key={g.l}
              className="group relative overflow-hidden rounded-[26px] bg-surface p-5 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/30"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-serif text-lg leading-snug">{g.l}</p>
                <span className="shrink-0 rounded-full bg-gold-light px-2.5 py-1 text-[11px] font-semibold text-gold">{g.when}</span>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-medium text-muted-foreground">
                <span className="rounded-full bg-primary-light px-2.5 py-1 text-primary">{g.dur}</span>
                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{g.players}</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{g.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
