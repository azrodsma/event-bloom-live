import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Church, BookOpen, Music } from "lucide-react";

export const Route = createFileRoute("/events/$slug/ceremony-booklet")({
  component: CeremonyBooklet,
  head: () => ({
    meta: [
      { title: "Livret de cérémonie · MaFeliza" },
      { name: "description", content: "Composez le livret imprimé et sa version numérique." },
      { property: "og:title", content: "Livret de cérémonie · MaFeliza" },
      { property: "og:description", content: "Chaque instant a son texte, sa musique, son émotion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const parts = [
  { l: "Ouverture", by: "Officiant Julien", text: "Bienvenue et remerciements", music: "Prelude · Ludovico Einaudi" },
  { l: "Entrée des mariés", by: "Cortège", text: "Traversée sur la lavande", music: "A Thousand Years · piano solo" },
  { l: "Lecture 1", by: "Sœur de la mariée", text: "Extrait de « L'écume des jours »", music: "-" },
  { l: "Rituel du sable", by: "Les mariés", text: "Deux sables mêlés en une seule couleur", music: "River Flows in You" },
  { l: "Vœux", by: "Les mariés", text: "Textes écrits à la plume", music: "silence recueilli" },
  { l: "Échange des alliances", by: "Officiant", text: "Anneaux portés par le témoin", music: "Canon en Ré · Pachelbel" },
  { l: "Bénédiction & sortie", by: "Officiant", text: "Bulles + pétales", music: "Signed, Sealed, Delivered" },
];

function CeremonyBooklet() {
  const { slug } = useParams({ from: "/events/$slug/ceremony-booklet" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Livret de cérémonie</p>
          <p className="text-xs text-muted-foreground">7 séquences · 24 pages A5</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/25 p-6 shadow-card">
          <BookOpen className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Chaque instant a son texte</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Livret imprimé sur papier recyclé Munken, ou version numérique à scanner par QR code posé sur les chaises.
          </p>
        </section>

        <section className="space-y-2">
          {parts.map((p, i) => (
            <article key={p.l} className="rounded-2xl bg-surface p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-primary/15 font-serif text-primary-dark">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold">{p.l}</p>
                  <p className="text-[11px] text-muted-foreground">{p.by}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-foreground">{p.text}</p>
              <p className="mt-2 flex items-center gap-1 text-[11px] italic text-primary-dark">
                <Music className="h-3 w-3" /> {p.music}
              </p>
            </article>
          ))}
        </section>

        <div className="grid grid-cols-2 gap-2">
          <button className="rounded-full bg-foreground py-3 text-sm font-semibold text-background">Aperçu PDF</button>
          <button className="rounded-full bg-primary py-3 text-sm font-semibold text-white">Commander l'impression</button>
        </div>

        <section className="rounded-3xl bg-cream p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">
            <Church className="h-3.5 w-3.5" /> Version audio pour malvoyants
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Lecture voix off enregistrée sur un QR code apposé sur la première page, accessible pour tous.
          </p>
        </section>
      </main>
    </div>
  );
}
