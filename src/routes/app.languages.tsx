import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Globe2, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/languages")({
  component: Languages,
  head: () => ({
    meta: [
      { title: "Langues & région · MaFeliza" },
      { name: "description", content: "Choisissez la langue de votre interface et le format régional." },
      { property: "og:title", content: "Langues · MaFeliza" },
      { property: "og:description", content: "MaFeliza parle votre langue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const langs = [
  { code: "fr", name: "Français", region: "France", flag: "🇫🇷" },
  { code: "en", name: "English", region: "United Kingdom", flag: "🇬🇧" },
  { code: "es", name: "Español", region: "España", flag: "🇪🇸" },
  { code: "it", name: "Italiano", region: "Italia", flag: "🇮🇹" },
  { code: "pt", name: "Português", region: "Portugal", flag: "🇵🇹" },
  { code: "de", name: "Deutsch", region: "Deutschland", flag: "🇩🇪" },
  { code: "ar", name: "العربية", region: "المغرب", flag: "🇲🇦" },
  { code: "ja", name: "日本語", region: "日本", flag: "🇯🇵" },
];

function Languages() {
  const [sel, setSel] = useState("fr");
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app/settings" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Langue & région</p>
          <p className="text-xs text-muted-foreground">{langs.length} langues · plus à venir</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/20 p-6 shadow-card">
          <Globe2 className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">MaFeliza parle votre langue</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Nous adaptons dates, monnaies et sens de lecture (RTL) automatiquement.
          </p>
        </section>

        <section className="space-y-2">
          {langs.map((l) => {
            const on = sel === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setSel(l.code)}
                className="flex w-full items-center gap-3 rounded-2xl bg-surface p-3.5 text-left shadow-soft transition hover:bg-cream"
              >
                <span className="text-2xl">{l.flag}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{l.name}</p>
                  <p className="text-[11px] text-muted-foreground">{l.region}</p>
                </div>
                {on && (
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </button>
            );
          })}
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Format régional</p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-cream p-3">
              <span>Format de date</span><span className="font-semibold text-primary-dark">jj/mm/aaaa</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-cream p-3">
              <span>Monnaie</span><span className="font-semibold text-primary-dark">EUR (€)</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-cream p-3">
              <span>Premier jour de la semaine</span><span className="font-semibold text-primary-dark">Lundi</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
