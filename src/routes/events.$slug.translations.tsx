import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Languages, Check, Globe2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/translations")({
  component: Translations,
  head: () => ({
    meta: [
      { title: "Traductions live · MaFeliza" },
      { name: "description", content: "Sous-titres et traductions en direct pour vos invités internationaux." },
      { property: "og:title", content: "Traductions live · MaFeliza" },
      { property: "og:description", content: "Un événement compris de tous." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const langs = [
  { code: "fr", label: "Français", flag: "🇫🇷", native: true },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
];

function Translations() {
  const { slug } = useParams({ from: "/events/$slug/translations" });
  const [enabled, setEnabled] = useState<string[]>(["en", "es", "it"]);
  const toggle = (c: string) =>
    setEnabled((e) => (e.includes(c) ? e.filter((x) => x !== c) : [...e, c]));

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Traductions live</p>
          <p className="text-xs text-muted-foreground">{enabled.length} langues actives</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-gold p-6 text-white shadow-card">
          <Globe2 className="h-6 w-6" />
          <p className="mt-3 font-serif text-2xl leading-tight">Sous-titres temps réel</p>
          <p className="mt-2 text-sm opacity-90">
            Chaque invité voit les discours et le chat traduits automatiquement dans sa langue.
          </p>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aperçu discours</p>
          <div className="space-y-2">
            <div className="rounded-2xl bg-surface p-3.5 shadow-soft">
              <p className="text-[10px] font-semibold uppercase text-primary">🇫🇷 Original</p>
              <p className="mt-1 font-serif text-sm">« Sarah, tu es la plus belle chose qui me soit arrivée. »</p>
            </div>
            <div className="rounded-2xl bg-cream p-3.5">
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">🇬🇧 English</p>
              <p className="mt-1 text-sm italic">"Sarah, you are the most beautiful thing that ever happened to me."</p>
            </div>
            <div className="rounded-2xl bg-cream p-3.5">
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">🇪🇸 Español</p>
              <p className="mt-1 text-sm italic">"Sarah, eres lo más hermoso que me ha pasado."</p>
            </div>
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Langues disponibles</p>
          <div className="grid grid-cols-2 gap-2">
            {langs.map((l) => {
              const on = enabled.includes(l.code) || l.native;
              return (
                <button
                  key={l.code}
                  onClick={() => !l.native && toggle(l.code)}
                  disabled={l.native}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                    on ? "border-primary bg-surface" : "border-border bg-surface/60"
                  }`}
                >
                  <span className="text-2xl">{l.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{l.label}</p>
                    <p className="text-[10px] text-muted-foreground">{l.native ? "Langue source" : on ? "Activée" : "Désactivée"}</p>
                  </div>
                  {on && (
                    <div className="grid h-5 w-5 place-items-center rounded-full bg-primary text-white">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3.5 text-sm font-semibold text-background">
          <Languages className="h-4 w-4" /> Activer sur le live
        </button>
      </main>
    </div>
  );
}
