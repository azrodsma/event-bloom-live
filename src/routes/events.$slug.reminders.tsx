import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Send, CalendarClock } from "lucide-react";

export const Route = createFileRoute("/events/$slug/reminders")({
  component: Reminders,
  head: () => ({
    meta: [
      { title: "Relances invités · MaFeliza" },
      { name: "description", content: "Relances RSVP automatiques et personnalisées." },
      { property: "og:title", content: "Relances invités · MaFeliza" },
      { property: "og:description", content: "Sans harceler. Avec tact." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const scheduled = [
  { d: "J-45", ch: "Email", who: "Invités sans réponse (24)", subj: "On serait tellement heureux si vous étiez là ✨", sent: true },
  { d: "J-38", ch: "SMS", who: "Sans réponse email (11)", subj: "Petit rappel : votre présence compte pour nous.", sent: true },
  { d: "J-30", ch: "Appel personnel", who: "Toujours pas de réponse (5)", subj: "Léa appelle personnellement — 10 min", sent: false },
  { d: "J-14", ch: "Push app", who: "Confirmés · rappel dress code", subj: "Chic bohème · 5 juin · toutes les infos", sent: false },
  { d: "J-7", ch: "Email", who: "Confirmés · programme détaillé", subj: "J-7 · Voici tout ce qu'il faut savoir", sent: false },
  { d: "J-3", ch: "SMS", who: "Confirmés · adresse & parking", subj: "Adresse GPS et infos pratiques", sent: false },
  { d: "J-1", ch: "Push app", who: "Confirmés · météo & tenue", subj: "Météo demain · pensez à un châle en soirée", sent: false },
];

function Reminders() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Relances invités</h1>
            <p className="text-xs text-muted-foreground">7 séquences programmées · 148 destinataires</p>
          </div>
          <Send className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-6 text-white">
          <CalendarClock className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">La bonne relance, au bon moment, par le bon canal.</h2>
          <p className="mt-3 text-sm opacity-90">Séquence intelligente : on n'envoie plus rien à ceux qui ont déjà répondu, et on adapte le ton à la relation.</p>
        </section>

        <section className="space-y-2">
          {scheduled.map((s) => (
            <div key={s.d + s.ch} className={`rounded-2xl border p-4 ${s.sent ? "border-primary/30 bg-primary/5" : "border-border/50 bg-card"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-primary">{s.d}</span>
                    <span className="rounded-full bg-foreground text-white text-[10px] px-2 py-0.5">{s.ch}</span>
                  </div>
                  <p className="mt-1 font-medium text-sm">{s.subj}</p>
                  <p className="text-xs text-muted-foreground mt-1">→ {s.who}</p>
                </div>
                <span className={`text-[10px] shrink-0 rounded-full px-2 py-0.5 ${s.sent ? "bg-primary text-white" : "bg-cream text-muted-foreground"}`}>{s.sent ? "Envoyé" : "Programmé"}</span>
              </div>
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Taux de réponse actuel</p>
          <p className="text-xs text-muted-foreground mt-1">124 / 148 · 84% · Objectif 95% avant J-14.</p>
        </div>
      </main>
    </div>
  );
}
