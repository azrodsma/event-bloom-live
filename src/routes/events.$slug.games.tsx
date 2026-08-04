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
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Animations & jeux</h1>
            <p className="text-xs text-muted-foreground">6 animations · MC : Antoine</p>
          </div>
          <Gamepad2 className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white">
          <Trophy className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Une soirée sans temps mort</h2>
          <p className="mt-3 text-sm opacity-90">Ryhtme travaillé avec le MC, transitions musicales, briefings prestataires. On ne laisse rien retomber.</p>
        </section>

        <section className="space-y-3">
          {games.map((g) => (
            <div key={g.l} className="rounded-2xl border border-border/50 bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium">{g.l}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="text-primary">{g.when}</span>
                    <span>{g.dur}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{g.players}</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{g.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
