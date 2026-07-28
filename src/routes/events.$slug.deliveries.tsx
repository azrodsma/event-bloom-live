import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Package, Truck, Check, Clock } from "lucide-react";

export const Route = createFileRoute("/events/$slug/deliveries")({
  component: Deliveries,
  head: () => ({
    meta: [
      { title: "Livraisons · Memento Live" },
      { name: "description", content: "Suivez chaque colis et livraison prestataire jusqu'au jour J." },
      { property: "og:title", content: "Livraisons · Memento Live" },
      { property: "og:description", content: "Rien ne se perd, rien n'arrive en retard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Status = "commandé" | "expédié" | "livré";

const items: { id: string; name: string; from: string; when: string; status: Status; carrier: string }[] = [
  { id: "d1", name: "Robe de mariée · retouches finales", from: "Atelier Rose", when: "22 juil · 10h", status: "livré", carrier: "En main propre" },
  { id: "d2", name: "Faire-part gravés (110 ex.)", from: "Papeterie Coquelicot", when: "12 juil · 14h", status: "livré", carrier: "Chronopost" },
  { id: "d3", name: "Alliances or rose", from: "Bijouterie Léon", when: "23 juil · 15h", status: "expédié", carrier: "UPS · #A2841" },
  { id: "d4", name: "Bougies parfumées & photophores", from: "Maison Cire", when: "24 juil · 09h", status: "expédié", carrier: "Colissimo · #P9927" },
  { id: "d5", name: "Pièce montée personnalisée", from: "Pâtisserie Léa", when: "25 juil · 07h", status: "commandé", carrier: "Camion frigo prestataire" },
  { id: "d6", name: "Fleurs coupées (roses, pivoines)", from: "Fleuriste Camille", when: "25 juil · 08h", status: "commandé", carrier: "Livraison directe" },
];

const config: Record<Status, { icon: typeof Package; label: string; bg: string; text: string }> = {
  commandé: { icon: Package, label: "Commandé", bg: "bg-muted", text: "text-muted-foreground" },
  expédié: { icon: Truck, label: "En route", bg: "bg-primary/15", text: "text-primary" },
  livré: { icon: Check, label: "Livré", bg: "bg-success/15", text: "text-success" },
};

function Deliveries() {
  const { slug } = useParams({ from: "/events/$slug/deliveries" });
  const done = items.filter((i) => i.status === "livré").length;
  const enroute = items.filter((i) => i.status === "expédié").length;
  const pending = items.filter((i) => i.status === "commandé").length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Livraisons</p>
          <p className="text-xs text-muted-foreground">{items.length} colis · suivi temps réel</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-gradient-to-br from-success to-primary p-4 text-white shadow-card">
            <Check className="h-5 w-5" />
            <p className="mt-2 font-serif text-3xl leading-none">{done}</p>
            <p className="text-[10px] uppercase tracking-wider opacity-90">Livrés</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-4 text-white shadow-card">
            <Truck className="h-5 w-5" />
            <p className="mt-2 font-serif text-3xl leading-none">{enroute}</p>
            <p className="text-[10px] uppercase tracking-wider opacity-90">En route</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-gold to-primary p-4 text-white shadow-card">
            <Clock className="h-5 w-5" />
            <p className="mt-2 font-serif text-3xl leading-none">{pending}</p>
            <p className="text-[10px] uppercase tracking-wider opacity-90">À venir</p>
          </div>
        </section>

        <div className="space-y-2">
          {items.map((i) => {
            const c = config[i.status];
            const Icon = c.icon;
            return (
              <article key={i.id} className="rounded-2xl bg-surface p-3.5 shadow-soft">
                <div className="flex items-start gap-3">
                  <div className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-2xl ${c.bg} ${c.text}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{i.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{i.from} · {i.carrier}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`rounded-full ${c.bg} ${c.text} px-2 py-0.5 text-[10px] font-semibold`}>
                        {c.label}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{i.when}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <button className="w-full rounded-2xl bg-foreground py-3.5 text-sm font-semibold text-background">
          Ajouter un colis à suivre
        </button>
      </main>
    </div>
  );
}
