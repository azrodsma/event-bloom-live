import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, PawPrint, Heart, Check, Plus, Sparkles, AlertCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/pets")({
  component: Pets,
  head: () => ({
    meta: [
      { title: "Animaux invités · Memento Live" },
      { name: "description", content: "Intégrez vos animaux de compagnie à la journée : rôle, logistique, accessoires et bien-être." },
      { property: "og:title", content: "Animaux invités · Memento Live" },
      { property: "og:description", content: "Poils, museaux et souvenirs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Pet = {
  id: string;
  name: string;
  species: "chien" | "chat" | "cheval" | "lapin";
  breed: string;
  photo: string;
  role: string;
  handler: string;
  duration: string;
  needs: string[];
  emoji: string;
};

const pets: Pet[] = [
  { id: "p1", name: "Nala", species: "chien", breed: "Golden Retriever · 4 ans", photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600", role: "Porteuse d'alliances", handler: "Léa (sœur de la mariée)", duration: "Cérémonie · 30 min", needs: ["Nœud papillon doré", "Coussin brodé", "Récompenses"], emoji: "🐕" },
  { id: "p2", name: "Milo", species: "chat", breed: "Chartreux · 6 ans", photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600", role: "Invité vedette photo", handler: "Antoine", duration: "Photos famille · 15 min", needs: ["Panier de transport", "Espace calme"], emoji: "🐈" },
  { id: "p3", name: "Ondine", species: "cheval", breed: "Jument selle français", photo: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600", role: "Arrivée surprise des mariés", handler: "Écurie du Domaine", duration: "Arrivée · 10 min", needs: ["Fleurs crinière", "Palefrenier dédié"], emoji: "🐎" },
];

const rules = [
  { icon: Check, ok: true, text: "Domaine pet-friendly · zones extérieures autorisées" },
  { icon: Check, ok: true, text: "Photographe habitué aux animaux" },
  { icon: AlertCircle, ok: false, text: "Interdit en salle du dîner · relais garderie prévu" },
];

function Pets() {
  const { slug } = useParams({ from: "/events/$slug/pets" });
  const [added, setAdded] = useState<Set<string>>(new Set(pets.map((p) => p.id)));

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Animaux invités</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-accent/40 via-primary/10 to-background px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <PawPrint className="h-3.5 w-3.5 text-primary" /> Compagnons du jour
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Ils font partie<br />de la famille</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Rôles, temps de présence, accessoires, personne responsable — tout est planifié en amont.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-background/70 p-3">
            <p className="font-serif text-lg leading-none">{added.size}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Prévus</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3">
            <p className="font-serif text-lg leading-none">2</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Rôles clés</p>
          </div>
          <div className="rounded-2xl bg-background/70 p-3">
            <p className="font-serif text-lg leading-none text-primary">55</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Minutes</p>
          </div>
        </div>
      </section>

      <ul className="space-y-4 px-4 pt-4">
        {pets.map((p) => {
          const on = added.has(p.id);
          return (
            <li key={p.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
              <div className="relative h-40 w-full overflow-hidden">
                <img src={p.photo} alt={p.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur">
                  {p.emoji} {p.species}
                </span>
                <div className="absolute inset-x-4 bottom-3 text-white">
                  <p className="font-serif text-xl leading-tight">{p.name}</p>
                  <p className="text-[11px] text-white/80">{p.breed}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-primary">Rôle</p>
                    <p className="truncate font-serif text-[15px] leading-tight">{p.role}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{p.duration}</span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Responsable · <span className="text-foreground">{p.handler}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.needs.map((n) => (
                    <span key={n} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{n}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => setAdded((s) => { const n = new Set(s); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })}
                    className={`flex-1 rounded-full py-2 text-xs font-bold ${on ? "bg-primary/10 text-primary" : "bg-foreground text-background"}`}
                  >
                    {on ? "✓ Confirmé" : "Ajouter au planning"}
                  </button>
                  <button className="grid h-9 w-9 place-items-center rounded-full bg-secondary" aria-label="Favori">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mx-4 mt-6 rounded-3xl border border-border/60 bg-card p-4">
        <p className="font-serif text-base">Règles du domaine</p>
        <ul className="mt-3 space-y-2">
          {rules.map((r, i) => {
            const Icon = r.icon;
            return (
              <li key={i} className="flex items-start gap-2 text-[12px]">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${r.ok ? "text-emerald-600" : "text-primary"}`} />
                <span className={r.ok ? "text-foreground" : "text-muted-foreground"}>{r.text}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Bonus Memento</p>
        <p className="mt-2 font-serif text-lg leading-tight">Pet-sitter certifié sur place</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Un professionnel prend le relais pendant le dîner et les feux d'artifice — 60 €/soirée.</p>
        <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          <Plus className="h-3.5 w-3.5" /> Réserver un pet-sitter
        </button>
      </section>

      <div className="mx-4 mt-4 flex items-center gap-2 rounded-3xl bg-secondary/60 p-4 text-[11px] text-muted-foreground">
        <Sparkles className="h-4 w-4 shrink-0 text-primary" />
        <p>Vos animaux apparaîtront dans le livre d'or et sur la fresque des présents.</p>
      </div>
    </div>
  );
}
