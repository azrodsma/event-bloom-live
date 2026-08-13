import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, Book, Video } from "lucide-react";

export const Route = createFileRoute("/app/academy")({
  component: Academy,
  head: () => ({
    meta: [
      { title: "MaFeliza Academy · MaFeliza" },
      { name: "description", content: "Formations gratuites pour organiser un événement inoubliable." },
      { property: "og:title", content: "Academy · MaFeliza" },
      { property: "og:description", content: "Apprenez des meilleurs, gratuitement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const paths = [
  { l: "Parcours Mariage 101", n: "12 modules · 4h", desc: "De l'annonce au brunch : tout ce qu'on aurait aimé savoir." },
  { l: "Baptême zen", n: "6 modules · 2h", desc: "Organiser sans stresser, célébrer sans se ruiner." },
  { l: "Anniversaire signature", n: "8 modules · 3h", desc: "Passer d'une simple soirée à un événement dont on parle 10 ans." },
  { l: "Fiançailles surprise", n: "4 modules · 90 min", desc: "L'art de garder un secret et de créer le moment parfait." },
];

const featured = [
  { l: "Écrire ses vœux sans clichés", author: "Marie Fortier · autrice", dur: "38 min" },
  { l: "Négocier avec un traiteur", author: "Chef Camille Lacoste", dur: "52 min" },
  { l: "Photographier soi-même les préparatifs", author: "Studio Paloma", dur: "45 min" },
  { l: "Composer sa playlist ouverture de bal", author: "DJ Nova · résidente Silencio", dur: "27 min" },
];

function Academy() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/app" className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Academy</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Cours 100% gratuits, à vie</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <GraduationCap className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-6 text-white">
          <p className="text-xs uppercase tracking-widest opacity-70">Notre conviction</p>
          <h2 className="mt-2 font-display text-3xl leading-tight">Organiser le plus beau jour ne devrait pas s'apprendre par erreurs.</h2>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Parcours guidés</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {paths.map((p) => (
              <div key={p.l} className="rounded-2xl border border-border/50 bg-card p-5">
                <Book className="h-4 w-4 text-primary" />
                <p className="mt-2 font-display text-lg">{p.l}</p>
                <p className="text-xs text-primary">{p.n}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Sessions vedettes</h3>
          <div className="space-y-2">
            {featured.map((f) => (
              <div key={f.l} className="rounded-2xl border border-border/50 bg-card p-4 flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2"><Video className="h-4 w-4 text-primary" /></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{f.l}</p>
                  <p className="text-xs text-muted-foreground">{f.author}</p>
                </div>
                <span className="text-xs text-muted-foreground">{f.dur}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
