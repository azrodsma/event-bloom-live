import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, PawPrint, Heart, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/events/$slug/pets")({
  component: Pets,
  head: () => ({
    meta: [
      { title: "Animaux de compagnie · MaFeliza" },
      { name: "description", content: "Accueil des animaux : gardiennage, brief et kit confort." },
      { property: "og:title", content: "Animaux · MaFeliza" },
      { property: "og:description", content: "Nos compagnons méritent aussi la fête." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const pets = [
  { l: "Milou · Cavalier King Charles", role: "Porteur d'alliances", owner: "Léa & Thomas", status: "Confirmé", note: "Nœud papillon crème · brossage 15:30" },
  { l: "Câline · Border Collie", role: "Invitée d'honneur", owner: "Famille Martin", status: "Confirmé", note: "Gardienne 22h → 8h · promenade 20:30" },
  { l: "Pixel · Chat sacré de Birmanie", role: "Chambre calme", owner: "Sarah (témoin)", status: "En garderie", note: "Litière + panier suite 12" },
];

function Pets() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Nos animaux</h1>
            <p className="text-xs text-muted-foreground">3 compagnons · pet-sitter dédié</p>
          </div>
          <PawPrint className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary/15 to-cream p-6">
          <p className="text-xs uppercase tracking-widest text-primary">Pet-sitter dédiée</p>
          <h2 className="mt-2 font-display text-2xl">Camille · Comportementaliste</h2>
          <p className="mt-2 text-sm text-muted-foreground">Présente de 14h à 2h · trousse de secours vétérinaire · numéro clinique 24/7 enregistré.</p>
        </section>

        <section className="space-y-3">
          {pets.map((p) => (
            <div key={p.l} className="rounded-2xl border border-border/50 bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-cream p-2"><Heart className="h-4 w-4 text-primary" /></div>
                  <div>
                    <p className="font-medium">{p.l}</p>
                    <p className="text-xs text-muted-foreground">{p.role} · {p.owner}</p>
                  </div>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary whitespace-nowrap">{p.status}</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground pl-11">{p.note}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-gold/40 bg-gold/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm">Rappel invités</p>
            <p className="text-xs text-muted-foreground">Seuls les animaux enregistrés sont admis dans l'enceinte. Prévoir carnet de vaccination.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
