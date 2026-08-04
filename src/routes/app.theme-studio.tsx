import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Palette, Type, Sparkles, Wand2 } from "lucide-react";

export const Route = createFileRoute("/app/theme-studio")({
  component: ThemeStudio,
  head: () => ({
    meta: [
      { title: "Studio de thèmes · MaFeliza" },
      { name: "description", content: "Créez le thème visuel de votre événement en quelques gestes." },
      { property: "og:title", content: "Studio de thèmes · MaFeliza" },
      { property: "og:description", content: "Une identité graphique cousue main." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const palettes = [
  { name: "Rose poudré", colors: ["#E85D8E", "#FFF8F4", "#D9A441", "#F2C4B7"] },
  { name: "Nuit dorée", colors: ["#2A1F2E", "#D9A441", "#5D4A3C", "#F5EFE7"] },
  { name: "Sauvage vert", colors: ["#4A6B4C", "#F0EAD6", "#D9A441", "#8FA88F"] },
  { name: "Rouge grenat", colors: ["#7A1F2B", "#F5EDE4", "#D9A441", "#C97B79"] },
];

const fonts = [
  { name: "Playfair · Inter", title: "Playfair Display", body: "Inter", vibe: "Élégant classique", active: true },
  { name: "Cormorant · Karla", title: "Cormorant Garamond", body: "Karla", vibe: "Éditorial doux" },
  { name: "Syne · Jakarta", title: "Syne", body: "Plus Jakarta", vibe: "Contemporain graphique" },
];

function ThemeStudio() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Studio de thèmes</p>
          <p className="text-xs text-muted-foreground">Appliqué aux invitations, site et livre d'or</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white shadow-card">
          <Wand2 className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Une identité cousue main</p>
          <p className="mt-2 text-sm opacity-90">
            Couleurs, typographies et illustrations se propagent automatiquement sur tous les supports.
          </p>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Palette className="h-3.5 w-3.5" /> Palettes
          </div>
          <div className="grid grid-cols-2 gap-2">
            {palettes.map((p) => (
              <article key={p.name} className="rounded-2xl bg-surface p-3 shadow-soft">
                <div className="flex gap-1">
                  {p.colors.map((c) => (
                    <div key={c} className="h-12 flex-1 rounded-xl" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="mt-2 text-sm font-semibold">{p.name}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Type className="h-3.5 w-3.5" /> Duos typographiques
          </div>
          <div className="space-y-2">
            {fonts.map((f) => (
              <article key={f.name} className={`rounded-2xl border-2 p-4 shadow-soft transition ${
                f.active ? "border-primary bg-primary/5" : "border-transparent bg-surface"
              }`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-serif text-2xl leading-tight">{f.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Corps · {f.body}</p>
                  </div>
                  {f.active && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">Actif</span>}
                </div>
                <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">{f.vibe}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-cream p-5 shadow-soft">
          <Sparkles className="h-5 w-5 text-primary-dark" />
          <p className="mt-2 font-serif text-lg leading-tight">Suggestion IA</p>
          <p className="mt-1 text-sm text-muted-foreground">
            À partir de 3 photos d'inspiration, notre IA génère un thème complet en 12 secondes.
          </p>
          <button className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">Générer depuis mes photos</button>
        </section>
      </main>
    </div>
  );
}
