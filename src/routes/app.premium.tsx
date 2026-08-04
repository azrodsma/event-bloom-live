import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Check, Sparkles, Crown, Infinity as InfinityIcon, Video, Users, Palette, HeartHandshake } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/premium")({
  head: () => ({
    meta: [
      { title: "Passer en Premium — MaFeliza" },
      { name: "description", content: "Débloquez tous les modules et créez des souvenirs sans limite avec MaFeliza Premium." },
      { property: "og:title", content: "MaFeliza Premium" },
      { property: "og:description", content: "Événements illimités, live HD, livre souvenir imprimé et bien plus." },
    ],
  }),
  component: Premium,
});

const plans = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: { m: 0, y: 0 },
    tagline: "Pour un événement",
    highlight: false,
    features: [
      "1 événement actif",
      "Jusqu'à 30 invités",
      "Livre d'or texte",
      "Live intégré (SD)",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: { m: 14, y: 9 },
    tagline: "Le plus choisi",
    highlight: true,
    features: [
      "Événements illimités",
      "Jusqu'à 500 invités par événement",
      "Livre d'or multimédia (photo, vocal, vidéo)",
      "Live HD + multi-caméras",
      "Album collaboratif illimité",
      "Souvenir imprimable inclus",
      "Support prioritaire",
    ],
  },
  {
    id: "pro",
    name: "Cérémonie",
    price: { m: 39, y: 29 },
    tagline: "Wedding planners & pros",
    highlight: false,
    features: [
      "Tout Premium",
      "Marque blanche · logo & couleurs",
      "Domaine personnalisé",
      "Statistiques avancées",
      "Multi-organisateurs",
    ],
  },
];

function Premium() {
  const [cycle, setCycle] = useState<"m" | "y">("y");
  const [selected, setSelected] = useState("premium");

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
        <Link to="/app/settings" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 font-serif text-xl">MaFeliza Premium</h1>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-white shadow-glow">
          <Sparkles className="absolute -right-4 -top-4 h-24 w-24 text-white/10" />
          <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-3 py-1 text-[11px] font-bold uppercase tracking-widest backdrop-blur">
            <Crown className="h-3 w-3" /> Premium
          </span>
          <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
            Des souvenirs sans limites, pour toutes vos plus belles occasions.
          </h2>
          <p className="mt-2 text-sm opacity-90">
            Événements illimités, live HD, livre imprimé et modules premium — à un tarif doux.
          </p>
        </section>

        {/* Cycle toggle */}
        <div className="mx-auto flex w-fit items-center gap-1 rounded-full border border-border bg-background p-1 text-sm">
          {(["m", "y"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCycle(c)}
              className={`rounded-full px-4 py-1.5 font-semibold transition-colors ${
                cycle === c ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              {c === "m" ? "Mensuel" : "Annuel"}
              {c === "y" && (
                <span className="ml-1.5 rounded-full bg-gold-light px-1.5 py-0.5 text-[9px] font-bold text-gold">-35%</span>
              )}
            </button>
          ))}
        </div>

        {/* Plans */}
        <section className="space-y-3">
          {plans.map((p) => {
            const active = selected === p.id;
            const price = p.price[cycle];
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`w-full rounded-3xl border-2 p-5 text-left transition-all ${
                  active
                    ? "border-primary bg-surface shadow-glow"
                    : p.highlight
                    ? "border-primary/30 bg-surface shadow-card"
                    : "border-border bg-background"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-serif text-xl">{p.name}</p>
                      {p.highlight && (
                        <span className="rounded-full bg-gold-light px-2 py-0.5 text-[10px] font-bold uppercase text-gold">
                          Populaire
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.tagline}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-3xl leading-none">
                      {price === 0 ? "Gratuit" : `${price} €`}
                    </p>
                    {price !== 0 && (
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        / mois {cycle === "y" ? "· facturé annuellement" : ""}
                      </p>
                    )}
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                        p.highlight ? "bg-primary text-white" : "bg-primary-light text-primary"
                      }`}>
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </section>

        {/* Perks grid */}
        <section>
          <h3 className="mb-3 font-serif text-2xl">Ce que vous gagnez</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: InfinityIcon, title: "Événements illimités", desc: "Créez autant d'occasions que la vie vous en offre." },
              { icon: Video, title: "Live HD multi-cam", desc: "Diffusion premium via YouTube ou Twitch." },
              { icon: Users, title: "Jusqu'à 500 invités", desc: "Réunissez toute la famille et les amis." },
              { icon: Palette, title: "Marque personnalisée", desc: "Couleurs & faire-part à votre image." },
              { icon: HeartHandshake, title: "Support prioritaire", desc: "Une équipe qui répond en moins d'une heure." },
              { icon: Sparkles, title: "Livre souvenir imprimé", desc: "Un exemplaire relié offert chaque année." },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl bg-surface p-4 shadow-card">
                <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary-light text-primary">
                  <p.icon className="h-4 w-4" />
                </div>
                <p className="mt-3 font-serif text-base leading-tight">{p.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ils nous ont fait confiance</p>
          <p className="mt-3 font-serif text-lg leading-relaxed">
            « Grâce à MaFeliza, ma grand-mère a pu assister au mariage depuis l'hôpital. Un cadeau inestimable. »
          </p>
          <div className="mt-3 flex items-center gap-2">
            <img src="https://i.pravatar.cc/40?img=47" alt="" className="h-8 w-8 rounded-full" />
            <div>
              <p className="text-sm font-semibold">Sarah & Thomas</p>
              <p className="text-[11px] text-muted-foreground">Mariage · août 2025</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-2">
          <h3 className="font-serif text-2xl">Questions fréquentes</h3>
          {[
            { q: "Puis-je annuler à tout moment ?", a: "Oui, sans engagement. Vous conservez l'accès jusqu'à la fin de la période." },
            { q: "Les cagnottes sont-elles incluses ?", a: "MaFeliza ne gère pas les fonds. Les cagnottes sont hébergées par Leetchi, Lydia, etc." },
            { q: "Le live consomme-t-il des crédits ?", a: "Non, MaFeliza encapsule votre live YouTube ou Twitch existant, sans surcoût vidéo." },
          ].map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-background p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold">
                {f.q}
                <span className="float-right text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-2 text-xs text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </section>
      </main>

      {/* CTA bar */}
      <div className="fixed inset-x-0 bottom-16 z-10 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Vous avez choisi</p>
            <p className="font-serif text-lg leading-tight">
              {plans.find((p) => p.id === selected)?.name} ·{" "}
              <span className="text-primary">
                {plans.find((p) => p.id === selected)?.price[cycle]} €/mois
              </span>
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow">
            <Crown className="h-4 w-4" /> Passer Premium
          </button>
        </div>
      </div>
    </div>
  );
}
