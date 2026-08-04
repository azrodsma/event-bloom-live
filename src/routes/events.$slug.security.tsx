import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Phone, MapPin, AlertTriangle, Heart, Sparkles, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/events/$slug/security")({
  component: Security,
  head: () => ({
    meta: [
      { title: "Sécurité & urgences · MaFeliza" },
      { name: "description", content: "Consignes de sécurité, numéros d'urgence et plan d'évacuation à portée de main." },
      { property: "og:title", content: "Sécurité & urgences · MaFeliza" },
      { property: "og:description", content: "Faire la fête, en confiance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const emergencies = [
  { emoji: "🚑", label: "SAMU", number: "15", tint: "bg-rose-50 text-rose-700" },
  { emoji: "🚓", label: "Police", number: "17", tint: "bg-sky-50 text-sky-700" },
  { emoji: "🚒", label: "Pompiers", number: "18", tint: "bg-amber-50 text-amber-700" },
  { emoji: "☎️", label: "Urgences EU", number: "112", tint: "bg-emerald-50 text-emerald-700" },
];

const staff = [
  { role: "Coordinatrice", name: "Camille Vidal", phone: "06 12 34 56 78", tag: "Wedding planner" },
  { role: "Secouriste sur place", name: "Julien Roux", phone: "06 22 44 88 12", tag: "Diplômé PSC1" },
  { role: "Sécurité entrée", name: "Karim Bensaïd", phone: "06 55 66 77 88", tag: "Agent SSIAP" },
];

const zones = [
  { id: "z1", label: "Sortie de secours 1", detail: "Côté sud, près de la cuisine", color: "bg-emerald-500" },
  { id: "z2", label: "Sortie de secours 2", detail: "Nord du chapiteau", color: "bg-emerald-500" },
  { id: "z3", label: "Point de rassemblement", detail: "Parking, sous le tilleul", color: "bg-primary" },
  { id: "z4", label: "Extincteurs", detail: "Bar, cuisine, entrée", color: "bg-rose-500" },
  { id: "z5", label: "Défibrillateur", detail: "Accueil (mur droit)", color: "bg-amber-500" },
];

const rules = [
  { emoji: "🚭", label: "Zone fumeurs uniquement sur la terrasse ouest" },
  { emoji: "🍾", label: "Pas de bouteilles en verre sur la piste" },
  { emoji: "🐕", label: "Animaux tenus en laisse, non admis dans la salle" },
  { emoji: "🎆", label: "Feux d'artifice interdits (Bengale autorisés)" },
];

function Security() {
  const { slug } = useParams({ from: "/events/$slug/security" });

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Sécurité</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/40 to-transparent" />
        <div className="relative px-4 pb-6 pt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Domaine sécurisé · SSIAP 1
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-tight">
            Faire la fête,<br />
            <span className="italic text-primary">en confiance</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Tout ce qu'il faut savoir en cas d'imprévu — gardez cette page à portée de main.
          </p>
        </div>
      </section>

      <section className="px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Numéros d'urgence</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {emergencies.map((e) => (
            <a
              key={e.number}
              href={`tel:${e.number}`}
              className={`flex items-center gap-2.5 rounded-2xl border border-border/60 p-3 ${e.tint}`}
            >
              <span className="text-2xl">{e.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wider">{e.label}</p>
                <p className="font-serif text-2xl leading-none">{e.number}</p>
              </div>
              <Phone className="h-4 w-4 opacity-60" />
            </a>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Équipe sur place</p>
        <ul className="mt-2 space-y-2">
          {staff.map((s) => (
            <li key={s.name} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {s.role} · {s.tag}
                </p>
              </div>
              <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-[11px] font-bold text-background">
                <Phone className="h-3 w-3" /> Appeler
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" /> Plan d'évacuation
        </div>
        <div className="mt-3 overflow-hidden rounded-3xl border border-border/60 bg-card">
          <div className="relative h-56 w-full bg-gradient-to-br from-accent/40 via-secondary to-primary/5">
            <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
              <rect x="10" y="10" width="80" height="40" rx="3" className="fill-white/60 stroke-foreground/20" strokeWidth="0.4" />
              <path d="M40 10 L40 50 M60 30 L90 30" className="stroke-foreground/25" strokeWidth="0.3" strokeDasharray="1 1" />
              <text x="24" y="22" className="fill-foreground/40" fontSize="3.5">Salle</text>
              <text x="72" y="22" className="fill-foreground/40" fontSize="3.5">Bar</text>
              <text x="72" y="44" className="fill-foreground/40" fontSize="3.5">Cuisine</text>
            </svg>
            {/* Marker pins */}
            <span className="absolute left-[12%] top-[38%] flex flex-col items-center">
              <span className="h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              <span className="mt-0.5 rounded bg-white/90 px-1 text-[8px] font-bold">S1</span>
            </span>
            <span className="absolute right-[10%] top-[18%] flex flex-col items-center">
              <span className="h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              <span className="mt-0.5 rounded bg-white/90 px-1 text-[8px] font-bold">S2</span>
            </span>
            <span className="absolute left-1/2 bottom-[8%] flex -translate-x-1/2 flex-col items-center">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-white ring-2 ring-white text-[10px] font-bold">
                ✿
              </span>
              <span className="mt-0.5 rounded bg-white/90 px-1 text-[8px] font-bold">Rassemblement</span>
            </span>
            <span className="absolute right-[30%] top-[45%] h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
          </div>

          <ul className="divide-y divide-border/60">
            {zones.map((z) => (
              <li key={z.id} className="flex items-center gap-3 px-4 py-3">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${z.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{z.label}</p>
                  <p className="text-[10px] text-muted-foreground">{z.detail}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Règles de la maison</p>
        <ul className="mt-2 space-y-1.5">
          {rules.map((r) => (
            <li key={r.label} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/60">
              <span className="text-xl">{r.emoji}</span>
              <span className="text-[12px]">{r.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-4 mt-8 rounded-3xl border border-primary/30 bg-primary/5 p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
          <AlertTriangle className="h-3.5 w-3.5" /> Signaler un incident
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Quelque chose ne va pas ?</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Contactez discrètement l'équipe. Toute alerte est traitée en moins de 2 minutes.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="rounded-full bg-foreground py-2.5 text-xs font-bold text-background">Alerter l'équipe</button>
          <button className="rounded-full border border-border bg-background py-2.5 text-xs font-semibold">Signalement anonyme</button>
        </div>
      </section>

      <div className="mx-4 mt-6 flex items-center gap-3 rounded-3xl bg-secondary/40 p-4 text-[11px] text-muted-foreground">
        <Heart className="h-5 w-5 shrink-0 text-primary" />
        <p>Un mineur, une personne en détresse, un consentement à respecter — parler à un·e coordinateur·rice ne dérange jamais.</p>
      </div>
    </div>
  );
}
