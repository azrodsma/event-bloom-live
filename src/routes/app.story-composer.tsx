import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Wand2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/story-composer")({
  component: StoryComposer,
  head: () => ({
    meta: [
      { title: "Composeur de récit · MaFeliza" },
      { name: "description", content: "L'IA raconte votre histoire à partir de vos photos et voix." },
      { property: "og:title", content: "Récit IA · MaFeliza" },
      { property: "og:description", content: "Un magazine sur-mesure généré depuis l'album partagé." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const chapters = [
  { n: "01", t: "L'attente", src: "312 photos matin · 6 vocaux préparatifs", w: "1 240 mots" },
  { n: "02", t: "L'oui", src: "84 photos cérémonie · sortie · pétales", w: "980 mots" },
  { n: "03", t: "Le vin d'honneur", src: "428 photos cocktail · 22 messages vocaux", w: "1 560 mots" },
  { n: "04", t: "Le banquet", src: "215 photos dîner · discours · pièce montée", w: "1 820 mots" },
  { n: "05", t: "La nuit", src: "1 240 photos bal · 8 vidéos", w: "1 100 mots" },
  { n: "06", t: "Le lendemain", src: "180 photos brunch · adieux", w: "760 mots" },
];

function StoryComposer() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/app" className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Composeur de récit</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Génération IA · voix personnelle</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Wand2 className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-6 text-white">
          <Sparkles className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Un magazine, votre histoire, sa voix.</h2>
          <p className="mt-3 text-sm opacity-90">L'IA analyse vos photos, transcriptions vocales et légendes d'invités pour rédiger 6 chapitres dans le ton que vous choisissez : romantique, drôle, sobre, littéraire.</p>
        </section>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {["Romantique", "Drôle", "Sobre", "Littéraire", "Poétique"].map((t) => (
            <button key={t} className="rounded-full bg-cream px-4 py-2 text-xs whitespace-nowrap border border-border/50">{t}</button>
          ))}
        </div>

        <section className="space-y-3">
          {chapters.map((c) => (
            <div key={c.n} className="rounded-2xl border border-border/50 bg-card p-5">
              <div className="flex items-start gap-4">
                <span className="font-display text-4xl text-primary/40">{c.n}</span>
                <div className="flex-1">
                  <p className="font-display text-xl">{c.t}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.src}</p>
                  <p className="text-xs text-primary mt-2">{c.w}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Livre imprimé</p>
          <p className="text-xs text-muted-foreground mt-1">Impression offset 120 pages · reliure toile signée · atelier La Croix-Rousse à Lyon · délai 3 semaines.</p>
        </div>
      </main>
    </div>
  );
}
