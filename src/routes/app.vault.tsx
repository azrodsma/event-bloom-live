import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Fingerprint, Lock } from "lucide-react";

export const Route = createFileRoute("/app/vault")({
  component: Vault,
  head: () => ({
    meta: [
      { title: "Coffre-fort numérique · MaFeliza" },
      { name: "description", content: "Vos souvenirs, chiffrés bout en bout, à vie." },
      { property: "og:title", content: "Coffre-fort · MaFeliza" },
      { property: "og:description", content: "AES-256, garantie 100 ans, transmission héritiers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const items = [
  { l: "Vidéo cérémonie 4K", s: "8,2 Go", exp: "2126", key: "3 tiers · ANSSI" },
  { l: "Photos originales RAW", s: "24,7 Go", exp: "2126", key: "3 tiers · ANSSI" },
  { l: "Livre d'or vocal master", s: "1,4 Go", exp: "2126", key: "2 tiers" },
  { l: "Contrats signés eIDAS", s: "84 Mo", exp: "2036", key: "1 tier" },
  { l: "Vœux manuscrits scannés", s: "42 Mo", exp: "2126", key: "3 tiers · ANSSI" },
  { l: "Sauvegarde stories 7 jours", s: "3,1 Go", exp: "2126", key: "2 tiers" },
];

function Vault() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/app" className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Coffre-fort numérique</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">AES-256 · trois clefs séparées</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Lock className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-foreground to-primary-dark p-7 text-white shadow-modal">
          <Fingerprint className="h-6 w-6" />
          <h2 className="mt-2 font-serif text-3xl leading-[1.05] sm:text-4xl">Ce qui compte doit durer plus longtemps que vous.</h2>
          <p className="mt-3 text-sm opacity-90">Vos souvenirs sont fragmentés en trois centres de données (Paris, Marseille, Genève), chacun avec une clef distincte. Perdre un site ne compromet ni la vie privée, ni l'accès.</p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div><p className="font-display text-2xl">37,5 Go</p><p className="text-[10px] opacity-70">stockés</p></div>
            <div><p className="font-display text-2xl">100 ans</p><p className="text-[10px] opacity-70">garantie</p></div>
            <div><p className="font-display text-2xl">3</p><p className="text-[10px] opacity-70">sites</p></div>
          </div>
        </section>

        <section className="space-y-2">
          {items.map((i) => (
            <div key={i.l} className="rounded-2xl border border-border/50 bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-sm">{i.l}</p>
                <span className="text-xs text-muted-foreground shrink-0">{i.s}</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Expiration : {i.exp}</span>
                <span className="text-primary">{i.key}</span>
              </div>
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Transmission successorale</p>
          <p className="text-xs text-muted-foreground mt-1">Vous désignez jusqu'à 5 héritiers numériques. Après vérification notariale, ils accèdent à vos archives sans intermédiaire.</p>
        </div>
      </main>
    </div>
  );
}
