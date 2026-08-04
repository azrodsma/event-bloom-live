import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Globe, Building2, MapPin } from "lucide-react";

export const Route = createFileRoute("/app/international")({
  component: International,
  head: () => ({
    meta: [
      { title: "MaFeliza International · MaFeliza" },
      { name: "description", content: "Présence internationale, langues supportées et bureaux MaFeliza." },
      { property: "og:title", content: "International · MaFeliza" },
      { property: "og:description", content: "Célébrer, partout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const offices = [
  { city: "Lyon", country: "France", role: "Siège social · 28 personnes", opened: "2024" },
  { city: "Barcelone", country: "Espagne", role: "Marché ibérique · 6 personnes", opened: "2026" },
  { city: "Milan", country: "Italie", role: "Marché italien · 4 personnes", opened: "2026" },
  { city: "Bruxelles", country: "Belgique", role: "BeNeLux · 3 personnes", opened: "2025" },
];

const langs = ["Français", "English", "Español", "Italiano", "Português", "Deutsch", "Nederlands", "Català", "العربية", "中文", "日本語", "Русский"];

function International() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/app" className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">International</h1>
            <p className="text-xs text-muted-foreground">62 pays · 12 langues</p>
          </div>
          <Globe className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white">
          <p className="text-xs uppercase tracking-widest opacity-80">Feuille de route</p>
          <h2 className="mt-2 font-display text-3xl leading-tight">Devenir la référence européenne des célébrations privées d'ici 2028.</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div><p className="font-display text-2xl">62</p><p className="opacity-80 text-xs">pays actifs</p></div>
            <div><p className="font-display text-2xl">12</p><p className="opacity-80 text-xs">langues UI</p></div>
            <div><p className="font-display text-2xl">4</p><p className="opacity-80 text-xs">bureaux</p></div>
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Nos bureaux</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {offices.map((o) => (
              <div key={o.city} className="rounded-2xl border border-border/50 bg-card p-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <p className="font-display text-lg">{o.city}</p>
                  <span className="text-xs text-muted-foreground">· {o.country}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{o.role}</p>
                <p className="text-xs text-primary">Ouvert en {o.opened}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Langues supportées</h3>
          <div className="flex flex-wrap gap-2">
            {langs.map((l) => (
              <span key={l} className="rounded-full bg-cream px-3 py-1.5 text-xs">{l}</span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-cream p-5 flex items-start gap-3">
          <MapPin className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm">Bientôt disponible</p>
            <p className="text-xs text-muted-foreground">Lisbonne, Berlin et Londres ouvrent en 2027. Rejoignez la liste d'attente créateurs.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
