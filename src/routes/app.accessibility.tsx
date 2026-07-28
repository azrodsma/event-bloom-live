import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Accessibility, Ear, Eye, Heart, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/accessibility")({
  component: AccessibilityRoute,
  head: () => ({
    meta: [
      { title: "Accessibilité · Memento Live" },
      { name: "description", content: "Adaptez Memento Live à votre confort visuel, auditif et moteur." },
      { property: "og:title", content: "Accessibilité · Memento Live" },
      { property: "og:description", content: "Une app pensée pour toutes et tous." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function AccessibilityRoute() {
  const [textScale, setTextScale] = useState(100);
  const [contrast, setContrast] = useState(false);
  const [motion, setMotion] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [voice, setVoice] = useState(false);
  const [hapt, setHapt] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Accessibilité</p>
          <p className="text-xs text-muted-foreground">Adaptez l'app à votre confort</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-6 text-white shadow-card">
          <Accessibility className="h-6 w-6" />
          <p className="mt-3 font-serif text-2xl leading-tight">Une expérience pensée pour toutes et tous</p>
          <p className="mt-2 text-sm opacity-90">
            Ces réglages sont enregistrés sur votre appareil et n'affectent que votre compte.
          </p>
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Eye className="h-3.5 w-3.5" /> Vision
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Taille du texte</span>
              <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-bold">{textScale}%</span>
            </div>
            <input
              type="range"
              min={80}
              max={160}
              step={10}
              value={textScale}
              onChange={(e) => setTextScale(Number(e.target.value))}
              className="mt-3 w-full accent-primary"
            />
            <p className="mt-2 rounded-xl bg-cream p-3 leading-relaxed" style={{ fontSize: `${textScale}%` }}>
              Aperçu : une soirée à vos côtés, gravée pour toujours.
            </p>
          </div>

          <Toggle label="Contraste élevé" desc="Renforce les couleurs et bordures" on={contrast} onChange={setContrast} />
          <Toggle label="Réduire les animations" desc="Désactive parallaxes et transitions" on={motion} onChange={setMotion} />
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Ear className="h-3.5 w-3.5" /> Audition
          </div>
          <Toggle label="Sous-titres automatiques" desc="Sur tous les lives et vidéos" on={captions} onChange={setCaptions} />
          <Toggle label="Description audio" desc="Voix off décrivant les scènes clés" on={voice} onChange={setVoice} />
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Heart className="h-3.5 w-3.5" /> Interaction
          </div>
          <Toggle label="Retours haptiques" desc="Vibrations légères sur les actions" on={hapt} onChange={setHapt} />
        </section>

        <section className="rounded-3xl bg-cream p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-dark">
            <Check className="h-4 w-4" /> Engagement Memento
          </div>
          <p className="mt-2 font-serif text-lg leading-tight">
            Conforme WCAG 2.2 AA · audité chaque trimestre par une équipe indépendante.
          </p>
        </section>
      </main>
    </div>
  );
}

function Toggle({ label, desc, on, onChange }: { label: string; desc: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-cream p-3 text-left"
    >
      <div className="flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <div className={`h-6 w-11 flex-shrink-0 rounded-full p-0.5 transition ${on ? "bg-primary" : "bg-muted"}`}>
        <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </div>
    </button>
  );
}
