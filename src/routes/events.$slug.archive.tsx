import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Cloud, HardDrive, Server, Shield, Check, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/archive")({
  component: Archive,
  head: () => ({
    meta: [
      { title: "Archivage & sauvegarde · Memento Live" },
      { name: "description", content: "Sauvegardez vos souvenirs sur plusieurs supports — cloud, disque physique, coffret." },
      { property: "og:title", content: "Archivage · Memento Live" },
      { property: "og:description", content: "Pour transmettre à vos enfants." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Plan = {
  id: string;
  name: string;
  price: string;
  duration: string;
  icon: typeof Cloud;
  features: string[];
  best?: boolean;
};

const plans: Plan[] = [
  { id: "cloud", name: "Cloud chiffré", price: "Inclus", duration: "5 ans", icon: Cloud, features: ["Redondance 3 zones EU", "Chiffrement AES-256", "Accès app illimité"] },
  { id: "cloud-long", name: "Cloud siècle", price: "39 €/an", duration: "100 ans", icon: Server, best: true, features: ["Garantie transmise aux héritiers", "3 copies géographiques", "Migration format garantie"] },
  { id: "disk", name: "Disque physique", price: "89 € une fois", duration: "à vie", icon: HardDrive, features: ["SSD 1 To gravé aux prénoms", "Livré coffret bois", "Copie sécurisée cloud incluse"] },
];

function Archive() {
  const { slug } = useParams({ from: "/events/$slug/archive" });
  const [plan, setPlan] = useState(plans[1].id);

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Archivage</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Shield className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-foreground via-foreground/95 to-primary/60 px-4 pb-8 pt-8 text-background">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-background/70">
          <Sparkles className="h-3.5 w-3.5" /> Transmission longue durée
        </div>
        <h1 className="mt-3 font-serif text-3xl leading-tight">Vos souvenirs<br />pour vos <em className="not-italic text-primary">petits-enfants</em></h1>
        <p className="mt-2 max-w-md text-sm text-background/80">
          Les fichiers sont chiffrés, redondés sur 3 sites européens, et migrés au fil des formats. Un accès garanti même dans 50 ans.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-background/10 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">2 148</p>
            <p className="text-[10px] uppercase tracking-wider text-background/60">Fichiers</p>
          </div>
          <div className="rounded-2xl bg-background/10 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">47</p>
            <p className="text-[10px] uppercase tracking-wider text-background/60">Go</p>
          </div>
          <div className="rounded-2xl bg-background/10 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none text-primary">100%</p>
            <p className="text-[10px] uppercase tracking-wider text-background/60">Chiffrés</p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-serif text-lg">Choisir un plan</h2>
        <ul className="space-y-3">
          {plans.map((p) => {
            const Icon = p.icon;
            const on = plan === p.id;
            return (
              <li key={p.id}>
                <button
                  onClick={() => setPlan(p.id)}
                  className={`relative w-full overflow-hidden rounded-3xl border p-4 text-left transition ${
                    on ? "border-primary bg-primary/5" : "border-border/60 bg-card"
                  }`}
                >
                  {p.best && (
                    <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">
                      Recommandé
                    </span>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/40">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-[15px] leading-tight">{p.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" /> Conservation {p.duration}
                      </p>
                      <p className="mt-1 font-serif text-lg leading-none text-primary">{p.price}</p>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[12px]">
                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-4 mt-6 space-y-2">
        <div className="rounded-3xl border border-border/60 bg-card p-4">
          <p className="text-[10px] uppercase tracking-wider text-primary">Bénéficiaires</p>
          <p className="mt-1 font-serif text-base">Sarah Bernard · Thomas Bernard</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Ajoutez jusqu'à 5 personnes qui hériteront de l'accès complet.</p>
          <button className="mt-3 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold">+ Ajouter un héritier</button>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-4">
          <p className="text-[10px] uppercase tracking-wider text-primary">Format de conservation</p>
          <p className="mt-1 font-serif text-base">JPEG XL · H.265 · FLAC</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Nous re-encoderons automatiquement lorsque de nouveaux formats seront adoptés.</p>
        </div>
      </section>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Coffret bois gravé</p>
        <p className="mt-2 font-serif text-lg leading-tight">Un objet à transmettre</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          SSD 1 To, gravure prénoms & date, écrin chêne — livré 6 semaines après l'événement.
        </p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Ajouter au plan · +89 €
        </button>
      </section>
    </div>
  );
}
