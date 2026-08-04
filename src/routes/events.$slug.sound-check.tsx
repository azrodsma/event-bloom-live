import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Mic, Volume2, Radio, Zap } from "lucide-react";

export const Route = createFileRoute("/events/$slug/sound-check")({
  component: SoundCheck,
  head: () => ({
    meta: [
      { title: "Balance son · MaFeliza" },
      { name: "description", content: "Régie son en direct — chaque micro sous contrôle." },
      { property: "og:title", content: "Balance son · MaFeliza" },
      { property: "og:description", content: "Pas un vœu inaudible, pas un larsen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const channels = [
  { l: "Micro officiant", type: "Cravate HF Sennheiser", level: 78, freq: "606.125 MHz", status: "ok" },
  { l: "Micro marié", type: "Serre-tête beige", level: 72, freq: "606.325 MHz", status: "ok" },
  { l: "Micro mariée", type: "Serre-tête beige", level: 75, freq: "606.525 MHz", status: "ok" },
  { l: "Micro témoins", type: "Main HF · relai", level: 55, freq: "606.725 MHz", status: "alert" },
  { l: "Ambiance salle", type: "Overhead XY", level: 42, freq: "câblé", status: "ok" },
];

function SoundCheck() {
  const { slug } = useParams({ from: "/events/$slug/sound-check" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Balance son</p>
          <p className="text-xs text-muted-foreground">5 canaux · dernier check il y a 12 min</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-foreground via-primary-dark to-primary p-6 text-white shadow-card">
          <Volume2 className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Pas un vœu inaudible</p>
          <p className="mt-2 text-sm opacity-90">
            Régie surveillée en direct : niveaux, fréquences, batteries. Alerte push si un canal décroche.
          </p>
        </section>

        <section className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-2xl bg-primary/10 p-3">
            <p className="font-serif text-2xl text-primary-dark">-14 LUFS</p>
            <p className="mt-0.5 text-muted-foreground">loudness</p>
          </div>
          <div className="rounded-2xl bg-gold/25 p-3">
            <p className="font-serif text-2xl text-foreground">4/5</p>
            <p className="mt-0.5 text-muted-foreground">batteries OK</p>
          </div>
          <div className="rounded-2xl bg-foreground p-3 text-background">
            <p className="font-serif text-2xl">0</p>
            <p className="mt-0.5 opacity-80">larsen 24h</p>
          </div>
        </section>

        <section className="space-y-2">
          {channels.map((c) => (
            <article key={c.l} className="rounded-2xl bg-surface p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <Mic className={`h-5 w-5 ${c.status === "alert" ? "text-destructive" : "text-primary-dark"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{c.l}</p>
                  <p className="text-[11px] text-muted-foreground">{c.type} · {c.freq}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  c.status === "alert" ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary-dark"
                }`}>
                  {c.status === "alert" ? "Batterie faible" : "OK"}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream">
                <div className={`h-full rounded-full ${
                  c.level > 90 ? "bg-destructive" : c.level > 70 ? "bg-primary" : "bg-gold"
                }`} style={{ width: `${c.level}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>-∞</span>
                <span className="font-mono">{c.level - 90} dB</span>
                <span>0</span>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-cream p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">
            <Radio className="h-3.5 w-3.5" /> Régisseur son
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Milan · joignable directement par talkie interne · scan RF automatique toutes les 5 min.
          </p>
          <button className="mt-3 flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
            <Zap className="h-3.5 w-3.5" /> Appeler la régie
          </button>
        </section>
      </main>
    </div>
  );
}
